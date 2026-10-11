import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsClient from "@/components/settings/SettingsClient";
import type { ProfileRow, UserSettingsRow } from "@/lib/study/types";
import {
  TAB_IDS,
  type ProfileData,
  type SettingsData,
  type TabId,
} from "@/components/settings/SettingsClient";

export const metadata = { title: "Settings — EduForge AI" };

const DEFAULT_SETTINGS: SettingsData = {
  theme: "dark",
  daily_goal_minutes: 60,
  email_notifications: true,
  push_notifications: false,
  study_reminders: true,
  public_profile: false,
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { tab } = await searchParams;
  const initialTab: TabId = TAB_IDS.includes(tab as TabId)
    ? (tab as TabId)
    : "profile";

  const [{ data: profileRow }, { data: settingsRow }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const profile = profileRow as ProfileRow | null;
  const settings = settingsRow as UserSettingsRow | null;

  const meta = user.user_metadata as { full_name?: string };
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const projectRef =
    /https?:\/\/([^.]+)\./.exec(supabaseUrl)?.[1] ?? "unknown";

  const profileData: ProfileData = {
    full_name: profile?.full_name ?? meta.full_name ?? "",
    country: profile?.country ?? "",
    grade: profile?.grade ?? "",
    learning_goal: profile?.learning_goal ?? "",
    target_degree: profile?.target_degree ?? "",
    preferred_language: profile?.preferred_language ?? "English",
  };

  return (
    <SettingsClient
      userId={user.id}
      email={user.email ?? ""}
      userName={profileData.full_name || "Learner"}
      memberSince={profile?.created_at ?? user.created_at}
      projectRef={projectRef}
      profile={profileData}
      initialTab={initialTab}
      settings={
        settings
          ? {
              theme: settings.theme ?? DEFAULT_SETTINGS.theme,
              daily_goal_minutes:
                settings.daily_goal_minutes ?? DEFAULT_SETTINGS.daily_goal_minutes,
              email_notifications:
                settings.email_notifications ?? DEFAULT_SETTINGS.email_notifications,
              push_notifications:
                settings.push_notifications ?? DEFAULT_SETTINGS.push_notifications,
              study_reminders:
                settings.study_reminders ?? DEFAULT_SETTINGS.study_reminders,
              public_profile:
                settings.public_profile ?? DEFAULT_SETTINGS.public_profile,
            }
          : DEFAULT_SETTINGS
      }
    />
  );
}
