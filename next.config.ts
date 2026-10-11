import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Prevent Next.js from climbing up to E:\pnpm-lock.yaml as the workspace root
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  // transformers.js loads onnxruntime and its tokenizer JSON through native
  // bindings and runtime path resolution, which breaks once webpack bundles it.
  serverExternalPackages: ["@huggingface/transformers"],
  async redirects() {
    return [
      {
        // Legacy alias. The profile editor lives in Settings now, and a
        // config-level redirect is a real 307 — calling redirect() from a
        // page renders a meta-refresh with a one-second delay instead.
        source: "/profile",
        destination: "/dashboard/settings?tab=profile",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
