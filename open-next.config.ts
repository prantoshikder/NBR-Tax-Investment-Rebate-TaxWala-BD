import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// The app is a single client-side page with no ISR or revalidation,
// so no incremental cache (R2/KV) is needed.
export default defineCloudflareConfig({});
