"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";
import { toast } from "sonner";
import { fadeUp, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

const topics = [
  "General question",
  "Product support",
  "Feedback or suggestion",
  "Partnership",
  "Press inquiry",
  "Security disclosure",
] as const;

interface FormErrors {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = "Please enter your name (at least 2 characters).";
    if (!EMAIL_PATTERN.test(email.trim())) next.email = "Please enter a valid email address.";
    if (!topic) next.topic = "Please choose a topic.";
    if (message.trim().length < 20)
      next.message = "Please write at least 20 characters so we can help effectively.";
    return next;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const address =
      topic === "Security disclosure" ? "security@eduforge.ai" : "hello@eduforge.ai";
    const subject = encodeURIComponent(`[${topic}] Message from ${name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${topic}\n\n${message.trim()}\n`
    );
    window.location.href = `mailto:${address}?subject=${subject}&body=${body}`;

    toast.success("Your email app should have opened", {
      description:
        "We don't run a mail backend yet — please hit send in your email client to complete the message.",
      duration: 8000,
    });
  };

  const inputClass = (invalid: boolean) =>
    cn(
      "w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition-colors",
      invalid
        ? "border-rose-500/60 focus:border-rose-400"
        : "border-white/[0.08] focus:border-indigo-500/50"
    );

  return (
    <motion.form
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.7, ease }}
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-300">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className={inputClass(Boolean(errors.name))}
          />
          {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className={inputClass(Boolean(errors.email))}
          />
          {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-medium text-slate-300">
          Topic
        </label>
        <select
          id="contact-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={cn(inputClass(Boolean(errors.topic)), "appearance-none", !topic && "text-slate-500")}
        >
          <option value="" className="bg-[#0a0f1e] text-slate-500">
            Choose a topic...
          </option>
          {topics.map((t) => (
            <option key={t} value={t} className="bg-[#0a0f1e] text-white">
              {t}
            </option>
          ))}
        </select>
        {errors.topic && <p className="mt-1.5 text-xs text-rose-400">{errors.topic}</p>}
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-300">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="Tell us what's on your mind..."
          className={cn(inputClass(Boolean(errors.message)), "resize-y")}
        />
        {errors.message && <p className="mt-1.5 text-xs text-rose-400">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl btn-gradient px-6 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.01] sm:w-auto"
      >
        <Send className="h-4 w-4" />
        Open in email app
      </button>
      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        EduForge AI doesn&apos;t have a mail backend yet. Submitting validates your message and
        opens your own email client with everything prefilled — you press send.
      </p>
    </motion.form>
  );
}
