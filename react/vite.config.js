import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BASE = '/lauricka-hry/react/';

// Presmeruje /lauricka-hry/react (bez koncovej lomky) na /lauricka-hry/react/,
// inak Vite dev server zobrazí len hlášku "did you mean to visit ... instead?".
function redirectToBasePlugin() {
  const baseWithoutSlash = BASE.slice(0, -1);
  const middleware = (req, res, next) => {
    const [pathname, search = ''] = req.url.split('?');
    if (pathname === baseWithoutSlash) {
      res.writeHead(302, { Location: BASE + (search ? `?${search}` : '') });
      res.end();
      return;
    }
    next();
  };
  return {
    name: 'redirect-to-base',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

export default defineConfig({
  base: BASE,
  plugins: [redirectToBasePlugin(), react()]
});
