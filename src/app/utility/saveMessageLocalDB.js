import { generateRandom } from "../(backend)/utility/random";
import { areDatesOnSameDay } from "./getFriend";
import { onUpgrade } from "./indexDbFunctions";

export const handleIndexDb = (msg, room, image, userId, audio) => {
  const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
  }
  // 2
  const request = indexedDB.open("wchat", 1);
  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };

  request.onupgradeneeded = onUpgrade;

  request.onsuccess = function () {
    console.log("Database opened successfully");
    const db = request.result;
    // 1
    const transaction = db.transaction(["friends", "chats"], "readwrite");
    //2
    const friendStore = transaction.objectStore("friends");
    const chatStore = transaction.objectStore("chats");
    const findFriend = friendStore.get(room);

    // 5
    findFriend.onsuccess = function () {
      const friend = findFriend.result;
      const chatId = generateRandom(32);
      const date = new Date();
      const messageToSave = { date, message: msg, user: userId, image, audio };
      if (!friend) {
        const chat = { chatId: chatId, date: date };
        friendStore.put({ userId: room, chats: [{ ...chat }] });
        chatStore.put({ chatId, chats: [{ ...messageToSave }] });
      } else {
        const allChats = friend.chats;
        const lastChatDate = allChats[allChats.length - 1].date;
        const sameDay = areDatesOnSameDay(lastChatDate, date);
        if (sameDay) {
          const findChat = chatStore.get(allChats[allChats.length - 1].chatId);
          findChat.onsuccess = function () {
            const chats = findChat.result;
            const allChats = chats.chats;
            allChats.push({ ...messageToSave });
            findChat.result.chats = [...allChats];
            chatStore.put(findChat.result);
          };
        } else {
          const chat = { chatId: chatId, date: date };
          friend.chats.push(chat);
          findFriend.result.chats = [...friend.chats];
          friendStore.put(findFriend.result);
          chatStore.put({ chatId, chats: [{ ...messageToSave }] });
        }
      }
    };
    transaction.oncomplete = function () {
      console.log("Transaction completed successfully");
    };

    transaction.onerror = function () {
      console.error("Transaction failed", transaction.error);
    };
  };
};
