const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info('using preload response', preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache(["/", "https://blissradio.github.io/index.html", "https://blissradio.github.io/js/amplitude.js", "https://cdn.jsdelivr.net/npm/amplitudejs@5.3.2/dist/visualizations/michaelbromley.js", "https://blissradio.github.io/css/app.css", "https://blissradio.github.io/js/functions.js", "https://blissradio.github.io/img/previous.svg", "https://blissradio.github.io/img/stop.svg", "https://blissradio.github.io/img/next.svg", "https://blissradio.github.io/img/thumb.png", "https://blissradio.github.io/img/stop1.svg", "https://fonts.gstatic.com/s/lexend/v19/wlptgwvFAVdoq2_F94zlCfv0bz1WCzsWzLdneg.woff2", "https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2", "https://blissradio.github.io/img/minimize.svg", "https://blissradio.github.io/img/link.svg", "https://blissradio.github.io/img/volume.svg", "https://blissradio.github.io/img/logo3.png", "https://blissradio.github.io/img/maximize.svg", "https://blissradio.github.io/img/100-NL.webp", "https://blissradio.github.io/img/leeuwicon_orange.png", "https://blissradio.github.io/img/538.webp", "https://blissradio.github.io/img/favicon.png", "https://blissradio.github.io/img/play.svg", "https://blissradio.github.io/img/volume1.svg", "https://blissradio.github.io/manifest.json", "https://blissradio.github.io/favicon.ico", "https://blissradio.github.io/logo2.png", "https://blissradio.github.io/desktop1.png", "https://blissradio.github.io/desktop2.png", "https://blissradio.github.io/desktop3.png", "https://blissradio.github.io/img/538-1.webp", "https://blissradio.github.io/img/538-2.webp", "https://blissradio.github.io/img/538-3.webp", "https://blissradio.github.io/img/538-4.webp", "https://blissradio.github.io/img/538-5.webp", "https://blissradio.github.io/img/538-6.webp", "https://blissradio.github.io/img/Joe-4.webp", "https://blissradio.github.io/img/Joe-1.webp", "https://blissradio.github.io/img/Joe-2.webp", "https://blissradio.github.io/img/Joe-3.webp", "https://blissradio.github.io/img/Joe-5.webp", "https://blissradio.github.io/img/Joe-6.webp", "https://blissradio.github.io/img/joyradio1.webp", "https://blissradio.github.io/img/logo(2).webp", "https://blissradio.github.io/img/joyradio2.webp", "https://blissradio.github.io/img/joyradio3.webp", "https://blissradio.github.io/img/joyradio4.webp", "https://blissradio.github.io/img/NPO_1.webp"]
)
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: 'https://blissradio.github.io/index.html',
    })
  );
});