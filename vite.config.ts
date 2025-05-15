import { defineConfig } from 'vite';
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
  },
  plugins: [
    vitePluginString({
      include: ['**/*.vert', '**/*.frag'],
    }),
  ],
});
