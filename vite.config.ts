import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import Pages from "vite-plugin-pages"

export default defineConfig({
  plugins: [
    react(),
    cloudflare(),
    Pages({
      dirs: ['src/react-app/pages'],
      onRoutesGenerated(routes) {   // ← 加这一行
        console.log('\n[Pages] 生成路由：')
        console.log(JSON.stringify(routes, null, 2))
      },
    })],
});
