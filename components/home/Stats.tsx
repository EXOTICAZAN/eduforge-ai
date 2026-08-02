"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, MessageSquare, Globe, TrendingUp } from "lucide-react";
import { ease } from "@/lib/motion";

const stats = [
  { value: 100000, suffix: "K+", label: "Students", icon: Users, trend: "+12%" },
  { value: 5, suffix: "M+", label: "AI Questions", icon: MessageSquare, trend: "+28%" },
  { value: 30, suffix: "+", label: "Languages", icon: Globe, trend: "+4" },
  { value: 95, suffix: "%", label: "Success Rate", icon: TrendingUp, trend: "+3%" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  const display = value >= 1000 ? Math.floor(count / 1000) : count;

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center transition-colors hover:border-white/15 hover:bg-white/[0.05]"
            >
              <div className="mb-3 flex items-center justify-center gap-2">
                <stat.icon className="h-4 w-4 text-indigo-400" />
                <span className="text-[11px] font-medium text-emerald-400">{stat.trend}</span>
              </div>
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
