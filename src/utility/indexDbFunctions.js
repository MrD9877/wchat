export function onUpgrade(event) {
  const db = event.target.result;
  const emotes = db.createObjectStore("emotes", { keyPath: "groupName" });
  const friends = db.createObjectStore("friends", { keyPath: "userId" });
  const chats = db.createObjectStore("chats", { keyPath: "chatId" });
}

export function onError(event) {
  console.error("An error occurred with IndexedDB");
  console.error(event);
}
