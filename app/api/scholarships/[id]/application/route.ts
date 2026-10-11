import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertApplication } from "@/lib/scholarships/query";
import { z } from "zod";

const ApplicationSchema = z.object({
  status: z.enum([
    "saved", "planning", "applying", "submitted",
    "accepted", "rejected", "withdrawn",
  ]),
  notes: z.string().max(2000).optional(),
  checklist_json: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        done: z.boolean(),
      })
    )
    .optional(),
  submitted_at: z.string().datetime().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { data: null, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { data: null, error: { code: "BAD_REQUEST", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = ApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues.map((i) => i.message).join(", "),
        },
      },
      { status: 422 }
    );
  }

  const result = await upsertApplication(user.id, id, parsed.data);

  if (result.error) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 200 });
}
