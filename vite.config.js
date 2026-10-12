import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { createSerpApiProxyHandler } from './api/serpapi-flights.js';
import { createSerpApiAccountHandler } from './api/serpapi-account.js';
import { createSerpApiDevMiddleware } from './src/dev/serpapiApiDevMiddleware.js';

export function createFlightSearchViteConfig({ env = {}, fetchImpl = globalThis.fetch } = {}) {
  return {
  plugins: [
    tailwindcss(),
    {
      name: 'flight-search-serpapi-api-dev',
      configureServer(server) {
        server.middlewares.use(
          createSerpApiDevMiddleware({
            handler: createSerpApiProxyHandler({
              env,
              fetchImpl,
            }),
            accountHandler: createSerpApiAccountHandler({ env, fetchImpl }),
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
