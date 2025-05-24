export const version = 1;

const MAX_AGE = 12 * 60 * 60 * 1000;

const cacheWithDomain = ["hinds-app-media.s3.eu-north-1.amazonaws.com"];

////////////////////////////////////////////////

self.addEventListener("install", (ev) => {
  self.skipWaiting();
  // ev.waitUntil(deleteOldCaches());
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(clients.claim());
});
self.addEventListener("fetch", (ev) => {
  ev.respondWith(
    (async () => {
      const res = await handleRequest(ev);
      return res;
    })()
  );
});

self.addEventListener("message", (ev) => {
  console.log(ev.data);
  if (ev.data === "confirmOnline") {
    // ev.waitUntil(confirmOnlineFn(ev));
  }
  if (ev.data.msg === "clearCache") {
    ev.waitUntil(deleteCache(ev.data.url));
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////

const deleteCache = async (url) => {
  const cache = await caches.open("media");
  const c = await cache.keys();
  console.log(c);
  await cache.delete(url);
};

const fetchAndSaveInCaches = async (req) => {
  const cachesName = "media";
  try {
    const response = await fetch(req);

    const cache = await caches.open(cachesName);
    await cache.delete(req.url);
    await cache.put(req.url, response.clone());
    return response;
  } catch {
    return null;
  }
};

async function handleRequest(ev) {
  const url = new URL(ev.request.url);
  if ("webnovel-d.s3.eu-north-1.amazonaws.com" === url.hostname && ev.request.method === "GET") {
    const cacheRes = await caches.match(`${ev.request.url}`);
    if (cacheRes) {
      const cachedDate = new Date(cacheRes.headers.get("media-cache-time"));
      const age = Date.now() - cachedDate.getTime();
      console.log(age);
      if (age < MAX_AGE) {
        return cacheRes;
      } else {
        return fetchAndCacheWithExpireDate(ev.request);
      }
    } else {
      return fetchAndCacheWithExpireDate(ev.request);
    }
  } else {
    try {
      return await fetch(ev.request);
    } catch {}
  }
}

async function fetchAndCacheWithExpireDate(request) {
  try {
    const cache = await caches.open("media");
    const response = await fetch(`${request.url}?ts=${Date.now()}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "image/png",
      },
    });
    if (!response || response.status !== 200) throw Error();
    const headers = new Headers(response.headers);
    headers.append("media-cache-time", new Date().toISOString());
    const editedResponse = new Response(response.body, {
      headers,
      status: response.status,
      statusText: "ok",
    });
    cache.put(request, editedResponse.clone());
    return editedResponse;
  } catch (err) {
    console.log(err);

    return new Response("", { status: 400 });
  }
}
