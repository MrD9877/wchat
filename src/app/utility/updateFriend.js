export const updateNewFriendInDb = (userId, friendInfo) => {
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

    const findFriend = friendStore.get(userId);

    findFriend.onsuccess = function () {
      const friend = findFriend.result;
      friend.name = friendInfo.name;
      friend.email = friendInfo.email;
      friend.propilePic = friendInfo.profilePic;
      friendStore.put(friend);
    };

    transaction.oncomplete = function () {
      console.log("Transaction completed successfully");
    };

    transaction.onerror = function () {
      console.error("Transaction failed", transaction.error);
    };
  };
};

export const handleNewFriend = async (userId) => {
  try {
    const res = await fetch("/api/getFriend", { method: "POST", body: JSON.stringify({ userId }) });
    if (res.status === 200) {
      const data = await res.json();
      updateNewFriendInDb(userId, data);
    }
  } catch {
    console.log(`${userId} was not updated`);
  }
};
