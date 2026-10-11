"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Save } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Badge";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { saveProfile } from "@/app/dashboard/settings/actions";
import { fadeUp, stagger } from "@/lib/motion";
import type { ProfileData } from "./SettingsClient";

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Hindi",
  "Chinese",
  "Portuguese",
  "Urdu",
];

const PROFILE_KEYS = [
  "full_name",
  "country",
  "grade",
  "learning_goal",
  "target_degree",
  "preferred_language",
] as const;

interface Props {
  profile: ProfileData;
  email: string;
  onDirtyChange: (dirty: boolean) => void;
}

export default function ProfileSection({ profile, email, onDirtyChange }: Props) {
  const [baseline, setBaseline] = useState<ProfileData>(profile);
  const [form, setForm] = useState<ProfileData>(profile);
  const [saving, setSaving] = useState(false);

  const dirty = PROFILE_KEYS.some((key) => form[key] !== baseline[key]);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty || saving) return;

    setSaving(true);
    try {
      const res = await saveProfile(form);
      if (!res.ok) throw new Error(res.error ?? "Could not save your profile.");

      setBaseline(form);
      toast.success("Profile saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp}>
        <Card>
          <CardTitle>Profile</CardTitle>

          <form onSubmit={onSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <Input
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="e.g. Ayesha Khan"
                  maxLength={120}
                  disabled={saving}
                />
              </Field>

              <Field
                label="Email"
                hint="Your sign-in email can't be changed here."
              >
                <Input
                  value={email}
                  readOnly
                  tabIndex={-1}
                  className="cursor-default text-slate-400"
                />
              </Field>

              <Field label="Country">
                <Input
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  placeholder="e.g. Pakistan"
                  maxLength={80}
                  disabled={saving}
                />
              </Field>

              <Field label="Grade / level">
                <Input
                  value={form.grade}
                  onChange={(e) => set("grade", e.target.value)}
                  placeholder="e.g. Year 12 / A-levels / 2nd year university"
                  maxLength={80}
                  disabled={saving}
                />
              </Field>

              <Field label="Target degree">
                <Input
                  value={form.target_degree}
                  onChange={(e) => set("target_degree", e.target.value)}
                  placeholder="e.g. BSc Computer Science"
                  maxLength={120}
                  disabled={saving}
                />
              </Field>

              <Field label="Preferred language">
                <Select
                  value={form.preferred_language}
                  onChange={(e) => set("preferred_language", e.target.value)}
                  disabled={saving}
                >
                  {LANGUAGES.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Learning goal">
              <Textarea
                value={form.learning_goal}
                onChange={(e) => set("learning_goal", e.target.value)}
                placeholder="What are you working towards? Scholarships, exams, a degree…"
                maxLength={1000}
                disabled={saving}
              />
            </Field>

            <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-4">
              {dirty && (
                <span className="mr-auto text-[12px] text-amber-300">
                  Unsaved changes
                </span>
              )}
              <Button
                type="button"
                variant="ghost"
                onClick={() => setForm(baseline)}
                disabled={!dirty || saving}
              >
                Reset
              </Button>
              <Button type="submit" disabled={!dirty} loading={saving}>
                <Save className="h-4 w-4" />
                Save profile
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
