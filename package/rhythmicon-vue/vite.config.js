import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "index.js",
      name: "rhythmicon-vue",
      formats: ["es"],
      fileName: () => "rhythmicon-vue.js",
    },
    rollupOptions: {
      external: ["rhythmicon-rhythm","vue"],
    },
  },
})
