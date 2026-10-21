import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "/" works for a custom domain (journal.vorqexa.xyz).
// If you deploy to https://<user>.github.io/<repo>/ instead, set base to "/<repo>/".
export default defineConfig({
  base: "/vorqexa-journal/",
  plugins: [react()],
});
