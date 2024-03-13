import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'Data': path.resolve(__dirname, './src/Data'),
      'Utils': path.resolve(__dirname, './src/Utils'),
      'Img': path.resolve(__dirname, './src/Img'),
      'Components': path.resolve(__dirname, './src/Components'),
      'Contexts': path.resolve(__dirname, './src/Contexts'),
      'Hooks': path.resolve(__dirname, './src/Hooks'),
      'Templates': path.resolve(__dirname, './src/Components/Templates')
  }
}})
