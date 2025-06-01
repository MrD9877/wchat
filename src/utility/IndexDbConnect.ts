import { onUpgrade } from "./indexDbFunctions";
export type IndexStores = { friendStore: IDBObjectStore; chatStore: IDBObjectStore; emoteStore: IDBObjectStore };

export async function connectIndexDb() {
  const indexedDB = window.indexedDB;
  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
  }
  // 2
  const promise = new Promise((res: ({ stores, transaction }: { stores: IndexStores; transaction: IDBTransaction }) => void, rej) => {
    const request = indexedDB.open("wchat", 1);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };

    request.onupgradeneeded = onUpgrade;

    request.onsuccess = function () {
      const db = request.result;
      // 1
      const transaction = db.transaction(["friends", "chats", "emotes"], "readwrite");
      //2
      const friendStore = transaction.objectStore("friends");
      const chatStore = transaction.objectStore("chats");
      const emoteStore = transaction.objectStore("emotes");
      const stores: IndexStores = { friendStore, chatStore, emoteStore };
      transaction.onerror = function () {
        rej(transaction.error);
        console.error("Transaction failed", transaction.error);
      };
      res({ stores, transaction });
    };
  });
  try {
    return await promise;
  } catch (err) {
    console.log(err);
    return false;
  }
}
