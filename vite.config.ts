import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" -> relative asset paths so the build works on a GitHub Pages
// project URL (user.github.io/<repo>/) without hardcoding the repo name.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
