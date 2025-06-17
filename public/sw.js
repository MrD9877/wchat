const version = 1;

const MAX_AGE = 12 * 60 * 60 * 1000;

const cacheEndpoint = [];
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
  event.waitUntil(notificationFn(data));
});

self.addEventListener("message", (ev) => {
  if (ev.data.msg === "clearCache") {
    ev.waitUntil(deleteCache(ev.data.url));
  }
});

//   NOTIFICATION FUNCTIONS  //////////////////////////////////////////////////////////////////////////////////////////

async function notificationFn(data) {
  try {
    const { isAppFocused, isAppOpen } = await appStatus();
    if (isAppOpen) return;
    const keys = await getKeysFromDb();
    if (!keys) throw Error();
    const privateKey = keys.privateKey;
    const parsedMessage = await decryptOne(data.message, privateKey);
    const parsedaudio = await decryptAwsURL(data.audio, privateKey);
    const parsedImages = await decryptAwsURLS(data.image, privateKey);

    const notificationMessage = [];
    if (parsedMessage) notificationMessage.push(parsedMessage);
    if (data.image) notificationMessage.push("🖼️");
    if (data.image && !data.message) notificationMessage.push("Image");
    if (data.video) notificationMessage.push("🎞️ Video");
    if (data.audio) notificationMessage.push("🎙️ 1:00");
    const title = data.name;
    const options = {
      body: notificationMessage.join(" "),
      icon: "/icons/icon-48.png",
      badge: "/icons/icon-16.png",
    };

    if (!isAppOpen && !isAppFocused) {
      const { userId, clientId } = data;
      await saveMessageForUser(clientId, { ...data, message: parsedMessage, image: parsedImages, audio: parsedaudio }, userId);
      await updateFriend({ ...data, message: parsedMessage, image: parsedImages, audio: parsedaudio });
    }
    if (!isAppOpen) {
      return self.registration.showNotification(title, options);
    }
  } catch (err) {
    console.log(err);
  }
}

async function appStatus() {
  let isAppOpen = false;
  let isAppFocused = false;

  const clientsList = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of clientsList) {
    if (client.visibilityState === "visible") {
      isAppOpen = true;
      isAppFocused = true;
      break; // One focused client is enough
    } else if (client.visibilityState === "hidden") {
      isAppOpen = true;
    }
  }
  return { isAppFocused, isAppOpen };
}

/////////////// INDEXDB FUNCTIONS    /////////////////////////////////////////////////

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
        friend[update.key] = update.value;
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

////////////// ENCRYPTION FUNCTIONS               ////////////////////////////////////////////////////
const decryptAwsURL = async (awsUrl, privateKey) => {
  if (!awsUrl) return;
  const url = new URL(awsUrl);
  const signature = url.searchParams.get("X-Amz-Signature");
  if (!signature) throw Error();
  const decryptedSignature = await decryptOne(signature, privateKey);
  if (decryptedSignature) url.searchParams.set("X-Amz-Signature", decryptedSignature);
  return url.href;
};

const decryptAwsURLS = async (awsUrls, privateKey) => {
  if (!awsUrls) return;
  const urls = [];
  for (let i = 0; i < awsUrls.length; i++) {
    const url = await decryptAwsURL(awsUrls[i], privateKey);
    if (url) urls.push(url);
  }
  return urls;
};

async function decryptOne(encryptedString, privateKey) {
  if (!encryptedString) return;
  const encrypted = Uint8Array.from(atob(encryptedString), (c) => c.charCodeAt(0));
  const decrypted = await self.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, encrypted);
  return new TextDecoder().decode(decrypted);
}

const openEncryptionDB = () => {
  const dbRequest = indexedDB.open(`encrypt`, 1);
  return new Promise((res, rej) => {
    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      res(db);
    };
    dbRequest.onerror = () => rej();
  });
};

const getKeysFromDb = async () => {
  const db = await openEncryptionDB();
  const tx = db.transaction("keys", "readwrite");
  const store = tx.objectStore("keys");
  const request = store.getAll();
  const keys = new Promise((res, rej) => {
    request.onsuccess = () => {
      const data = request.result;
      if (data && data.length >= 2) {
        const temp = {};
        data.forEach((item) => {
          temp[item.type] = item.value;
        });
        res(temp);
      } else res(false);
    };
    request.onerror = () => rej("error");
  });
  const data = await keys;
  return data;
};
///////  FETCH FUNCTIONS            //////////////////////////////////////////////////////////////////////

const deleteCache = async (url) => {
  const cache = await caches.open("media");
  const c = await cache.keys();
  await cache.delete(url);
};

async function handleRequest(ev) {
  const url = new URL(ev.request.url);
  if (cacheEndpoint.includes(url.pathname) || ("webnovel-d.s3.eu-north-1.amazonaws.com" === url.hostname && ev.request.method === "GET")) {
    const cacheRes = await caches.match(`${ev.request.url}`);
    if (cacheRes) {
      const cachedDate = new Date(cacheRes.headers.get("media-cache-time"));
      const age = Date.now() - cachedDate.getTime();
      if (age < MAX_AGE) return cacheRes;
    }
    return fetchAndCacheWithExpireDate(ev.request);
  }
  return await fetch(ev.request);
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
