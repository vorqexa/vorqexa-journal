import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// VITE_BASE sets where the site is served from:
//   unset            -> "/" (custom domain at the root, e.g. journal.vorqexa.xyz)
//   "/<repo-name>/"  -> default GitHub Pages URL (https://<owner>.github.io/<repo-name>/)
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
});
