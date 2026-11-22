import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The app is a single client-side page with no ISR or revalidation,
// so no incremental cache (R2/KV) is needed.
const config = {
  ...defineCloudflareConfig({}),
  // `npm run build` runs OpenNext (so Cloudflare's default build command works);
  // OpenNext in turn runs the plain Next.js build through this command.
  buildCommand: "npx next build",
};

export default config;
