import { handleUpdateDb } from "./updateFriend";

export type SavedDbMessages = {
  id: string;
  userId: string;
  message?: string;
  audio?: Blob[] | string | undefined;
  image?: string[] | string | undefined;
  video?: string | undefined;
  timestamp: number;
  sender: boolean;
};

export type SavedDbFriends = {
  userId: string;
  lastMessage?: string;
  lastMessageDate: number;
  profilePic: string;
  name: string;
  email: string;
  publicKey: CryptoKey;
};

export type FriendUpdate = {
  [K in keyof SavedDbFriends]: {
    key: K;
    value: SavedDbFriends[K];
  };
}[keyof SavedDbFriends];

export function openChatDB(clientId: string) {
  return new Promise((resolve: (r: IDBDatabase) => void, reject) => {
    const request = indexedDB.open(`ChatDB-${clientId}`, 2);

    request.onupgradeneeded = function () {
      const db = request.result;
      const messageStore = db.createObjectStore("messages", { keyPath: "id" });
      const friendStore = db.createObjectStore("friends", { keyPath: "userId" });
      const mediaStore = db.createObjectStore("media", { keyPath: "url" });
      const lastReadStore = db.createObjectStore("lastRead", { keyPath: "userId" });
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
export async function saveMessageForUser(clientId: string, data: SavedDbMessages) {
  const db = await openChatDB(clientId);
  const tx = db.transaction(["messages", "lastRead"], "readwrite");
  const store = tx.objectStore("messages");
  const lastReadStore = tx.objectStore("lastRead");

  if (data.sender) {
    lastReadStore.put({ userId: data.userId, timestamp: data.timestamp });
  }

  const message: SavedDbMessages = {
    id: data.id,
    userId: data.userId,
    message: data.message,
    audio: data.audio,
    image: data.image,
    video: data.video,
    timestamp: data.timestamp,
    sender: data.sender,
  };
  store.add(message);

  return new Promise((resolve: (v: void) => void, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
export async function saveFriend(clientId: string, data: SavedDbFriends) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("friends", "readwrite");
  const store = tx.objectStore("friends");
  store.add(data);
  return tx.oncomplete;
}
export async function updateFriendsInDb(clientId: string, data: { userId: string; update: FriendUpdate[] }): Promise<boolean> {
  const db = await openChatDB(clientId);
  const tx = db.transaction("friends", "readwrite");
  const store = tx.objectStore("friends");

  const friendRequest = store.get(data.userId);

  return new Promise((resolve: (r: true) => void, reject: (r: false) => void) => {
    friendRequest.onsuccess = () => {
      const friend: SavedDbFriends | null = friendRequest.result;

      if (!friend || !data.update) {
        reject(false);
        return;
      }

      data.update.forEach((update) => {
        if (update) (friend as any)[update.key] = update.value;
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

export async function getFriends(clientId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("friends", "readwrite");
  const store = tx.objectStore("friends");
  const index = store.index("time");

  const lowerBound = [0];
  const upperBound = [Date.now()];
  const range = IDBKeyRange.bound(lowerBound, upperBound);

  const friends: SavedDbFriends[] = [];
  const request = index.openCursor(range);

  return new Promise((resolve: (r: SavedDbFriends[]) => void, reject: (r: false) => void) => {
    request.onsuccess = function () {
      const cursor = request.result;
      if (cursor) {
        friends.push(cursor.value);
        cursor.continue();
      } else {
        resolve(friends);
      }
    };
    request.onerror = (err) => {
      console.log(err);
      reject(false);
    };
  });
}

export async function getMessagesSortedByTime(clientId: string, userId: string, timestamp?: number) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("messages", "readonly");
  const store = tx.objectStore("messages");
  const index = store.index("userId_timestamp");

  const lowerBound = [userId, timestamp || 0];
  const upperBound = [userId, Number.MAX_SAFE_INTEGER];
  const range = IDBKeyRange.bound(lowerBound, upperBound, true);

  const messages: SavedDbMessages[] = [];
  const request = index.openCursor(range);

  return new Promise((resolve: (r: SavedDbMessages[]) => void, reject: (r: false) => void) => {
    request.onsuccess = function () {
      const cursor = request.result;
      if (cursor) {
        messages.push(cursor.value);
        cursor.continue();
      } else {
        resolve(messages);
      }
    };
    request.onerror = () => reject(false);
  });
}

export async function checkMessagesByIdFromDB(clientId: string, chatId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("messages", "readonly");
  const store = tx.objectStore("messages");

  const request = store.get(chatId);

  return new Promise((resolve: (r: boolean) => void, reject) => {
    request.onsuccess = function () {
      const chat = request.result;
      if (chat) {
        resolve(true);
      } else {
        resolve(false);
      }
    };
    request.onerror = () => reject();
  });
}

export async function getFriend(clientId: string, userId: string) {
  try {
    const db = await openChatDB(clientId);
    const tx = db.transaction("friends", "readwrite");
    const store = tx.objectStore("friends");
    const friendQuery = store.get(userId);
    return new Promise((resolve: (r: SavedDbFriends | undefined | null) => void, reject) => {
      friendQuery.onsuccess = () => {
        const data = friendQuery.result;
        resolve(data);
      };
      friendQuery.onerror = () => reject();
    });
  } catch {}
}

export async function checkFriendData(clientId: string, userId: string) {
  try {
    const data = await getFriend(clientId, userId);
    if (!data) {
      const newData = await handleUpdateDb(userId, clientId);
      return newData;
    }
    return data;
  } catch {}
}

export async function deleteMessage(clientId: string, messageId: string) {
  try {
    const db = await openChatDB(clientId);
    const tx = db.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");
    const deleteMessage = store.delete(messageId);
    return new Promise((resolve: (r: true) => void, reject: (r: false) => void) => {
      deleteMessage.onsuccess = () => {
        resolve(true);
      };
      deleteMessage.onerror = () => reject(false);
    });
  } catch {
    return false;
  }
}

export async function saveMediaInDb(clientId: string, url: string, blob: Blob) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("media", "readwrite");
  const store = tx.objectStore("media");
  store.add({ url: url, blob });
  return new Promise((res: (r: string) => void, rej: () => void) => {
    tx.oncomplete = () => {
      res("done");
    };
    tx.onerror = () => {
      rej();
    };
  });
}
export async function deleteMediaInDb(clientId: string, url: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("media", "readwrite");
  const store = tx.objectStore("media");
  store.delete(url);
  return new Promise((res: (r: string) => void, rej: () => void) => {
    tx.oncomplete = () => {
      res("done");
    };
    tx.onerror = () => {
      rej();
    };
  });
}
export async function getMediaInDb(clientId: string, url: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("media", "readwrite");
  const store = tx.objectStore("media");
  const mediaRequest = store.get(url);
  return new Promise((res: (r: Blob) => void, rej: () => void) => {
    mediaRequest.onsuccess = () => {
      const data = mediaRequest.result;

      if (data) res(data.blob);
      else rej();
    };
  });
}

export async function updateLastRead(clientId: string, userId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("lastRead", "readwrite");
  const store = tx.objectStore("lastRead");

  const save = store.put({ userId, timestamp: Date.now() });
  return new Promise((res: (r: boolean) => void, rej: () => void) => {
    save.onsuccess = () => {
      res(true);
    };
    save.onsuccess = () => {
      rej();
    };
  });
}
export async function getLastRead(clientId: string, userId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("lastRead", "readwrite");
  const store = tx.objectStore("lastRead");
  const save = store.get(userId);
  return new Promise((res: (r: number) => void, rej: () => void) => {
    save.onsuccess = () => {
      if (save.result) {
        res(save.result.timestamp);
      } else {
        res(Date.now());
      }
    };
    save.onerror = () => {
      rej();
    };
  });
}
