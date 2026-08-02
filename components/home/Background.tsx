"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Background() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Aurora / gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.18),transparent),radial-gradient(ellipse_60%_40%_at_85%_40%,rgba(168,85,247,0.12),transparent),radial-gradient(ellipse_50%_30%_at_15%_70%,rgba(59,130,246,0.08),transparent)]" />

      {/* Animated blobs */}
      {!reduced && (
        <>
          <motion.div
            animate={{
              x: [0, 90, -50, 0],
              y: [0, -70, 45, 0],
              scale: [1, 1.18, 0.92, 1],
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-40 top-[15%] h-[560px] w-[560px] rounded-full bg-indigo-600/25 blur-[130px]"
          />
          <motion.div
            animate={{
              x: [0, -80, 55, 0],
              y: [0, 55, -35, 0],
              scale: [1, 0.88, 1.12, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-48 top-[28%] h-[520px] w-[520px] rounded-full bg-purple-600/18 blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, 45, -70, 0],
              y: [0, 80, -25, 0],
            }}
            transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10%] left-[28%] h-[440px] w-[440px] rounded-full bg-blue-500/12 blur-[110px]"
          />
          {/* Soft light beam */}
          <motion.div
            animate={{ opacity: [0.15, 0.35, 0.15], rotate: [0, 3, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-0 h-[70vh] w-[2px] -translate-x-1/2 bg-gradient-to-b from-indigo-400/40 via-purple-400/10 to-transparent blur-sm"
          />
        </>
      )}

      {/* Perspective grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Stars / particles */}
      {!reduced &&
        Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 4 === 0 ? 2 : 1,
              height: i % 4 === 0 ? 2 : 1,
              left: `${(i * 13 + 5) % 100}%`,
              top: `${(i * 19 + 8) % 100}%`,
              opacity: 0.25 + (i % 5) * 0.08,
            }}
            animate={{
              y: [0, -22 - (i % 8), 0],
              opacity: [0.15, 0.55, 0.15],
            }}
            transition={{
              duration: 5 + (i % 6),
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}