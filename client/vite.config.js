import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['192.168.1.119.nip.io']
  },
  resolve: {
    alias: {
      'Data': path.resolve(__dirname, './src/Data'),
      'Utils': path.resolve(__dirname, './src/Utils'),
      'Img': path.resolve(__dirname, './src/Img'),
      'Components': path.resolve(__dirname, './src/Components'),
      'Contexts': path.resolve(__dirname, './src/Contexts'),
      'Hooks': path.resolve(__dirname, './src/Hooks'),
      'Templates': path.resolve(__dirname, './src/Components/Templates'),
      'Types': path.resolve(__dirname, './src/Types')
  }
}})
