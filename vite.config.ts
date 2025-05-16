import { defineConfig } from 'vite';
import vitePluginString from 'vite-plugin-string';
import { resolve } from 'path';

// Get the repository name from package.json or environment
const repoName = 'three-fluid';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        water: resolve(__dirname, 'water.html')
      }
    }
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
