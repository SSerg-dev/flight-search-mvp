import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { createDuffelProxyHandler } from './api/duffel-flights.js';
import { createDuffelApiDevMiddleware } from './src/dev/duffelApiDevMiddleware.js';

export function createFlightSearchViteConfig({ env = {}, fetchImpl = globalThis.fetch } = {}) {
  return {
  plugins: [
    tailwindcss(),
    {
      name: 'flight-search-duffel-api-dev',
      configureServer(server) {
        server.middlewares.use(
          createDuffelApiDevMiddleware({
            handler: createDuffelProxyHandler({
              env,
              fetchImpl,
            }),
          }),
        );
      },
    },
  ],
  };
}

export default defineConfig(({ mode }) =>
  createFlightSearchViteConfig({
    env: loadEnv(mode, process.cwd(), ''),
  }),
);
