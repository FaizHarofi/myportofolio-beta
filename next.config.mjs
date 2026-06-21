import { withSentryConfig } from "@sentry/nextjs";

const DEBUG_MODE =
  String(process.env.DEBUG_MODE ?? "").toLowerCase() === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // Next.js Dev Tools (floating "N" icon, ⌘+B / Ctrl+B to toggle).
  // Show only when DEBUG_MODE is on; hidden in production.
  devIndicators: DEBUG_MODE
    ? { appIsrStatus: true, buildActivity: true }
    : false,
};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "javascript-mastery",
    project: "javascript-nextjs",
  },
  {
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
