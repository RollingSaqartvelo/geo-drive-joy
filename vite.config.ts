// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    nitro: {
      routeRules: {
        "/_build/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
        "/**.webp": { headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=86400" } },
        "/**.avif": { headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=86400" } },
        "/**.jpg": { headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=86400" } },
        "/**.jpeg": { headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=86400" } },
        "/**.png": { headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=86400" } },
        "/**.woff2": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
      },
    },
  },
});
