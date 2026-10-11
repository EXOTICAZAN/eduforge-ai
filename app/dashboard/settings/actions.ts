"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity, XP } from "@/lib/study/activity";
import type { ActionResult, ProfileRow, UserSettingsRow } from "@/lib/study/types";

// =============================================================
// Settings — mutations.
// Returns an ActionResult envelope so the UI can toast real
// errors instead of failing silently.
// =============================================================

export interface ProfileInput {
  full_name: string;
  country: string;
  grade: string;
  learning_goal: string;
  target_degree: string;
  preferred_language: string;
}

export interface PreferencesInput {
  theme: string;
  daily_goal_minutes: number;
}

const SETTINGS_FLAGS = [
  "email_notifications",
  "push_notifications",
  "study_reminders",
  "public_profile",
] as const;

export type SettingsFlag = (typeof SETTINGS_FLAGS)[number];

const SUPPORTED_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Hindi",
  "Chinese",
  "Portuguese",
  "Urdu",
] as const;

const SUPPORTED_THEMES = ["dark", "light", "system"] as const;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function saveProfile(
  input: ProfileInput
): Promise<ActionResult<ProfileRow>> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const fullName = input.full_name?.trim();
  if (!fullName) return { ok: false, error: "Full name is required." };

  const language = input.preferred_language?.trim() || "English";
  if (!SUPPORTED_LANGUAGES.includes(language as (typeof SUPPORTED_LANGUAGES)[number])) {
    return { ok: false, error: "Unsupported preferred language." };
  }

  // Upsert keyed on the auth user id so it works whether or not a
  // profiles row already exists (the old .update() silently no-oped).
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? null,
      full_name: fullName,
      country: input.country?.trim() || null,
      grade: input.grade?.trim() || null,
      learning_goal: input.learning_goal?.trim() || null,
      target_degree: input.target_degree?.trim() || null,
      preferred_language: language,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[settings] profile save failed:", error?.message);
    return {
      ok: false,
      error: "Could not save your profile.",
    };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");

  const completedNow =
    Boolean(fullName) &&
    Boolean(input.country?.trim()) &&
    Boolean(input.grade?.trim()) &&
    Boolean(input.learning_goal?.trim()) &&
    Boolean(input.target_degree?.trim());

  if (completedNow) {
    const { data: prior } = await supabase
      .from("activity_log")
      .select("id")
      .eq("user_id", user.id)
      .eq("activity_type", "profile")
      .limit(1);

    if (!prior || prior.length === 0) {
      await logActivity({
        type: "profile",
        label: "Completed profile",
        xp: XP.profile_completed,
      });
    }
  }

  return { ok: true, data: data as ProfileRow };
}

export async function savePreferences(
  input: PreferencesInput
): Promise<ActionResult<UserSettingsRow>> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const theme = SUPPORTED_THEMES.includes(input.theme as (typeof SUPPORTED_THEMES)[number])
    ? input.theme
    : "dark";

  const minutes = Math.round(Number(input.daily_goal_minutes));
  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 600) {
    return {
      ok: false,
      error: "Daily goal must be between 5 and 600 minutes.",
    };
  }

  // Lazy-creates the settings row on first save; later saves only
  // touch the provided columns.
  const { data, error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        theme,
        daily_goal_minutes: minutes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error || !data) {
    console.error("[settings] preferences save failed:", error?.message);
    return {
      ok: false,
      error: "Could not save your preferences.",
    };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true, data: data as UserSettingsRow };
}

export async function updateSettingsFlag(
  field: SettingsFlag,
  value: boolean
): Promise<ActionResult<UserSettingsRow>> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  // Server actions are callable with any serialized arguments, so the
  // compile-time type on `field` is not a runtime guarantee — it is
  // interpolated directly into the upsert as a column name.
  if (!SETTINGS_FLAGS.includes(field)) {
    return { ok: false, error: "Unknown setting." };
  }

  const { data, error } = await supabase
    .from("user_settings")
    .upsert(
      {
        user_id: user.id,
        [field]: value === true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error || !data) {
    console.error(`[settings] ${field} update failed:`, error?.message);
    return {
      ok: false,
      error: "Could not update that setting.",
    };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true, data: data as UserSettingsRow };
}

export async function deleteAllUserData(): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const fail = (what: string, error: unknown): ActionResult => {
    console.error(`[settings] delete ${what} failed:`, error);
    return { ok: false, error: `Could not clear your ${what}. Please try again.` };
  };

  // messages hang off chats rather than the user, so collect the ids first.
  const { data: chats, error: chatsReadError } = await supabase
    .from("chats")
    .select("id")
    .eq("user_id", user.id);

  if (chatsReadError) return fail("chats", chatsReadError);

  const chatIds = (chats ?? []).map((c: { id: string }) => c.id);
  for (let i = 0; i < chatIds.length; i += 500) {
    const { error } = await supabase
      .from("messages")
      .delete()
      .in("chat_id", chatIds.slice(i, i + 500));
    if (error) return fail("messages", error);
  }

  // Children first so FKs are respected even where cascades exist.
  const tables = [
    "document_chunks",
    "chats",
    "quiz_attempts",
    "quiz_questions",
    "flashcards",
    "quizzes",
    "flashcard_decks",
    "notes",
    "documents",
    "study_tasks",
    "activity_log",
    "notifications",
    "user_settings",
    "saved_scholarships",
    "scholarship_applications",
    "student_scholarship_profiles",
  ] as const;

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("user_id", user.id);
    if (error) return fail(table.replace(/_/g, " "), error);
  }

  // The uploaded PDFs live in Storage, not Postgres — deleting the rows alone
  // would leave the files behind.
  for (;;) {
    const { data: objects, error: listError } = await supabase.storage
      .from("documents")
      .list(user.id, { limit: 1000 });

    if (listError) return fail("uploaded files", listError);
    if (!objects?.length) break;

    const paths = objects.map((object) => `${user.id}/${object.name}`);
    const { error: removeError } = await supabase.storage.from("documents").remove(paths);
    if (removeError) return fail("uploaded files", removeError);
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
