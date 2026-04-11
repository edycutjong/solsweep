"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            setCount(current);
          }, 30);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const CODE_LINES = [
  { text: "$ solsweep run solana-labs/solana-pay", color: "text-sol-green" },
  { text: "⏳ Cloning repository...", color: "text-sol-muted" },
  { text: "✓ 342 files indexed", color: "text-sol-green" },
  { text: "⚙ Running AST codemods...", color: "text-sol-warning" },
  { text: "✓ 47 transforms applied (14 files)", color: "text-sol-green" },
  { text: "⚠ tsc: 3 type errors in createTransfer.ts", color: "text-sol-error" },
  { text: "🧠 AI Loop: Feeding TS2345 to Claude 3.5...", color: "text-sol-purple" },
  { text: "✓ Build passed. 0 errors. PR #342 opened.", color: "text-sol-green" },
];

function LiveCodePreview() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= CODE_LINES.length) {
          setTimeout(() => setVisibleLines(0), 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass rounded-2xl p-1 w-full max-w-2xl">
      <div className="rounded-xl bg-sol-dark/90 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-sol-border/50 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-sol-error/70" />
            <div className="h-3 w-3 rounded-full bg-sol-warning/70" />
            <div className="h-3 w-3 rounded-full bg-sol-success/70" />
          </div>
          <span className="ml-2 text-[11px] font-medium text-sol-muted/60 font-mono">
            solsweep — migration engine
          </span>
        </div>
        {/* Code body */}
        <div className="p-4 font-mono text-[13px] leading-relaxed min-h-[220px]">
          {CODE_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`${line.color} animate-fade-in-scale`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {line.text}
            </div>
          ))}
          {visibleLines < CODE_LINES.length && (
            <span className="inline-block h-4 w-2 bg-sol-green/80 animate-blink mt-1" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center overflow-hidden">
          {/* Animated grid */}
          <div className="animated-grid" />

          {/* Floating orbs */}
          <div className="orb orb-green h-[500px] w-[500px] top-[10%] left-[20%]" />
          <div className="orb orb-purple h-[400px] w-[400px] top-[30%] right-[15%]" />

          {/* Badge */}
          <div className="animate-slide-up relative z-10 mb-6 flex items-center gap-2 rounded-full glass px-5 py-2 text-xs font-medium text-sol-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-green opacity-75" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-sol-green" />
            </span>
            DoraHacks — Boring AI Hackathon 2026
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up relative z-10 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl" style={{ animationDelay: "100ms" }}>
            Zero-FP{" "}
            <span className="gradient-text">Solana</span>{" "}
            Migrations
          </h1>

          <p
            className="animate-slide-up relative z-10 mt-6 max-w-xl text-lg leading-relaxed text-sol-muted"
            style={{ animationDelay: "200ms" }}
          >
            Autonomous AST codemods verified by an adversarial AI-compiler loop.
            Open live PRs on real repos with{" "}
            <span className="font-semibold text-sol-green">zero false positives</span>.
          </p>

          {/* CTA group */}
          <div
            className="animate-slide-up relative z-10 mt-10 flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href="/dashboard"
              className="group relative rounded-2xl bg-linear-to-r from-sol-green to-sol-purple px-8 py-3.5 text-base font-bold text-sol-dark transition-all hover:shadow-2xl hover:shadow-sol-green/25 active:scale-95"
            >
              <span className="relative z-10">Launch Dashboard →</span>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl glass px-8 py-3.5 text-base font-medium text-foreground transition-all hover:border-sol-green/30"
            >
              View Source
            </a>
          </div>

          {/* Live Code Preview */}
          <div
            className="animate-slide-up relative z-10 mt-16 w-full flex justify-center"
            style={{ animationDelay: "500ms" }}
          >
            <LiveCodePreview />
          </div>

          {/* Social proof stats */}
          <div
            className="animate-slide-up relative z-10 mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 stagger-children"
            style={{ animationDelay: "650ms" }}
          >
            {[
              { value: 169, suffix: "+", label: "AST Transforms", color: "text-sol-warning" },
              { value: 11, suffix: "", label: "AI Fixes", color: "text-sol-purple" },
              { value: 53, suffix: "", label: "Files Migrated", color: "text-foreground" },
              { value: 0, suffix: "", label: "False Positives", color: "text-sol-green" },
            ].map(({ value, suffix, label, color }) => (
              <div key={label} className="text-center">
                <div className={`text-3xl font-bold ${color}`}>
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="mt-1 text-xs text-sol-muted">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="relative border-t border-sol-border px-6 py-24 overflow-hidden">
          <div className="animated-grid" style={{ opacity: 0.5 }} />
          <div className="orb orb-purple h-[300px] w-[300px] bottom-[10%] left-[5%]" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-block rounded-full bg-sol-purple/10 border border-sol-purple/20 px-4 py-1.5 text-xs font-semibold text-sol-purple mb-6">
                4-STEP PIPELINE
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How <span className="gradient-text">SolSweep</span> Works
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sol-muted">
                A hybrid AST + AI pipeline that guarantees correctness via
                compiler verification before touching your codebase.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
              {[
                {
                  step: "01",
                  title: "Clone",
                  desc: "Target repository is cloned and indexed. File graph is mapped for dependency resolution.",
                  color: "from-blue-500 to-cyan-400",
                  icon: "📥",
                },
                {
                  step: "02",
                  title: "AST Codemod",
                  desc: "Deterministic jscodeshift transforms handle 80% of migration patterns: imports, types, method calls.",
                  color: "from-sol-warning to-orange-400",
                  icon: "⚙️",
                },
                {
                  step: "03",
                  title: "Compiler Loop",
                  desc: "tsc errors are fed to Claude 3.5. The AI patches edge cases and iterates until the build is green.",
                  color: "from-sol-purple to-pink-500",
                  icon: "🧠",
                },
                {
                  step: "04",
                  title: "Ship PR",
                  desc: "A verified feature branch is pushed and a Pull Request is opened with a full change summary.",
                  color: "from-sol-green to-emerald-400",
                  icon: "🚀",
                },
              ].map(({ step, title, desc, color, icon }) => (
                <div
                  key={step}
                  className="animate-slide-up group rounded-2xl glass card-hover p-6 relative shine-effect"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${color} text-lg`}
                    >
                      {icon}
                    </div>
                    <span className={`text-xs font-bold bg-linear-to-br ${color} bg-clip-text text-transparent`}>
                      STEP {step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sol-muted">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-sol-border px-6 py-8">
          <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-sol-muted">
              Built for DoraHacks Boring AI 2026 🏆
            </p>
            <p className="text-sm text-sol-muted">
              Powered by{" "}
              <span className="font-medium text-sol-green">Codemod</span> ×{" "}
              <span className="font-medium text-sol-purple">Claude 3.5</span>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
