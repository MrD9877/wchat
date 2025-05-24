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
  newMessage?: number;
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
export async function saveMessageForUser(clientId: string, data: Omit<SavedDbMessages, "userId" | "timestamp">, userId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("messages", "readwrite");
  const store = tx.objectStore("messages");

  const message: SavedDbMessages = {
    id: data.id, // unique ID (can be UUID)
    userId: userId,
    message: data.message,
    audio: data.audio,
    image: data.image,
    video: data.video,
    timestamp: Date.now(),
    sender: data.sender,
  };

  store.add(message);

  return tx.oncomplete;
}
export async function saveFriends(clientId: string, data: SavedDbFriends) {
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
        if (update && update.key === "newMessage") {
          const value = update.value;
          let newMessages = friend.newMessage;
          newMessages = value ? (newMessages ? newMessages + value : value) : 0;
          friend.newMessage = newMessages;
        } else if (update) {
          (friend as any)[update.key] = update.value;
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

export async function getFriends(clientId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("friends", "readwrite");
  const store = tx.objectStore("friends");
  const index = store.index("time");
  console.log("1");

  const lowerBound = [0];
  const upperBound = [Date.now()];
  const range = IDBKeyRange.bound(lowerBound, upperBound);

  const friends: SavedDbFriends[] = [];
  const request = index.openCursor(range);

  return new Promise((resolve: (r: SavedDbFriends[]) => void, reject: (r: false) => void) => {
    request.onsuccess = function () {
      const cursor = request.result;
      console.log({ cursor });
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

export async function getMessagesSortedByTime(clientId: string, userId: string) {
  const db = await openChatDB(clientId);
  const tx = db.transaction("messages", "readonly");
  const store = tx.objectStore("messages");
  const index = store.index("userId_timestamp");

  const lowerBound = [userId, 0];
  const upperBound = [userId, Number.MAX_SAFE_INTEGER];
  const range = IDBKeyRange.bound(lowerBound, upperBound);

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
  console.log("updating");
  try {
    const data = await getFriend(clientId, userId);
    if (!data) {
      await handleUpdateDb(userId, clientId);
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
