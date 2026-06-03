"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSupabase, isValidEmail } from "@/lib/supabase";

type FormStatus = "idle" | "loading" | "success" | "duplicate" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmed = email.trim().toLowerCase();
    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setErrorMessage("Waitlist is not configured yet.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.from("waitlist").insert({ email: trimmed });

    if (!error) {
      setStatus("success");
      setEmail("");
      return;
    }

    if (error.code === "23505") {
      setStatus("duplicate");
      return;
    }

    setStatus("error");
    setErrorMessage("Something went wrong. Please try again.");
  };

  const message =
    status === "success"
      ? "You're on the list."
      : status === "duplicate"
        ? "You're already on the waitlist."
        : errorMessage;

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm lg:max-w-[22rem]"
    >
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle" && status !== "loading") {
              setStatus("idle");
              setErrorMessage("");
            }
          }}
          placeholder="Enter your email"
          autoComplete="email"
          required
          disabled={status === "loading" || status === "success"}
          className="waitlist-field text-shadow-soft h-10 flex-1 rounded-full px-4 text-[13px] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="h-10 shrink-0 rounded-full bg-white px-5 text-[12px] font-semibold text-black shadow-[0_4px_20px_rgba(0,0,0,0.22)] transition-all hover:bg-white/95 disabled:opacity-55"
        >
          {status === "loading" ? "Joining…" : "Join Waitlist"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-shadow-soft mt-2.5 text-center text-[13px] ${
              status === "error"
                ? "text-red-100"
                : "text-white/90"
            }`}
            role={status === "error" ? "alert" : "status"}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
