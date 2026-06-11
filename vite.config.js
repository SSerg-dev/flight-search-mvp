import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import duffelProxyHandler from './api/duffel-flights.js';
import { createDuffelApiDevMiddleware } from './src/dev/duffelApiDevMiddleware.js';

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'flight-search-duffel-api-dev',
      configureServer(server) {
        server.middlewares.use(createDuffelApiDevMiddleware({ handler: duffelProxyHandler }));
      },
    },
  ],
});
