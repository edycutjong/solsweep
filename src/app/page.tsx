"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Intersection Observer scroll reveal ───────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Animated counter with easing ──────────────────────────────── */
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const duration = 1200;
          function tick(now: number) {
            const t = Math.min((now - start) / duration, 1);
            // ease-out-cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setCount(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Typewriter text ───────────────────────────────────────────── */
function TypewriterText({
  texts,
  speed = 60,
  pause = 2500,
}: {
  texts: string[];
  speed?: number;
  pause?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === current) {
      timer = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayText === "") {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }, speed);
    } else {
      timer = setTimeout(
        () => {
          setDisplayText(
            isDeleting
              ? current.substring(0, displayText.length - 1)
              : current.substring(0, displayText.length + 1)
          );
        },
        isDeleting ? speed / 2 : speed
      );
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, texts, speed, pause]);

  return (
    <span>
      {displayText}
      <span className="inline-block h-6 w-[3px] bg-sol-green/80 animate-blink ml-0.5 rounded-sm align-text-bottom" />
    </span>
  );
}

/* ─── Terminal code preview ─────────────────────────────────────── */
const CODE_LINES = [
  { text: "$ solsweep run solana-labs/solana-pay", color: "text-sol-green" },
  { text: "⏳ Cloning repository...", color: "text-sol-muted" },
  { text: "✓ 342 files indexed", color: "text-sol-green" },
  { text: "⚙ Running AST codemods...", color: "text-sol-warning" },
  { text: "✓ 47 transforms applied (14 files)", color: "text-sol-green" },
  {
    text: "⚠ tsc: 3 type errors in createTransfer.ts",
    color: "text-sol-error",
  },
  {
    text: "🧠 AI Loop: Feeding TS2345 to Claude...",
    color: "text-sol-purple",
  },
  {
    text: "✓ Build passed. 0 errors. PR #342 opened.",
    color: "text-sol-green",
  },
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
    <div className="glass rounded-2xl p-1 w-full max-w-2xl shimmer-border terminal-glow">
      <div className="rounded-xl bg-sol-dark/90 overflow-hidden relative">
        {/* Code rain background */}
        <div className="code-rain">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${12 + i * 12}%`,
                animationDuration: `${8 + i * 3}s`,
                animationDelay: `${i * 1.5}s`,
              }}
            >
              {
                [
                  "import{Connection}",
                  "const tx=new",
                  "await sendAndConfirm",
                  "PublicKey.default",
                  "Keypair.generate()",
                  "blockhash.value",
                  "lamportsPerSOL",
                  "getLatestBlock",
                ][i]
              }
            </span>
          ))}
        </div>

        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-sol-border/50 px-4 py-2.5 relative z-10">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-sol-error/70 transition-all hover:scale-110" />
            <div className="h-3 w-3 rounded-full bg-sol-warning/70 transition-all hover:scale-110" />
            <div className="h-3 w-3 rounded-full bg-sol-success/70 transition-all hover:scale-110" />
          </div>
          <span className="ml-2 text-[11px] font-medium text-sol-muted/60 font-mono">
            solsweep — migration engine
          </span>
        </div>

        {/* Code body */}
        <div className="p-4 font-mono text-[13px] leading-relaxed min-h-[220px] relative z-10">
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
            <span className="inline-block h-4 w-2 bg-sol-green/80 animate-blink mt-1 rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Spotlight card interaction ─────────────────────────────────── */
function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty(
        "--mouse-x",
        `${e.clientX - rect.left}px`
      );
      card.style.setProperty(
        "--mouse-y",
        `${e.clientY - rect.top}px`
      );
    },
    []
  );

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}

/* ─── Particle field ────────────────────────────────────────────── */
function ParticleField() {
  return (
    <div className="particles">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="particle" />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const howRef = useReveal();
  const statsRef = useReveal();

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col noise-overlay">
        {/* ═══ Hero Section ═══ */}
        <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden min-h-[90vh]">
          {/* Layered BG: mesh + grid + particles + orbs */}
          <div className="hero-mesh" />
          <div className="animated-grid" />
          <ParticleField />

          {/* Floating orbs */}
          <div className="orb orb-green h-[500px] w-[500px] top-[10%] left-[20%]" />
          <div className="orb orb-purple h-[400px] w-[400px] top-[30%] right-[15%]" />
          <div className="orb orb-green h-[250px] w-[250px] bottom-[10%] right-[30%] opacity-50" />

          {/* Hackathon Badge — animated border */}
          <div className="animate-slide-up relative z-10 mb-8">
            <div className="inline-flex items-center gap-2.5 rounded-full animated-badge-border px-6 py-2.5 text-xs font-medium text-sol-muted badge-glow">
              <span className="relative flex h-2 w-2 glow-dot text-sol-green">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-green opacity-75" />
                <span className="relative inline-block h-2 w-2 rounded-full bg-sol-green" />
              </span>
              DoraHacks — Boring AI Hackathon 2026
            </div>
          </div>

          {/* Headline with reveal animation */}
          <h1
            className="animate-headline relative z-10 max-w-4xl text-5xl font-extrabold sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "200ms" }}
          >
            Zero-FP{" "}
            <span className="gradient-text-shimmer">Solana</span>{" "}
            Migrations
          </h1>

          <p
            className="animate-slide-up relative z-10 mt-6 max-w-xl text-lg leading-relaxed text-sol-muted"
            style={{ animationDelay: "400ms" }}
          >
            <TypewriterText
              texts={[
                "Autonomous AST codemods verified by an adversarial AI-compiler loop.",
                "Open live PRs on real repos with zero false positives.",
                "Upgrade @solana/web3.js → @solana/kit in minutes, not hours.",
              ]}
              speed={40}
              pause={3000}
            />
          </p>

          {/* CTA group */}
          <div
            className="animate-slide-up relative z-10 mt-12 flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: "600ms" }}
          >
            <Link
              href="/dashboard"
              className="group relative rounded-2xl bg-linear-to-r from-sol-green to-sol-purple px-8 py-4 text-base font-bold text-sol-dark cta-magnetic"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Dashboard
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
            <a
              href="https://github.com/edycutjong/solsweep"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl glass px-8 py-4 text-base font-medium text-foreground transition-all hover:border-sol-green/30 hover:bg-white/5 hover:shadow-lg hover:shadow-sol-green/10 flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View Source
            </a>
          </div>

          {/* Live Code Preview */}
          <div
            className="animate-slide-up relative z-10 mt-16 w-full flex justify-center"
            style={{ animationDelay: "800ms" }}
          >
            <LiveCodePreview />
          </div>

          {/* Social proof stats with ring indicators */}
          <div
            ref={statsRef}
            className="reveal relative z-10 mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {[
              {
                value: 169,
                suffix: "+",
                label: "AST Transforms",
                color: "text-sol-warning",
                ringColor: "#f59e0b",
              },
              {
                value: 11,
                suffix: "",
                label: "AI Fixes",
                color: "text-sol-purple",
                ringColor: "#9945FF",
              },
              {
                value: 53,
                suffix: "",
                label: "Files Migrated",
                color: "text-foreground",
                ringColor: "#e2e8f0",
              },
              {
                value: 0,
                suffix: "",
                label: "False Positives",
                color: "text-sol-green",
                ringColor: "#14F195",
              },
            ].map(({ value, suffix, label, color, ringColor }) => (
              <div key={label} className="text-center relative group">
                {/* Decorative ring */}
                <div className="relative inline-flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="absolute h-20 w-20 -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(30, 41, 59, 0.3)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="stat-ring"
                      style={{
                        "--ring-offset":
                          value === 0 ? "0" : `${283 - (283 * Math.min(value / 200, 1))}`,
                      } as React.CSSProperties}
                      opacity="0.4"
                    />
                  </svg>
                  <div
                    className={`text-3xl font-bold tabular-nums ${color} transition-all group-hover:scale-110`}
                  >
                    <AnimatedCounter target={value} suffix={suffix} />
                  </div>
                </div>
                <div className="text-xs text-sol-muted font-medium">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ How it Works — With 3D cards ═══ */}
        <section className="relative px-6 py-24 overflow-hidden section-divider">
          <div className="animated-grid" style={{ opacity: 0.5 }} />
          <div className="orb orb-purple h-[300px] w-[300px] bottom-[10%] left-[5%]" />

          <div ref={howRef} className="reveal relative z-10 mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-block rounded-full bg-sol-purple/10 border border-sol-purple/20 px-4 py-1.5 text-xs font-semibold text-sol-purple mb-6 animated-badge-border">
                4-STEP PIPELINE
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How{" "}
                <span className="gradient-text-shimmer">SolSweep</span>{" "}
                Works
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sol-muted">
                A hybrid AST + AI pipeline that guarantees correctness
                via compiler verification before touching your codebase.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  desc: "Deterministic ast-grep / Codemod transforms handle 80% of migration patterns: imports, types, method calls.",
                  color: "from-sol-warning to-orange-400",
                  icon: "⚙️",
                },
                {
                  step: "03",
                  title: "Compiler Loop",
                  desc: "tsc errors are fed to Claude. The AI patches edge cases and iterates until the build is green.",
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
              ].map(({ step, title, desc, color, icon }, idx) => (
                <div key={step} className="card-3d" style={{ animationDelay: `${idx * 120}ms` }}>
                  <SpotlightCard className="card-3d-inner rounded-2xl glass card-hover p-6 relative shine-effect">
                    {/* Step number watermark */}
                    <div className="absolute top-3 right-4 text-6xl font-black text-white/2 select-none">
                      {step}
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${color} text-lg shadow-lg`}
                      >
                        {icon}
                      </div>
                      <span
                        className={`text-xs font-bold bg-linear-to-br ${color} bg-clip-text text-transparent uppercase tracking-wider`}
                      >
                        Step {step}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-sol-muted">
                      {desc}
                    </p>
                    {/* Bottom accent line */}
                    <div
                      className={`mt-4 h-0.5 w-12 rounded-full bg-linear-to-r ${color} opacity-40 group-hover:w-full transition-all duration-700`}
                    />
                  </SpotlightCard>
                </div>
              ))}
            </div>

            {/* Connection lines between steps (desktop only) */}
            <div className="hidden lg:flex justify-center mt-8 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="connector-active w-16" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Tech Stack Section ═══ */}
        <section className="relative px-6 py-20 overflow-hidden section-divider">
          <div className="orb orb-green h-[200px] w-[200px] top-[20%] right-[10%] opacity-30" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full bg-sol-green/10 border border-sol-green/20 px-4 py-1.5 text-xs font-semibold text-sol-green mb-6">
              TECH STACK
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12">
              Built with{" "}
              <span className="gradient-text">Modern Standards</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Next.js 16", icon: "▲", bg: "from-white/10 to-white/5" },
                { name: "React 19", icon: "⚛️", bg: "from-blue-500/10 to-cyan-500/5" },
                { name: "TypeScript", icon: "TS", bg: "from-blue-500/10 to-blue-700/5" },
                { name: "Supabase", icon: "⚡", bg: "from-emerald-500/10 to-emerald-700/5" },
                { name: "ast-grep", icon: "🔧", bg: "from-sol-warning/10 to-orange-500/5" },
                { name: "Claude", icon: "🧠", bg: "from-sol-purple/10 to-pink-500/5" },
              ].map(({ name, icon, bg }) => (
                <div
                  key={name}
                  className={`rounded-xl glass p-4 card-hover text-center bg-linear-to-br ${bg}`}
                >
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-xs font-semibold text-sol-muted">
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Footer ═══ */}
        <footer className="section-divider px-6 py-10">
          <div className="mx-auto max-w-5xl flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-sol-muted flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-linear-to-br from-sol-green to-sol-purple text-[10px]">
                🏆
              </span>
              Built for DoraHacks Boring AI 2026
            </p>
            <p className="text-sm text-sol-muted">
              Powered by{" "}
              <span className="font-medium text-sol-green">
                Codemod
              </span>{" "}
              ×{" "}
              <span className="font-medium text-sol-purple">
                Claude
              </span>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
