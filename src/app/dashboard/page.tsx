"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SweepInput from "@/components/SweepInput";
import SweepCard from "@/components/SweepCard";
import StatsBar from "@/components/StatsBar";
import { supabase } from "@/lib/supabase";
import type { Sweep } from "@/lib/database.types";

interface RawSweepRow {
  id: string;
  repo_url: string;
  repo_name: string;
  status: Sweep["status"];
  pr_url: string | null;
  files_changed: number;
  ast_fixes: number;
  ai_fixes: number;
  started_at: string;
  completed_at: string | null;
}

function normalizeSweeps(data: RawSweepRow[]): Sweep[] {
  return data.map((row) => ({
    id: row.id,
    repoUrl: row.repo_url,
    repoName: row.repo_name,
    status: row.status,
    prUrl: row.pr_url,
    filesChanged: row.files_changed,
    astFixes: row.ast_fixes,
    aiFixes: row.ai_fixes,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    logs: [], // Minimal fetch
  }));
}

export default function DashboardPage() {
  const [sweeps, setSweeps] = useState<Sweep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial fetch from API
    fetch("/api/sweep")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setSweeps(normalizeSweeps(data));
        }
        setLoading(false);
      });

    // 2. Setup Realtime Subscription
    const channel = supabase
      .channel("solsweep_sweeps_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "solsweep_sweeps" },
        () => {
          // Re-fetch everything on change for simplicity in this dashboard
          fetch("/api/sweep")
            .then((res) => res.json())
            .then((data) => {
              if (!data.error) {
                setSweeps(normalizeSweeps(data));
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const completedSweeps = sweeps.filter((s) => s.status === "complete");
  const totalPRs = completedSweeps.length;
  const totalAstFixes = sweeps.reduce((sum, s) => sum + s.astFixes, 0);
  const totalAiFixes = sweeps.reduce((sum, s) => sum + s.aiFixes, 0);
  const totalFiles = sweeps.reduce((sum, s) => sum + s.filesChanged, 0);

  async function handleStartSweep(url: string) {
    try {
      const res = await fetch("/api/sweep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
      });
      if (res.ok) {
        // Realtime will pick up the change
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 px-6 py-8 relative overflow-hidden">
        {/* Subtle background effects */}
        <div className="orb orb-green h-[300px] w-[300px] top-[5%] right-[10%] opacity-50" />
        <div className="orb orb-purple h-[250px] w-[250px] bottom-[20%] left-[5%] opacity-40" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Page title */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Sweep <span className="gradient-text">Dashboard</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sol-green/10 px-3 py-1 text-xs font-semibold text-sol-green">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-green opacity-75" />
                  <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-sol-green" />
                </span>
                Live
              </span>
            </div>
            <p className="text-sol-muted">
              Monitor active migration pipelines and published PRs
            </p>
          </div>

          {/* Input */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <SweepInput onSubmit={handleStartSweep} />
          </div>

          {/* Stats */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <StatsBar
              totalPRs={totalPRs}
              totalAstFixes={totalAstFixes}
              totalAiFixes={totalAiFixes}
              totalFiles={totalFiles}
            />
          </div>

          {/* Sweep grid */}
          <div className="mb-4 flex items-center justify-between animate-slide-up" style={{ animationDelay: "300ms" }}>
            <h2 className="text-lg font-semibold">Active Sweeps</h2>
            <span className="text-sm text-sol-muted font-mono">
              {!loading ? sweeps.length : "..."} repositories
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {loading ? (
              <div className="text-sol-muted p-4">Loading active sweeps from Supabase...</div>
            ) : sweeps.length === 0 ? (
              <div className="text-sol-muted p-4 border border-sol-border/50 rounded-xl glass">No active sweeps found.</div>
            ) : (
              sweeps.map((sweep) => (
                <div key={sweep.id} className="animate-fade-in-scale">
                  <SweepCard sweep={sweep} />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
