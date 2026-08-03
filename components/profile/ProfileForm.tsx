"use client";

import { useState } from "react";

interface Profile {
  full_name: string | null;
  country: string | null;
  grade: string | null;
  learning_goal: string | null;
  target_degree: string | null;
  preferred_language: string | null;
}

interface ProfileFormProps {
  profile: Profile | null;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [grade, setGrade] = useState(profile?.grade ?? "");
  const [goal, setGoal] = useState(profile?.learning_goal ?? "");

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold text-white">
        Edit Profile
      </h2>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Full Name
          </label>

          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Country
          </label>

          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Grade
          </label>

          <input
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Learning Goal
          </label>

          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white"
          />
        </div>

        <button
          className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}