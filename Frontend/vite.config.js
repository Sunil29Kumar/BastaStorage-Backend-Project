import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // server: {
  //   host: 'app.local',
  //   port: 4000,
  //   allowedHosts: ['www.local.com', 'app.local', 'localhost']
  // }
})
