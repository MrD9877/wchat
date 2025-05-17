import { generateRandom } from "../app/(backend)/utility/random";
import { areDatesOnSameDay } from "./getFriend";
import { connectIndexDb } from "./IndexDbConnect";

export const handleIndexDb = async (msg: string | undefined, room: string, image: string | string[] | null | undefined, userId: string, audio: Buffer[] | null | undefined) => {
  const data = await connectIndexDb();
  if (!data) return null;

  const { stores } = data;

  const friendStore = stores.friendStore;
  const chatStore = stores.chatStore;
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
};
