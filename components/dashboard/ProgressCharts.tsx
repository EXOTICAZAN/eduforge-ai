"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

const courses = [
  { name: "Quantum Physics", progress: 72, color: "from-indigo-500 to-blue-500" },
  { name: "Linear Algebra", progress: 45, color: "from-purple-500 to-pink-500" },
  { name: "Machine Learning", progress: 88, color: "from-emerald-500 to-teal-500" },
  { name: "Organic Chemistry", progress: 31, color: "from-amber-500 to-orange-500" },
];

const weekly = [40, 65, 45, 80, 55, 90, 70];
const days = ["M", "T", "W", "T", "F", "S", "S"];

export default function ProgressCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Course progress */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Course progress
        </h2>
        <div className="space-y-4">
          {courses.map((c, i) => (
            <div key={c.name}>
              <div className="mb-1.5 flex justify-between text-[13px]">
                <span className="text-slate-300">{c.name}</span>
                <span className="text-slate-500">{c.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1, ease }}
                  className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly study time */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Study time this week
        </h2>
        <div className="flex h-40 items-end justify-between gap-2">
          {weekly.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease }}
                className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 opacity-80"
              />
              <span className="text-[11px] text-slate-500">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
