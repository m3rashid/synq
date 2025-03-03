import path from 'node:path';
import { defineConfig } from 'vite';
import reactSwcPlugin from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactSwcPlugin()],
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      '@': path.resolve(__dirname, './src'),
    },
  },
});
