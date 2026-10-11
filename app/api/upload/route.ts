import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractPdfText } from "@/lib/pdf/extractText";
import { ingestDocument } from "@/lib/rag/ingestDocument";
import { consume, tooManyRequests } from "@/lib/api/rateLimit";

// The whole file is buffered in memory before parsing, so an uncapped upload
// is a memory-exhaustion vector. 25 MB is generous for a text PDF.
const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // ==========================
    // AUTHENTICATION
    // ==========================

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Embedding runs locally and pins a CPU core for the whole document.
    const limit = consume("upload", user.id, 10);
    if (!limit.ok) return tooManyRequests(limit.retryAfterMs);

    // ==========================
    // READ FORM DATA
    // ==========================

    // Reject on the declared length before buffering the body at all.
    const declared = Number(req.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > MAX_BYTES) {
      return NextResponse.json(
        { error: `File is too large. The limit is ${MAX_BYTES / 1024 / 1024} MB.` },
        { status: 413 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const chatId = formData.get("chatId") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File is too large. The limit is ${MAX_BYTES / 1024 / 1024} MB.` },
        { status: 413 }
      );
    }

    // Only PDFs can be parsed downstream; anything else fails deep inside
    // pdf2json with an opaque message.
    if (file.type && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 415 }
      );
    }

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    // ==========================
    // VERIFY CHAT OWNERSHIP
    // ==========================

    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .select("id")
      .eq("id", chatId)
      .eq("user_id", user.id)
      .single();

    if (chatError || !chat) {
      return NextResponse.json(
        { error: "Chat not found or unauthorized" },
        { status: 404 }
      );
    }

    // ==========================
    // GENERATE SAFE FILENAME
    // ==========================

    // Never derive the storage key from a user-supplied filename.
    const safeFileName = `${crypto.randomUUID()}.pdf`;

    const filePath = `${user.id}/${safeFileName}`;

    // ==========================
    // READ FILE
    // ==========================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ==========================
    // EXTRACT PDF TEXT
    // ==========================

    const extractedText = await extractPdfText(buffer);

    if (!extractedText.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. The PDF may be scanned/image-only.",
        },
        { status: 400 }
      );
    }

    // ==========================
    // UPLOAD PDF TO SUPABASE STORAGE
    // ==========================

    const { error: uploadError } =
      await supabase.storage
        .from("documents")
        .upload(filePath, buffer, {
          contentType:
            file.type || "application/pdf",
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Storage Error:",
        uploadError
      );

      return NextResponse.json(
        { error: "Could not store the file." },
        { status: 500 }
      );
    }

    // ==========================
    // SAVE DOCUMENT METADATA
    // ==========================

    const {
      data: document,
      error: dbError,
    } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        file_name: file.name,
        storage_path: filePath,
      })
      .select()
      .single();

    if (dbError || !document) {
      console.error(
        "Database Error:",
        dbError
      );

      return NextResponse.json(
        { error: "Could not save the document." },
        { status: 500 }
      );
    }

    // ==========================
    // CONNECT DOCUMENT TO CHAT
    // ==========================

    const {
      error: chatUpdateError,
    } = await supabase
      .from("chats")
      .update({
        document_id: document.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId)
      .eq("user_id", user.id);

    if (chatUpdateError) {
      console.error(
        "Chat Update Error:",
        chatUpdateError
      );

      return NextResponse.json(
        {
          error:
            "Document uploaded, but could not link it to the chat.",
        },
        { status: 500 }
      );
    }

    // ==========================
    // INGEST DOCUMENT
    // ==========================

    const ingestionResult =
      await ingestDocument(
        document.id,
        user.id,
        buffer
      );

    // ==========================
    // FINAL RESPONSE
    // ==========================

    return NextResponse.json({
      success: true,
      chatId,
      filePath,
      documentId: document.id,
      extractedLength:
        extractedText.length,
      chunks:
        ingestionResult.chunks,
    });

  } catch (err) {
    console.error("Upload route failed:", err);

    return NextResponse.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}