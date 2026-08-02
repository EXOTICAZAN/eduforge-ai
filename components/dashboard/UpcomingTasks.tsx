"use client";

import { motion } from "framer-motion";
import { Clock, Circle } from "lucide-react";
import { ease } from "@/lib/motion";

const tasks = [
  { title: "Review Linear Algebra flashcards", time: "Today · 25 min", priority: "high" },
  { title: "Complete Quantum Physics quiz", time: "Today · 40 min", priority: "high" },
  { title: "AI Tutor: Neural Networks intro", time: "Tomorrow · 1h", priority: "med" },
  { title: "Scholarship essay draft", time: "Wed · 2h", priority: "med" },
  { title: "Organic Chemistry chapter 4", time: "Fri · 45 min", priority: "low" },
];

const priorityColor: Record<string, string> = {
  high: "bg-rose-500",
  med: "bg-amber-500",
  low: "bg-slate-500",
};

export default function UpcomingTasks() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Upcoming tasks
      </h2>
      <div className="space-y-2.5">
        {tasks.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.05, ease }}
            className="flex items-start gap-3 rounded-xl border border-transparent px-2 py-2.5 transition-colors hover:border-white/[0.06] hover:bg-white/[0.03]"
          >
            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${priorityColor[t.priority]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-slate-200">{t.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="h-3 w-3" />
                {t.time}
              </p>
            </div>
            <button
              type="button"
              className="mt-0.5 text-slate-600 transition-colors hover:text-indigo-400"
              aria-label="Mark complete"
            >
              <Circle className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
