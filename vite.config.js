import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { createDuffelProxyHandler } from './api/duffel-flights.js';
import { createSerpApiProxyHandler } from './api/serpapi-flights.js';
import { createDuffelApiDevMiddleware } from './src/dev/duffelApiDevMiddleware.js';
import { createSerpApiDevMiddleware } from './src/dev/serpapiApiDevMiddleware.js';

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
    {
      name: 'flight-search-serpapi-api-dev',
      configureServer(server) {
        server.middlewares.use(
          createSerpApiDevMiddleware({
            handler: createSerpApiProxyHandler({
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
