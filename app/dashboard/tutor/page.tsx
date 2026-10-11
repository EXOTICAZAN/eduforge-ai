import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ChatSidebar from "@/components/chat/ChatSidebar";
import NewChatPanel from "@/components/chat/NewChatPanel";

export const metadata = { title: "AI Tutor — EduForge AI" };

export default async function TutorPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: chats }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("chats")
      .select("id, title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const name = profile?.full_name || user.email?.split("@")[0] || "Learner";

  return (
    <DashboardShell userName={name} userEmail={user.email ?? ""}>
      <div className="mx-auto grid h-[calc(100vh-11rem)] max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <div className="hidden lg:block">
          <ChatSidebar chats={chats ?? []} />
        </div>

        <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="flex-1 overflow-y-auto">
            <NewChatPanel userName={name} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
