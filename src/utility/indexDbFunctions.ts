export function onUpgrade(event: IDBVersionChangeEvent) {
  const db = (event.target as IDBOpenDBRequest).result;
  const emotes = db.createObjectStore("emotes", { keyPath: "groupName" });
  const friends = db.createObjectStore("friends", { keyPath: "userId" });
  const chats = db.createObjectStore("chats", { keyPath: "chatId" });
}

export function onError(event: IDBVersionChangeEvent) {
  console.error("An error occurred with IndexedDB");
  console.error(event);
}
