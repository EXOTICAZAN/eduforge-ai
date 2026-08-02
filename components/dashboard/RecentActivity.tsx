"use client";

import { motion } from "framer-motion";
import { MessageSquare, Layers, Trophy, BookOpen, CheckCircle2 } from "lucide-react";
import { ease } from "@/lib/motion";

const activities = [
  { icon: MessageSquare, text: "AI Tutor session · Quantum Physics", time: "14 min ago", color: "text-indigo-400 bg-indigo-500/15" },
  { icon: Layers, text: "Reviewed 24 flashcards · Biology", time: "1h ago", color: "text-purple-400 bg-purple-500/15" },
  { icon: Trophy, text: "Matched scholarship · DeepMind Fellowship", time: "3h ago", color: "text-amber-400 bg-amber-500/15" },
  { icon: BookOpen, text: "Completed chapter · Linear Algebra", time: "Yesterday", color: "text-emerald-400 bg-emerald-500/15" },
  { icon: CheckCircle2, text: "Quiz score 92% · Machine Learning", time: "Yesterday", color: "text-sky-400 bg-sky-500/15" },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Recent activity
      </h2>
      <div className="space-y-3">
        {activities.map((a, i) => (
          <motion.div
            key={a.text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.05, ease }}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.03]"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${a.color}`}>
              <a.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] text-slate-200">{a.text}</p>
              <p className="text-[11px] text-slate-500">{a.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
