import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCards from "@/components/dashboard/StatCards";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ProgressCharts from "@/components/dashboard/ProgressCharts";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Learner";

  return (
    <DashboardShell userName={name} userEmail={user.email ?? ""}>
      <div className="mx-auto max-w-7xl space-y-6">
        <WelcomeBanner name={name.split(" ")[0]} />
        <StatCards />
        <QuickActions />
        <ProgressCharts />
        <div className="grid gap-4 lg:grid-cols-2">
          <RecentActivity />
          <UpcomingTasks />
        </div>
      </div>
    </DashboardShell>
  );
}
