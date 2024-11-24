import { defineConfig } from "vite";
import path from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const simlib = path.resolve(__dirname, "../lib");

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@simlib": path.resolve(__dirname, "../lib"),
    },
  },
});
