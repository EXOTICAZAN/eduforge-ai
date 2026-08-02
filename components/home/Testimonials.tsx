"use client";

import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { ease } from "@/lib/motion";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "CS Student · LUMS",
    text: "EduForge AI turned my chaotic study routine into a focused system. The AI tutor feels like a patient mentor available at 2 AM.",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "Pre-Med · UCLA",
    text: "Chat with PDF alone saved me dozens of hours. I upload lecture notes and get precise answers in seconds.",
    rating: 5,
  },
  {
    name: "Sofia Alvarez",
    role: "Engineering · MIT",
    text: "The scholarship finder matched me with three opportunities I never would have found on my own. Absolute game changer.",
    rating: 5,
  },
  {
    name: "Daniel Okonkwo",
    role: "MBA Candidate",
    text: "Interview Coach is brutally honest and incredibly useful. I walked into my last interview far more prepared.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-indigo-400">
            Testimonials
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Loved by students
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {" "}worldwide
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/18 hover:bg-white/[0.06]"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + j * 0.06, type: "spring", stiffness: 400 }}
                  >
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              <p className="text-[13px] leading-relaxed text-slate-300">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white transition-transform duration-300 group-hover:scale-110">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <BadgeCheck className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
