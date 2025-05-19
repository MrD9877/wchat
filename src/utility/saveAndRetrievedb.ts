import { generateRandom } from "@/app/(backend)/utility/random";

function openChatDB(clientId: string) {
  return new Promise((resolve: (r: IDBDatabase) => void, reject) => {
    const request = indexedDB.open(`ChatDB-${clientId}`, 1);

    request.onupgradeneeded = function (event) {
      const db = request.result;
      const messageStore = db.createObjectStore("messages", { keyPath: "id" });
      const friendStore = db.createObjectStore("friends", { keyPath: "userId" });
      messageStore.createIndex("userId", "userId", { unique: false });
      messageStore.createIndex("timestamp", "timestamp", { unique: false });
      messageStore.createIndex("userId_timestamp", ["userId", "timestamp"], { unique: false });
      friendStore.createIndex("lastMessageDate", ["userId", "lastMessageDate"], { unique: false });
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}
export async function saveMessageForUser(clientId: string, sender: boolean, messageText: string, userId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("messages", "readwrite");
  const store = tx.objectStore("messages");

  const message = {
    id: generateRandom(16), // unique ID (can be UUID)
    userId: userId,
    message: messageText,
    timestamp: Date.now(),
    sender,
  };

  store.add(message);

  return tx.oncomplete;
}
export async function saveFriends(clientId: string, data: { userId: string; lastMessage: string; lastMessageDate: Date; profilePic: string; name: string; email: string }) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("friends", "readwrite");
  const store = tx.objectStore("friends");
  store.add(data);
  return tx.oncomplete;
}
export async function updateFriends(clientId: string, data: { userId: string; update: { key: string; value: string | Date } }): Promise<boolean> {
  const db = await openChatDB(clientId);
  const tx = db.transaction("friends", "readwrite");
  const store = tx.objectStore("friends");

  const friendRequest = store.get(data.userId);

  return new Promise((resolve: (r: true) => void, reject: (r: false) => void) => {
    friendRequest.onsuccess = () => {
      const friend = friendRequest.result;

      if (!friend) {
        reject(false);
        return;
      }
      friend[data.update.key] = data.update.value;
      const updateRequest = store.put(friend);
      updateRequest.onsuccess = () => resolve(true);
      updateRequest.onerror = () => reject(false);
    };
    friendRequest.onerror = () => {
      reject(false);
    };
  });
}

export async function getFriends(clientId: string, data: { userId: string }) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("friends", "readwrite");
  const store = tx.objectStore("friends");
  const index = store.index("lastMessageDate");

  const lowerBound = [userId, 0];
  const upperBound = [userId, Number.MAX_SAFE_INTEGER];
  const range = IDBKeyRange.bound(lowerBound, upperBound);

  const messages: string[] = [];
  const request = index.openCursor(range);

  return new Promise((resolve, reject) => {
    request.onsuccess = function () {
      const cursor = request.result;
      if (cursor) {
        console.log(cursor);
        messages.push(cursor.value);
        cursor.continue();
      } else {
        resolve(messages);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getMessagesSortedByTime(clientId: string, userId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("messages", "readonly");
  const store = tx.objectStore("messages");
  const index = store.index("userId_timestamp");

  const lowerBound = [userId, 0];
  const upperBound = [userId, Number.MAX_SAFE_INTEGER];
  const range = IDBKeyRange.bound(lowerBound, upperBound);

  const messages: string[] = [];
  const request = index.openCursor(range);

  return new Promise((resolve, reject) => {
    request.onsuccess = function () {
      const cursor = request.result;
      if (cursor) {
        console.log(cursor);
        messages.push(cursor.value);
        cursor.continue();
      } else {
        resolve(messages);
      }
    };
    request.onerror = () => reject(request.error);
  });
}
