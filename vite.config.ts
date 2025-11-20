import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env  = loadEnv(mode, process.cwd());
  const port = Number(env.VITE_PORT ?? 3000);

  return {
    server:  { port },
    preview: { port },
    plugins: [sveltekit()],
  };
});
