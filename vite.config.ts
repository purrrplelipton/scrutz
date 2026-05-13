import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env["BASE_URL"] || "/",
    server: {
      port: Number.parseInt(env["PORT"] || "5173", 10),
    },
    preview: {
      port: Number.parseInt(env["PORT"] || "5173", 10),
      allowedHosts: [],
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        srcDirectory: "src",
        spa: {
          enabled: true,
          maskPath: "/",
          prerender: {
            enabled: true,
            outputPath: "/index.html",
            autoSubfolderIndex: true,
            crawlLinks: true,
            retryCount: 3,
            retryDelay: 1000,
            onSuccess() {},
          },
        },
      }),
      viteReact(),
      babel({
        presets: [reactCompilerPreset()],
      }),
      svgr(),
    ],
    ...(env["NODE_ENV"] === "production" && { oxc: {} }),
    resolve: {
      tsconfigPaths: true,
    },
  };
});

export default config;
