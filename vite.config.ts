
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";
import { nitro } from "nitro/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    mode === "production" ? nitro() : null, // Using the nitro plugin breaks vitest, so only enable it in production
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    viteReact(),
    svgr(),
  ],
}));
