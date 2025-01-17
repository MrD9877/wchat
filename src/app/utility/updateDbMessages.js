import { generateRandom } from "../(backend)/utility/random";
import { getDate } from "./convertTime";

const updateDb = (userId, val, data) => {
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

  request.onupgradeneeded = function () {
    const db = request.result;
    const friends = db.createObjectStore("friends", { keyPath: "userId" });
    const chats = db.createObjectStore("chats", { keyPath: "chatId" });
  };

  request.onsuccess = function () {
    console.log("Database opened successfully");
    const db = request.result;
    // 1
    const transaction = db.transaction(["friends", "chats"], "readwrite");
    //2
    const friendStore = transaction.objectStore("friends");
    const chatStore = transaction.objectStore("chats");

    const findFriend = friendStore.get(userId);

    findFriend.onsuccess = function () {
      const friend = findFriend.result;
      friend.lastMessage = { ...val.lastMessage };
      friend.newMessages = val.newMessages;
      let chatIdWithSameDay;
      friend.chats.forEach((chat) => {
        if (getDate(chat.date) === getDate(data.date)) {
          return (chatIdWithSameDay = chat.chatId);
        }
      });
      if (chatIdWithSameDay) {
        const findChat = chatStore.get(chatIdWithSameDay);
        findChat.onsuccess = function () {
          const chat = findChat.result;
          chat.chats = [...chat.chats, ...data.chat];
          chatStore.put(chat);
        };
      } else {
        const chatId = generateRandom(32);
        const newChat = {
          chatId: chatId,
          chats: [...data.chat],
          date: data.date,
        };
        friend.chats.push({ chatId: chatId, date: data.date });
        chatStore.put(newChat);
      }
      friendStore.put(friend);
    };

    transaction.oncomplete = function () {
      fetch("/api/auth/clearChat", { method: "POST", body: JSON.stringify({ chatId: val.chatId }) });
      console.log("Transaction completed successfully");
    };

    transaction.onerror = function () {
      console.error("Transaction failed", transaction.error);
    };
  };
};

export const updateFriend = async (userId, val) => {
  try {
    const res = await fetch("/api/auth/getChat", { method: "POST", body: JSON.stringify({ chatId: val.chatId }) });
    if (res.status === 200) {
      const { chats } = await res.json();
      chats.chats.forEach((chat) => {
        updateDb(userId, val, chat);
      });
    }
  } catch {}
};

export async function setOfflineMessages(chats) {
  for (const [userId, val] of Object.entries(chats)) {
    await updateFriend(userId, val);
    fetch("api/auth/clearChat", { method: "POST", body: JSON.stringify({ userId }) });
  }
  //   Object.entries(chats).forEach(([userId, val]) => {
  //    await updateFriend(userId, val);
  //   });
}
