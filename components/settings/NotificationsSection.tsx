"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardTitle } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Field";
import { updateSettingsFlag } from "@/app/dashboard/settings/actions";
import type { SettingsFlag } from "@/app/dashboard/settings/actions";
import { fadeUp, stagger } from "@/lib/motion";
import type { SettingsData } from "./SettingsClient";

interface Props {
  settings: SettingsData;
}

export default function NotificationsSection({ settings }: Props) {
  const [flags, setFlags] = useState({
    email_notifications: settings.email_notifications,
    push_notifications: settings.push_notifications,
    study_reminders: settings.study_reminders,
    public_profile: settings.public_profile,
  });
  const [pending, setPending] = useState<SettingsFlag | null>(null);

  async function onToggle(field: SettingsFlag, next: boolean) {
    const previous = flags[field];
    setFlags((prev) => ({ ...prev, [field]: next }));
    setPending(field);

    const res = await updateSettingsFlag(field, next);
    setPending(null);

    if (!res.ok) {
      setFlags((prev) => ({ ...prev, [field]: previous }));
      toast.error(res.error ?? "Could not update that setting.");
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp}>
        <Card>
          <CardTitle>Notifications</CardTitle>
          <p className="-mt-2 mb-2 text-[12px] text-slate-500">
            Changes are saved as soon as you flip a switch.
          </p>

          <div className="divide-y divide-white/[0.05]">
            <Toggle
              label="Email notifications"
              description="Weekly progress summaries and important account updates."
              checked={flags.email_notifications}
              disabled={pending === "email_notifications"}
              onChange={(next) => void onToggle("email_notifications", next)}
            />
            <Toggle
              label="Push notifications"
              description="Real-time alerts in your browser while you study."
              checked={flags.push_notifications}
              disabled={pending === "push_notifications"}
              onChange={(next) => void onToggle("push_notifications", next)}
            />
            <Toggle
              label="Study reminders"
              description="Nudges when you're about to miss your daily study goal."
              checked={flags.study_reminders}
              disabled={pending === "study_reminders"}
              onChange={(next) => void onToggle("study_reminders", next)}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card>
          <CardTitle>Privacy</CardTitle>

          <Toggle
            label="Public profile"
            description="Allow your name, grade and study stats to appear on leaderboards and shared scholarship lists. Turn this off to stay invisible to other learners."
            checked={flags.public_profile}
            disabled={pending === "public_profile"}
            onChange={(next) => void onToggle("public_profile", next)}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
}
