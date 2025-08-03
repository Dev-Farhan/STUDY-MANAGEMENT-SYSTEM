import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
   resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),           // e.g., @/components
      '@utils': path.resolve(__dirname, './src/utils'), // optional custom
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },  
});
