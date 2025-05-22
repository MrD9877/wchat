"use client";

export const SETTING_CACHES = {
  CACHE_NAME: "settings",
  CACHE_URL: "/network_mode",
  CACHE_HEADER: "x-network_mode",
};

export const NETWORK_MODE_GROUP = {
  ONLINE_MODE: "Online mode",
  SEMI_OFFLINE: "Semi-offline",
  OFFLINE_MODE: "Offline Mode",
  inputsType: "radio",
};

export const version = 1;

const cacheWithDomain = ["hinds-app-media.s3.eu-north-1.amazonaws.com"];

const cacheNameArray = [`default-version-${version}`, `javascript-version-${version}`, `html-version-${version}`, `css-version-${version}`, SETTING_CACHES.CACHE_URL];

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

const deleteOldCaches = async () => {
  const cachesArr = await caches.keys();

  for (let i = 0; i < cachesArr.length; i++) {
    const currCache = cachesArr[i];
    if (!cacheNameArray.includes(currCache)) {
      await caches.delete(currCache);
    }
  }
};

async function confirmOnlineFn(ev) {
  let confirmOnline = false;
  try {
    const res = await fetch("/globe.svg", { method: "HEAD" });
    if (res.ok) {
      confirmOnline = true;
    }
  } catch (err) {
    console.log(err);
    confirmOnline = false;
  }
  if (ev.source && "id" in ev.source) {
    const client = await clients.get(ev.source.id);
    client?.postMessage({ confirmOnline });
  }
  return confirmOnline;
}

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

const getNetworkMode = async (ev) => {
  const request = ev.request;
  try {
    if (request.headers.has(SETTING_CACHES.CACHE_HEADER)) {
      const mode = request.headers.get(SETTING_CACHES.CACHE_HEADER);
      return mode;
    }
    const res = await caches.match(SETTING_CACHES.CACHE_URL);
    if (res && res.headers.has(SETTING_CACHES.CACHE_HEADER)) {
      const mode = res.headers.get(SETTING_CACHES.CACHE_HEADER);
      return mode;
    }
  } catch {
    return null;
  }
};

const getClient = async (ev) => {
  const client = await clients.get(ev.clientId);
  return client;
};

async function handleRequest(ev) {
  const url = new URL(ev.request.url);
  if (cacheWithDomain.includes(url.hostname)) {
    const cacheRes = await caches.match(`${ev.request.url}`);
    if (cacheRes) return cacheRes;
    else {
      const res = await fetchAndSaveInCaches(ev.request);
      if (res) return res;
      return new Response();
    }
  } else {
    return await fetch(ev.request);
  }
}
