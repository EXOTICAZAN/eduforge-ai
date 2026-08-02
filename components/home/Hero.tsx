"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Play,
  Brain,
  BookOpen,
  Trophy,
  Mic,
  FileText,
  BarChart3,
  Map,
} from "lucide-react";
import { ease, blurReveal } from "@/lib/motion";
import LiveChat from "./LiveChat";

const floatingCards = [
  { icon: Brain, label: "AI Tutor", color: "from-indigo-500 to-blue-500", depth: 0.045, x: -18, y: -32, delay: 0.3 },
  { icon: BookOpen, label: "Flashcards", color: "from-purple-500 to-pink-500", depth: 0.07, x: 30, y: -52, delay: 0.45 },
  { icon: Trophy, label: "Scholarships", color: "from-amber-500 to-orange-500", depth: 0.035, x: -40, y: 36, delay: 0.6 },
  { icon: Mic, label: "Voice Tutor", color: "from-emerald-500 to-teal-500", depth: 0.08, x: 50, y: 16, delay: 0.75 },
  { icon: FileText, label: "PDF Chat", color: "from-sky-500 to-cyan-500", depth: 0.055, x: -14, y: 70, delay: 0.9 },
  { icon: Map, label: "Roadmaps", color: "from-violet-500 to-purple-500", depth: 0.04, x: 44, y: 74, delay: 1.05 },
  { icon: BarChart3, label: "Analytics", color: "from-rose-500 to-red-500", depth: 0.065, x: -50, y: -10, delay: 1.15 },
];

function FloatingPanel({
  card,
  mouseX,
  mouseY,
  reduced,
}: {
  card: (typeof floatingCards)[0];
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  reduced: boolean | null;
}) {
  const x = useTransform(mouseX, (v) => v * card.depth * 48);
  const y = useTransform(mouseY, (v) => v * card.depth * 48);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.65, y: 24 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: reduced ? 0 : [0, -12, 0],
      }}
      transition={{
        opacity: { delay: card.delay, duration: 0.65, ease },
        scale: { delay: card.delay, duration: 0.65, ease },
        y: reduced
          ? undefined
          : {
              delay: card.delay + 0.7,
              duration: 3.4 + card.depth * 22,
              repeat: Infinity,
              ease: "easeInOut",
            },
      }}
      style={{
        left: `${50 + card.x}%`,
        top: `${42 + card.y}%`,
        x: reduced ? 0 : x,
        y: reduced ? undefined : y,
      }}
      className="absolute hidden sm:flex"
    >
      <div className="group flex items-center gap-2.5 rounded-2xl border border-white/15 bg-[#0a0f1e]/88 px-3.5 py-2.5 shadow-[0_10px_36px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-white/28 hover:shadow-[0_14px_44px_rgba(99,102,241,0.3)]">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}
        >
          <card.icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-[13px] font-medium text-white whitespace-nowrap">
          {card.label}
        </span>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 70, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 18 });

  const handleMouse = (e: React.MouseEvent) => {
    if (reduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const panelX = useTransform(springX, (v) => v * -22);
  const panelY = useTransform(springY, (v) => v * -14);
  const panelRotateY = useTransform(springX, (v) => v * 7);
  const panelRotateX = useTransform(springY, (v) => v * -5);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="relative min-h-screen overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-10">
          {/* Left */}
          <div className="relative z-10">
            <motion.div variants={blurReveal} initial="hidden" animate="show">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12, duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[13px] text-indigo-300 shadow-[0_0_28px_rgba(99,102,241,0.18)]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI-Powered Learning Platform</span>
                <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              </motion.div>

              <h1 className="text-[3.25rem] font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
                Your AI
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Learning Companion
                </span>
              </h1>

              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-slate-400">
                Master any subject with personalized AI tutoring, smart flashcards,
                scholarship matching, and adaptive study plans — all in one elegant platform.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_44px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(99,102,241,0.55)]"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>

                <button className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/15">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                  Watch Demo
                </button>
              </div>

              <div className="mt-12 flex items-center gap-5">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full border-2 border-[#050816] bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500"
                      style={{ zIndex: 6 - i }}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">
                    <span className="text-indigo-300">+247</span> students joined today
                  </p>
                  <p className="text-slate-500">Trusted in 40+ countries</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Live workspace */}
          <div className="relative mx-auto w-full max-w-lg perspective-[1200px] lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 48 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease }}
              style={{
                x: reduced ? 0 : panelX,
                y: reduced ? 0 : panelY,
                rotateY: reduced ? 0 : panelRotateY,
                rotateX: reduced ? 0 : panelRotateX,
                transformStyle: "preserve-3d",
              }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-6 shadow-[0_32px_64px_rgba(0,0,0,0.45),0_0_80px_rgba(99,102,241,0.14)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-indigo-500/25 via-transparent to-purple-500/15 opacity-70" />

                <div className="mb-5 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  <div className="ml-3 h-2.5 w-36 rounded-full bg-white/10" />
                </div>

                {/* Live typed conversation */}
                <LiveChat />

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { label: "Streak", value: "12d" },
                    { label: "Mastered", value: "84%" },
                    { label: "Focus", value: "2.4h" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-center"
                    >
                      <p className="text-lg font-semibold text-white">{stat.value}</p>
                      <p className="text-[11px] text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {floatingCards.map((card) => (
                <FloatingPanel
                  key={card.label}
                  card={card}
                  mouseX={springX}
                  mouseY={springY}
                  reduced={reduced}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
