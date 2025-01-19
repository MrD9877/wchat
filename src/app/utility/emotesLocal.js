import { onError, onUpgrade } from "./indexDbFunctions";

export const updateEmotes = (group, array) => {
  const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
  }
  const request = indexedDB.open("wchat", 1);

  request.onerror = onError;
  request.onupgradeneeded = onUpgrade;

  request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction(["emotes"], "readwrite");
    const store = transaction.objectStore("emotes");

    store.put({ groupName: group, emotesArray: array });

    transaction.oncomplete = function () {
      console.log("Transaction completed successfully");
    };

    transaction.onerror = function () {
      console.error("Transaction failed", transaction.error);
    };
  };
};

export const getEmoteByGroup = (group, resolve, reject) => {
  const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
  }
  // 2
  const request = indexedDB.open("wchat", 1);
  request.onerror = function onError(event) {
    reject();
  };
  request.onupgradeneeded = onUpgrade;
  let data;

  request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("emotes", "readwrite");
    const store = transaction.objectStore("emotes");
    const findGroup = store.get(group);

    findGroup.onsuccess = function () {
      const emotes = findGroup.result;
      if (!emotes) reject();
      data = structuredClone(emotes.emotesArray);
    };

    transaction.oncomplete = function () {
      console.log("Transaction completed successfully");
      resolve(data);
    };

    transaction.onerror = function () {
      reject();
      console.error("Transaction failed", transaction.error);
    };
  };
};
