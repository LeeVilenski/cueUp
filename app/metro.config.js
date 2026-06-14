const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite's web build loads its SQLite engine as a .wasm file; Metro
// needs to treat it as an asset rather than try to transform it as source.
config.resolver.assetExts.push('wasm');

// expo-sqlite's web build relies on SharedArrayBuffer (via a worker), which
// browsers only expose on cross-origin-isolated pages. Add the COOP/COEP
// headers to the dev server so `expo start --web` can open the database.
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    return middleware(req, res, next);
  };
};

module.exports = config;
