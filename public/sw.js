const version = 1;

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

self.addEventListener("push", function (event) {
  const data = event.data?.json() || undefined;
  if (!data) return;
  try {
    const notificationMessage = [];
    if (data.message) notificationMessage.push(data.message);
    if (data.image) notificationMessage.push("🖼️");
    if (data.image && !data.message) notificationMessage.push("Image");
    if (data.video) notificationMessage.push("🎞️ Video");
    if (data.audio) notificationMessage.push("🎙️ 1:00");
    const title = data.name;
    const options = {
      body: notificationMessage.join(" "),
      icon: "/icons/icon-48.png",
    };
    event.waitUntil(notificationFn(title, options, data));
  } catch {}
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

async function notificationFn(title, options, data) {
  try {
    const { userId, clientId } = data;
    // async code here
    await saveMessageForUser(clientId, data, userId);
    await updateFriend(data);
  } catch {
  } finally {
    return self.registration.showNotification(title, options);
  }
}

function openChatDB(clientId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(`ChatDB-${clientId}`, 2);

    request.onupgradeneeded = function () {
      const db = request.result;
      const messageStore = db.createObjectStore("messages", { keyPath: "id" });
      const friendStore = db.createObjectStore("friends", { keyPath: "id" });
      messageStore.createIndex("userId", "userId", { unique: false });
      messageStore.createIndex("timestamp", "timestamp", { unique: false });
      messageStore.createIndex("userId_timestamp", ["userId", "timestamp"], { unique: false });
      friendStore.createIndex("time", ["lastMessageDate"], { unique: false });
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

async function saveMessageForUser(clientId, data, userId) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("messages", "readwrite");
  const store = tx.objectStore("messages");

  const message = {
    id: data.id,
    userId: userId,
    message: data.message || undefined,
    audio: data.audio || undefined,
    image: data.image || undefined,
    video: data.video || undefined,
    timestamp: data.timestamp || Date.now(),
    sender: false,
  };

  store.add(message);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const updateFriend = async ({ clientId, userId, image, message, audio }) => {
  const type = image ? "image" : message ? "message" : audio && "audio";
  if (!type) return;
  const updates = [];
  updates.push({ key: "lastMessage", value: type === "message" ? message || type : type });
  updates.push({ key: "lastMessageDate", value: Date.now() });
  try {
    await updateFriendsInDb(clientId, { userId, update: updates });
  } catch {}
};

async function updateFriendsInDb(clientId, data) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("friends", "readwrite");
  const store = tx.objectStore("friends");

  const friendRequest = store.get(data.userId);

  return new Promise((resolve, reject) => {
    friendRequest.onsuccess = () => {
      const friend = friendRequest.result;

      if (!friend || !data.update) {
        reject(false);
        return;
      }
      data.update.forEach((update) => {
        if (update && update.key === "newMessage") {
          const value = update.value;
          let newMessages = friend.newMessage;
          newMessages = value ? (newMessages ? newMessages + value : value) : 0;
          friend.newMessage = newMessages;
        } else if (update) {
          friend[update.key] = update.value;
        }
      });
      const updateRequest = store.put(friend);
      updateRequest.onsuccess = () => resolve(true);
      updateRequest.onerror = () => reject(false);
    };
    friendRequest.onerror = () => {
      reject(false);
    };
  });
}

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
