import type { NextConfig } from "next";
import { userInfo } from "node:os";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

// Windows accounts must not share generated files: atomic replacement needs
// delete permissions that another account's cache may not grant.
const accountName = process.platform === "win32"
  ? execFileSync("whoami.exe", { encoding: "utf8", windowsHide: true }).trim()
  : userInfo().username;
const accountKey = createHash("sha256").update(accountName).digest("hex").slice(0, 12);
const nextConfig: NextConfig = {
  distDir: `.next/account-${accountKey}`,
};

export default nextConfig;
