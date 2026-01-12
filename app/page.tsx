"use client";

import { useEffect, useState } from "react";
import { Lock, ArrowLeft, Eye, Smile, X } from "lucide-react";

export default function RestrictedAccess() {
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handleExploring = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 p-4">
      {/* Subtle gradient background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,0,0,0.02),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.015),transparent_50%)]" />
      
      {/* Glassmorphism card */}
      <div
        className={`relative z-10 w-full max-w-lg transform rounded-3xl border border-gray-200/80 bg-white/80 p-10 backdrop-blur-xl shadow-2xl transition-all duration-700 ${
          mounted
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
        style={{
          boxShadow:
            "0 20px 60px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Icon with smile */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gray-100 blur-2xl opacity-60" />
            <div className="relative flex items-center justify-center rounded-full bg-linear-to-br from-gray-50 to-gray-100 p-5 shadow-lg">
              <div className="relative">
                <Lock className="h-12 w-12 text-gray-700" strokeWidth={1.5} />
                <Smile 
                  className="absolute -bottom-1 -right-1 h-5 w-5 text-gray-400" 
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Big funny headline */}
        <h1 className="mb-3 text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Whoa there, Hacker 😏
        </h1>

        {/* Subtitle */}
        <p className="mb-6 text-center text-lg font-medium text-gray-600 sm:text-xl">
          Nice try, but nope.
        </p>

        {/* Main message */}
        <div className="mb-8 space-y-4">
          <p className="text-center text-base leading-7 text-gray-500 sm:text-lg">
            This project is so private, even I sometimes need permission from myself.
          </p>
          <p className="text-center text-sm leading-6 text-gray-400 sm:text-base">
            This is a personal project. If you're seeing this page, it means you're either very curious… or very lost.
          </p>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleGoBack}
            className="group relative overflow-hidden rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Go Back Before Things Get Awkward
            </span>
          </button>

          <button
            onClick={handleExploring}
            className="group relative overflow-hidden rounded-xl border border-gray-300 bg-gray-900 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-md active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" strokeWidth={2} />
              I Was Just Exploring 👀
            </span>
          </button>
        </div>

        {/* Subtle decorative element */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-1 w-1 rounded-full bg-gray-300"
                style={{
                  animation: `pulse 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gray-300/40 animate-float"
            style={{
              left: `${25 + i * 20}%`,
              top: `${20 + i * 15}%`,
              animationDuration: `${18 + i * 3}s`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Dialog Modal */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeDialog}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
              showDialog ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Dialog Content */}
          <div
            className={`relative z-10 w-full max-w-md transform rounded-3xl border border-gray-200/80 bg-white/95 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              showDialog
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-4 opacity-0 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 20px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeDialog}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:scale-95"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Dialog Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gray-100 blur-xl opacity-50" />
                <div className="relative flex items-center justify-center rounded-full bg-linear-to-br from-gray-50 to-gray-100 p-4 shadow-md">
                  <Eye className="h-10 w-10 text-gray-700" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Dialog Title */}
            <h2 className="mb-3 text-center text-2xl font-bold text-gray-900">
              Curiosity is a Virtue! 👀
            </h2>

            {/* Dialog Message */}
            <p className="mb-6 text-center text-base leading-7 text-gray-600">
              We appreciate your curiosity! However, this project is still private and intended for personal use only.
            </p>
            <p className="mb-6 text-center text-sm leading-6 text-gray-500">
              Thanks for understanding and respecting the boundaries! 🙏
            </p>

            {/* Dialog Button */}
            <button
              onClick={closeDialog}
              className="w-full rounded-xl border border-gray-300 bg-gray-900 px-6 py-3 font-medium text-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-md active:scale-[0.98]"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
