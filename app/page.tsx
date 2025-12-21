"use client";

import { Database, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            EnglishTestAI
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-slate-50/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Evidence-Based Validation • Teacher Review Workflow
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl">
          Generate High-Quality <span className="text-blue-600">MCQs</span>
          <br />
          <span className="text-slate-400">With Teacher Control</span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
          A specialized question generator for Korean middle school English teachers.
          Turn any reading passage into syllabus-aligned multiple choice
          questions with evidence-based validation and professional review
          workflow.
        </p>

        <LoginForm />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100">
        © 2025 EnglishTestAI. All rights reserved.
      </footer>
    </div>
  );
}
