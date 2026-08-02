"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

interface WelcomeBannerProps {
  name: string;
}

export default function WelcomeBanner({ name }: WelcomeBannerProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-[60px]" />
      <div className="relative">
        <p className="text-sm font-medium text-indigo-300">{greeting}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Welcome back, {name}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-slate-400">
          You&apos;re on a 12-day streak. Keep the momentum — your next AI Tutor session is ready.
        </p>
      </div>
    </motion.div>
  );
}
