import { defineConfig } from 'vite';

export default defineConfig({
    // IMPORTANT: Replace 'your-repo-name' with your actual GitHub repository name
    // For example, if your repo URL is https://github.com/username/webxr-test
    // then use base: '/webxr-test/'
    base: '/webXR_test/', // Update this with your actual repo name
    
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    babylon: ['@babylonjs/core', '@babylonjs/loaders']
                }
            }
        }
    },
    
    server: {
        host: true,
        port: 3000,
        // Enable HTTPS for local development (required for WebXR)
        https: true
    },
    
    optimizeDeps: {
        include: ['@babylonjs/core', '@babylonjs/loaders']
    },
    
    resolve: {
        alias: {
            '@': '/src'
        }
    }
});
