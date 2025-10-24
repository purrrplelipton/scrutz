import netlify from "@netlify/vite-plugin";
import netlifyVitePluginReactRouter from "@netlify/vite-plugin-react-router";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    svgr(),
    netlifyVitePluginReactRouter(),
    netlify(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Only apply manual chunks in client build, not SSR
          if (id.includes("node_modules")) {
            if (id.includes("@lottiefiles/dotlottie-react")) {
              return "lottie";
            }
            if (id.includes("react-hook-form")) {
              return "form-vendor";
            }
            if (id.includes("date-fns") || id.includes("chrono-node")) {
              return "date-vendor";
            }
            if (id.includes("@tanstack/react-query")) {
              return "react-query";
            }
            if (id.includes("react-router") && !id.includes("@react-router")) {
              return "react-router-vendor";
            }
            if (id.includes("react-dom") || id.includes("/react/")) {
              return "react-vendor";
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
