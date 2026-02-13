import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'TEST_HAZARD_SPOTTER_';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${repoName}/` : '/'
}));
