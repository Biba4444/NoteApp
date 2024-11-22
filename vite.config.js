import { defineConfig } from "vite";

export default defineConfig({
  base: "/NoteApp/",

  build: {
    outDir: "dist",
  },
  server: {
    open: true,
    cors: true,
    port: 5173,
  },
});
