"use client";

import { useEffect, useRef, useState } from "react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(current);
    }, 40);
    return () => clearInterval(timer);
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsBar({
  totalPRs,
  totalAstFixes,
  totalAiFixes,
  totalFiles,
}: {
  totalPRs: number;
  totalAstFixes: number;
  totalAiFixes: number;
  totalFiles: number;
}) {
  const stats = [
    { label: "PRs Opened", value: totalPRs, color: "text-sol-green", icon: "🔀", glow: "shadow-sol-green/10" },
    { label: "AST Transforms", value: totalAstFixes, color: "text-sol-warning", icon: "⚙️", glow: "shadow-sol-warning/10" },
    { label: "AI Fixes", value: totalAiFixes, color: "text-sol-purple", icon: "🧠", glow: "shadow-sol-purple/10" },
    { label: "Files Modified", value: totalFiles, color: "text-foreground", icon: "📁", glow: "shadow-white/5" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 stagger-children">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`animate-fade-in-scale rounded-xl glass p-4 text-center card-hover shadow-lg ${stat.glow}`}
        >
          <div className="text-xl mb-1">{stat.icon}</div>
          <div className={`text-3xl font-bold tabular-nums ${stat.color}`}>
            <Counter target={stat.value} />
          </div>
          <div className="mt-1 text-xs text-sol-muted font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
