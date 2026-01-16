"use client";

import { useEffect, useState } from "react";
import { Lock, ArrowLeft, Eye, Smile, X, Sparkles } from "lucide-react";

export default function RestrictedAccess() {
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4">

      {/* Floating emojis */}
      {["👀", "🔒", "😂", "🚫", "🫣"].map((e, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-30 animate-float"
          style={{
            left: `${10 + i * 18}%`,
            top: `${15 + (i % 3) * 20}%`,
            animationDuration: `${12 + i * 4}s`,
          }}
        >
          {e}
        </div>
      ))}

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-xl rounded-3xl border border-gray-200 bg-white/80 p-10 backdrop-blur-xl shadow-2xl transition-all duration-700 ${mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
          }`}
      >
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative animate-[wiggle_2s_ease-in-out_infinite]">
            <div className="absolute inset-0 rounded-full bg-pink-200 blur-2xl opacity-40" />
            <div className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 p-6 shadow-xl">
              <Lock className="h-14 w-14 text-gray-800" />
              <Smile className="absolute -bottom-1 -right-1 h-6 w-6 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-3 text-center text-2xl font-medium tracking-tight text-gray-900 sm:text-5xl">
          Oops! You weren’t supposed to be here 😏
        </h1>

        <p className="mb-6 text-center text-xl text-gray-600">
          This page is more private than my Chrome history.
        </p>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <p className="text-center text-gray-500">
            🚨 Congratulations! You found a page that does absolutely nothing for you.
          </p>
          <p className="text-center text-gray-400 text-sm">
            This is a personal project. If you’re here, either you’re very curious… or very lost.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleGoBack}
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Abort Mission 🏃‍♂️
            </span>
          </button>

          <button
            onClick={() => setShowDialog(true)}
            className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-3 font-medium text-white shadow-lg transition hover:opacity-90 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              I Was Just Looking 👀
            </span>
          </button>
        </div>

        {/* Tiny joke */}
        <p className="mt-8 text-center text-xs text-gray-400">
          This button does not hack NASA. We tried.
        </p>
      </div>

      {/* Modal */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDialog(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDialog(false)}
              className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex justify-center">
              <Sparkles className="h-12 w-12 text-pink-500" />
            </div>

            <h2 className="mb-3 text-center text-2xl font-bold">
              Curiosity Level: 100% 😎
            </h2>

            <p className="mb-6 text-center text-gray-600">
              I respect the curiosity, but this project is still in its introvert era.
            </p>

            <button
              onClick={() => setShowDialog(false)}
              className="w-full rounded-xl bg-gray-900 px-6 py-3 text-white font-medium hover:bg-gray-800"
            >
              Okay okay, I’m leaving 🚶‍♂️
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
