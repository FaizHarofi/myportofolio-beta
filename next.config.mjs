import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverActions: {
    bodySizeLimit: "5mb",
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
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
