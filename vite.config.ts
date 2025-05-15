import { defineConfig } from 'vite';
import vitePluginString from 'vite-plugin-string';

// Get the repository name from package.json or environment
const repoName = 'three-fluid';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
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
