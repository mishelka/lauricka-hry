import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/lauricka-hry/react/',
  plugins: [react()]
});
