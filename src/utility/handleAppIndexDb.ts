"use client";

import { generateRandom } from "@/app/(backend)/utility/random";
import { connectIndexDb, IndexStores } from "./IndexDbConnect";
import { handleNewFriend } from "./updateFriend";
import { areDatesOnSameDay } from "./getFriend";

type StoredChats = {
  audio: string;
  date: Date;
  image: string;
  message: string;
  user: string;
};

type IndexDBChats = {
  chadId: string;
  chats: StoredChats[];
};

type IndexDBFriendsChats = {
  chatId: string;
  date: Date;
};

type IndexDBFriends = {
  userId: string;
  chats: IndexDBFriendsChats[];
  name: string;
  profilePic: string;
  email: string;
};

class HandleIndexDb {
  private stores: IndexStores | null;
  private transaction: IDBTransaction | null;
  constructor() {
    this.stores = null;
    this.transaction = null;
  }
  async intiate() {
    const data = await connectIndexDb();
    if (!data) return false;
    const { stores, transaction } = data;
    this.stores = stores;
    this.transaction = transaction;
  }

  async saveNewMessage(msg: string, userId: string, image?: string, audio?: string) {
    if (!this.stores) return;
    const { friendStore, chatStore } = this.stores;
    const findFriend = friendStore.get(userId);

    findFriend.onsuccess = async () => {
      const date = new Date();
      const friend = findFriend.result;
      if (!friend) {
        await this.saveMsgInNewFriend(msg, userId, image, audio);
      } else {
        const allChats = friend.chats;
        const lastChatDate = allChats[allChats.length - 1].date;
        const sameDay = areDatesOnSameDay(lastChatDate, date);
        if (sameDay) {
          const findChat = chatStore.get(allChats[allChats.length - 1].chatId);
          findChat.onsuccess = function () {
            const chats = findChat.result;
            const allChats = chats.chats;
            allChats.push({ date, message: msg, user: userId, image, audio });
            findChat.result.chats = [...allChats];
            chatStore.put(findChat.result);
            findFriend.result.lastMessage = { message: msg, date };
            friendStore.put(findFriend.result);
          };
        } else {
          const chatId = await this.saveChat(msg, userId, image, audio);
          friend.chats.push({ chatId, date: date });
          findFriend.result.chats = [...friend.chats];
          findFriend.result.lastMessage = { message: msg, date };
          friendStore.put(findFriend.result);
        }
      }
    };
  }
  async saveMsgInNewFriend(msg: string, userId: string, image?: string, audio?: string) {
    if (!this.stores) return;
    const { friendStore, chatStore } = this.stores;
    const date = new Date();
    const chatId = await this.saveChat(msg, userId, image, audio);
    friendStore.put({ userId, chats: [{ chatId, date }], lastMessage: { message: audio ? "audio" : msg, date } });
    handleNewFriend(userId);
  }
  async saveChat(msg: string, userId: string, image?: string, audio?: string) {
    if (!this.stores) return;
    const date = new Date();
    const { chatStore } = this.stores;
    const chatId = generateRandom(32);
    chatStore.put({ chatId, chats: [{ date, message: msg, user: userId, image, audio }] });
    return chatId;
  }
}

const localDB = new HandleIndexDb();
await localDB.intiate();
export default localDB;
