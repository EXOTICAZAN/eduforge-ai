"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Trophy,
  HelpCircle,
  Layers,
  Calendar,
  Mic,
  FileText,
  Map,
  NotebookPen,
  UserCheck,
} from "lucide-react";
import { ease, stagger } from "@/lib/motion";

type Feature =
  | {
      icon: typeof Brain;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "chat";
        lines: [string, string];
      };
    }
  | {
      icon: typeof Trophy;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "match";
        score: string;
        name: string;
      };
    }
  | {
      icon: typeof HelpCircle;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "quiz";
        q: string;
        a: string;
      };
    }
  | {
      icon: typeof Layers;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "card";
        front: string;
        back: string;
      };
    }
  | {
      icon: typeof Calendar;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "plan";
        next: string;
      };
    }
  | {
      icon: typeof Mic;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "voice";
      };
    }
  | {
      icon: typeof FileText;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "pdf";
        status: string;
      };
    }
  | {
      icon: typeof Map;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "road";
        steps: number;
      };
    }
  | {
      icon: typeof NotebookPen;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "notes";
      };
    }
  | {
      icon: typeof UserCheck;
      title: string;
      description: string;
      gradient: string;
      demo: {
        type: "score";
        value: string;
      };
    };

const features: Feature[] = [
  {
    icon: Brain,
    title: "AI Tutor",
    description:
      "24/7 personalized tutoring that adapts to your learning style and pace.",
    gradient: "from-indigo-500 to-blue-500",
    demo: {
      type: "chat",
      lines: ["What is gravity?", "A force that pulls…"],
    },
  },
  {
    icon: Trophy,
    title: "Scholarship Finder",
    description:
      "Discover and match with scholarships tailored to your profile and goals.",
    gradient: "from-amber-500 to-orange-500",
    demo: {
      type: "match",
      score: "94%",
      name: "STEM Excellence",
    },
  },
  {
    icon: HelpCircle,
    title: "Quiz Generator",
    description:
      "Instant adaptive quizzes from any topic or uploaded material.",
    gradient: "from-emerald-500 to-teal-500",
    demo: {
      type: "quiz",
      q: "What is 2πr?",
      a: "Circumference",
    },
  },
  {
    icon: Layers,
    title: "Smart Flashcards",
    description:
      "Spaced-repetition flashcards generated automatically from your notes.",
    gradient: "from-purple-500 to-pink-500",
    demo: {
      type: "card",
      front: "Mitochondria",
      back: "Powerhouse of cell",
    },
  },
  {
    icon: Calendar,
    title: "Study Planner",
    description:
      "AI-crafted weekly schedules that balance depth and retention.",
    gradient: "from-sky-500 to-cyan-500",
    demo: {
      type: "plan",
      next: "Physics · 2.5h",
    },
  },
  {
    icon: Mic,
    title: "Voice Tutor",
    description:
      "Speak and listen — practice concepts through natural conversation.",
    gradient: "from-rose-500 to-red-500",
    demo: {
      type: "voice",
    },
  },
  {
    icon: FileText,
    title: "Chat with PDF",
    description:
      "Upload any document and ask questions as if the author is there.",
    gradient: "from-violet-500 to-purple-500",
    demo: {
      type: "pdf",
      status: "Summary ready",
    },
  },
  {
    icon: Map,
    title: "Learning Roadmaps",
    description:
      "Clear, step-by-step paths from beginner to mastery in any field.",
    gradient: "from-blue-500 to-indigo-500",
    demo: {
      type: "road",
      steps: 4,
    },
  },
  {
    icon: NotebookPen,
    title: "AI Notes",
    description:
      "Auto-summarize lectures and generate structured, searchable notes.",
    gradient: "from-teal-500 to-emerald-500",
    demo: {
      type: "notes",
    },
  },
  {
    icon: UserCheck,
    title: "Interview Coach",
    description:
      "Practice technical and behavioral interviews with real-time feedback.",
    gradient: "from-fuchsia-500 to-pink-500",
    demo: {
      type: "score",
      value: "8.4/10",
    },
  },
];

function MiniDemo({ demo }: { demo: Feature["demo"] }) {
  if (demo.type === "chat") {
    return (
      <div className="space-y-1.5 text-[10px]">
        <div className="rounded-md bg-white/10 px-2 py-1 text-slate-300">
          {demo.lines[0]}
        </div>
        <div className="rounded-md bg-indigo-500/20 px-2 py-1 text-indigo-200">
          {demo.lines[1]}
        </div>
      </div>
    );
  }

  if (demo.type === "match") {
    return (
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="truncate text-slate-300">{demo.name}</span>
        <span className="font-semibold text-emerald-400">
          {demo.score}
        </span>
      </div>
    );
  }

  if (demo.type === "quiz") {
    return (
      <div className="space-y-1 text-[11px]">
        <div className="text-slate-300">{demo.q}</div>
        <div className="text-emerald-400">
          → {demo.a}
        </div>
      </div>
    );
  }

  if (demo.type === "card") {
    return (
      <div className="space-y-1 text-[11px]">
        <div className="font-medium text-purple-200">
          {demo.front}
        </div>
        <div className="text-slate-400">
          {demo.back}
        </div>
      </div>
    );
  }

  if (demo.type === "plan") {
    return (
      <div className="text-[11px] text-sky-300">
        Next: {demo.next}
      </div>
    );
  }

  if (demo.type === "voice") {
    return (
      <div className="flex h-6 items-center justify-center gap-1">
        {[3, 6, 4, 8, 5, 7, 3].map((h, i) => (
          <motion.div
            key={i}
            className="w-0.5 rounded-full bg-rose-400"
            animate={{ height: [h, h + 4, h] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.08,
            }}
            style={{ height: h }}
          />
        ))}
      </div>
    );
  }

  if (demo.type === "pdf") {
    return (
      <div className="text-[11px] text-violet-300">
        ✓ {demo.status}
      </div>
    );
  }

  if (demo.type === "road") {
    return (
      <div className="flex gap-1">
        {Array.from({ length: demo.steps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < 2 ? "bg-indigo-400" : "bg-white/15"
            }`}
          />
        ))}
      </div>
    );
  }

  if (demo.type === "score") {
    return (
      <div className="text-center text-[13px] font-semibold text-fuchsia-300">
        {demo.value}
      </div>
    );
  }

  return (
    <div className="text-[11px] text-teal-300">
      Notes generated
    </div>
  );
}

const item = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease,
    },
  },
};

export default function Features() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          transition={{
            duration: 0.7,
            ease,
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-3 text-sm font-medium text-indigo-400">
            Features
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to{" "}
            <span className="text-indigo-400">
              learn smarter
            </span>
          </h2>

          <p className="mt-4 text-sm text-slate-400">
            Hover any card to see it come alive.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: "-60px",
          }}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              onHoverStart={() =>
                setHovered(feature.title)
              }
              onHoverEnd={() => setHovered(null)}
              whileHover={{
                y: -8,
                transition: {
                  duration: 0.3,
                  ease,
                },
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(400px_circle_at_50%_0%,rgba(99,102,241,0.12),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon className="h-5 w-5 text-white" />
              </div>

              <h3 className="text-[15px] font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                {feature.description}
              </p>

              <div className="mt-4 min-h-[36px]">
                <AnimatePresence>
                  {hovered === feature.title && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 4,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2"
                    >
                      <MiniDemo demo={feature.demo} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}