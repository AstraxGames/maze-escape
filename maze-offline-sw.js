/*
 * Maze Escape offline asset cache.
 * Install under the same folder as the Maze Escape index.html.
 * The first online visit pre-caches core libraries; subsequent online loads
 * cache campaign assets as the game requests them.
 */
const CACHE_PREFIX = 'maze-escape-offline-';
const CACHE_NAME = `${CACHE_PREFIX}v1`;

const CORE_ASSETS = [
  // Core rendering, loader, audio and post-processing libraries.
  { url: 'https://cdn.tailwindcss.com', opaqueFallback: true },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js', opaqueFallback: true },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/GammaCorrectionShader.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/Pass.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js', opaqueFallback: true },
  { url: 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js', opaqueFallback: true },

  // Firebase SDK modules are cached for script loading, but Firebase data APIs
  // are deliberately never cached or replayed by this service worker.
  { url: 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js', opaqueFallback: false },
  { url: 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js', opaqueFallback: false },
  { url: 'https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js', opaqueFallback: false },

  // Same-origin campaign assets used by the current Maze Escape save.
  { url: './index.html', opaqueFallback: false },
  { url: './astrax_splash.js', opaqueFallback: false },
  { url: './images/load.jpg', opaqueFallback: false },
  { url: './textures/Campaign_ground_diff.webp', opaqueFallback: false },
  { url: './textures/Campaign_ground_gl.webp', opaqueFallback: false },
  { url: './textures/Campaign_ground_rough.webp', opaqueFallback: false },
  { url: './textures/Multip_ground_diff.webp', opaqueFallback: false },
  { url: './textures/Multip_ground_gl.webp', opaqueFallback: false },
  { url: './textures/Multip_ground_rough.webp', opaqueFallback: false },
  { url: './textures/Campaign_diff.jpg', opaqueFallback: false },
  { url: './textures/Campaign_gl.jpg', opaqueFallback: false },
  { url: './textures/Campaign_gh.jpg', opaqueFallback: false },
  { url: './textures/Multip_wall_diff.webp', opaqueFallback: false },
  { url: './textures/Multip_wall_gl.webp', opaqueFallback: false },
  { url: './textures/Multip_wall_rough.webp', opaqueFallback: false },
  { url: './textures/PVP.webp', opaqueFallback: false },
  { url: './audio/jump.mp3', opaqueFallback: false },
  { url: './audio/spray.mp3', opaqueFallback: false },
  { url: './models/lubricant_spray_1k/lubricant_spray_1k.gltf', opaqueFallback: false }
];

function isApiRequest(url) {
  const host = url.hostname.toLowerCase();
  return host.endsWith('.firebasedatabase.app') ||
    host.endsWith('.firebaseio.com') ||
    host === 'identitytoolkit.googleapis.com' ||
    host === 'securetoken.googleapis.com' ||
    host === 'firebaseinstallations.googleapis.com' ||
    host === 'fcmregistrations.googleapis.com' ||
    host.endsWith('.workers.dev') ||
    url.pathname.includes('/.ws');
}

function isCacheableRequest(request, url) {
  if (request.method !== 'GET' || request.headers.has('authorization') || isApiRequest(url)) return false;
  if (url.origin === self.location.origin) return true;
  return ['script', 'style', 'image', 'font', 'audio', 'video', 'worker'].includes(request.destination) ||
    /\.(?:m?js|css|png|jpe?g|webp|gif|svg|woff2?|ttf|mp3|wav|ogg|glb|gltf|bin)$/i.test(url.pathname);
}

async function fetchWithTimeout(url, mode, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(new Request(url, { mode, cache: 'reload', signal: controller.signal }));
  } finally {
    clearTimeout(timer);
  }
}

async function preloadAsset(cache, item) {
  const url = new URL(item.url, self.registration.scope).href;
  const crossOrigin = new URL(url).origin !== self.location.origin;
  try {
    let response;
    if (crossOrigin && item.opaqueFallback) {
      // These dependencies are classic <script src> loads (no-cors). Store an
      // opaque response so the service worker returns the same response type.
      response = await fetchWithTimeout(url, 'no-cors');
    } else {
      // ES modules must remain CORS-readable; opaque module responses cannot run.
      response = await fetchWithTimeout(url, crossOrigin ? 'cors' : 'same-origin');
    }
    if (response && (response.ok || (item.opaqueFallback && response.type === 'opaque'))) {
      await cache.put(url, response.clone());
    }
  } catch (error) {
    // A single optional or missing asset must not prevent SW installation.
    console.info('[Maze Escape SW] Pre-cache skipped:', url, error && error.message);
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(CORE_ASSETS.map(item => preloadAsset(cache, item)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map(name => {
      if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) return caches.delete(name);
      return Promise.resolve(false);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (isApiRequest(url)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Navigation is network-first so deployments update normally, with the
    // last successfully loaded game document used when the network is absent.
    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response && response.status === 200) {
          try { await cache.put(request, response.clone()); } catch (_) {}
        }
        return response;
      } catch (_) {
        const cachedPage = await cache.match(request, { ignoreVary: true });
        if (cachedPage) return cachedPage;
        const indexFallback = await cache.match(new URL('./index.html', self.registration.scope).href);
        if (indexFallback) return indexFallback;
        return new Response('Maze Escape is not available offline yet. Connect once and reload the game to cache it.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    }

    if (!isCacheableRequest(request, url)) return fetch(request);

    const cached = await cache.match(request, { ignoreVary: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && (response.status === 200 || response.type === 'opaque')) {
        try { await cache.put(request, response.clone()); } catch (_) {}
      }
      return response;
    } catch (_) {
      return new Response('', {
        status: 504,
        statusText: 'Offline asset not cached',
        headers: { 'X-Maze-Escape-Offline-Miss': '1' }
      });
    }
  })());
});
