import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src/'),
			'@app': path.resolve('./src/App.tsx'),
			'@stores': path.resolve('./src/stores/'),
			'@pages': path.resolve('./src/pages/'),
			'@components': path.resolve('./src/components/'),
			'@utils': path.resolve('./src/utils/'),
			'@contexts': path.resolve('./src/contexts/'),
			'@routes': path.resolve('./src/routes/'),
			'@types': path.resolve('./src/types/'),
		},
	},
});
