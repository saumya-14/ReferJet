"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Siren, Skull, Baby } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RestrictedAccess() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [message, setMessage] = useState("Nothing to see here...");

  // Funny messages sequence
  const messages = [
    "Nothing to see here...",
    "Seriously, go away.",
    "This is a private property.",
    "I'm calling the internet police 👮‍♂️",
    "Okay, you're persistent.",
    "Fine, have a cookie 🍪",
    "Wait, I ate the cookie.",
    "System overload initiating...",
  ];

  const handleInteraction = () => {
    setClickCount((prev) => prev + 1);
    const nextIndex = (clickCount + 1) % messages.length;
    setMessage(messages[nextIndex]);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] font-sans text-slate-900 selection:bg-rose-500/20">

      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-rose-100/40 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-orange-100/40 blur-[100px]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-4 text-center">

        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="group relative mx-auto mb-8 flex h-32 w-32 cursor-pointer items-center justify-center rounded-3xl bg-white shadow-2xl shadow-rose-500/10 transition-transform active:scale-95"
          onClick={handleInteraction}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 opacity-0 transition-opacity group-hover:opacity-10" />
          <AnimatePresence mode="wait">
            <motion.div
              key={clickCount}
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 45 }}
              transition={{ type: "spring" }}
            >
              {clickCount < 3 ? (
                <Lock className="h-12 w-12 text-slate-900" />
              ) : clickCount < 6 ? (
                <Siren className="h-12 w-12 text-rose-500" />
              ) : (
                <Skull className="h-12 w-12 text-slate-900" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Badge */}
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-lg">
            {clickCount > 0 ? clickCount : "?"}
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Whoops. <br />
            <span className="bg-gradient-to-r from-rose-500 to-orange-600 bg-clip-text text-transparent">
              Personal Use Only
            </span>
          </h1>

          <motion.p
            key={message}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-lg font-medium text-slate-500 min-h-[2rem]"
          >
            {message}
          </motion.p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => router.push('/access')}
            className="group relative flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            Login Anyway
            <span className="opacity-0 transition-opacity group-hover:opacity-100">🔐</span>
          </button>
          <a
            href="https://youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            Complain to Management
            <Baby className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-xs font-medium uppercase tracking-widest text-slate-400"
        >
          Secure • Private • Funny?
        </motion.div>

      </div>
    </div>
  );
}
