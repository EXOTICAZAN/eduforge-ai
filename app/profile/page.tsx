import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold text-white">
        Profile Settings
      </h1>

      <p className="mt-2 text-slate-400">
        Manage your EduForge AI profile.
      </p>

      <ProfileForm profile={profile} />
    </div>
  );
}