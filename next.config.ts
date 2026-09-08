import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

export default function nextConfig(phase: string): NextConfig {
  // Isolate Windows development caches without changing production output.
  // Vercel and next start both expect production artifacts in .next.
  if (phase === PHASE_DEVELOPMENT_SERVER && process.platform === "win32") {
    const accountName = execFileSync("whoami.exe", {
      encoding: "utf8",
      windowsHide: true,
    }).trim();
    const accountKey = createHash("sha256").update(accountName).digest("hex").slice(0, 12);
    return { distDir: `.next/account-${accountKey}` };
  }
  return { distDir: ".next" };
}
