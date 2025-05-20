import { connectIndexDb } from "./IndexDbConnect";
import { FriendUpdate, SavedDbFriends, saveFriends, updateFriendsInDb } from "./saveAndRetrievedb";

export type FriendInfo = { name: string; email: string; profilePic: string; userId: string; newMessages: number; lastMessage: { message: string; date: Date } };

export const updateNewFriendInDb = async (userId: string, friendInfo: FriendInfo) => {
  const data = await connectIndexDb();
  if (!data) return;
  const { stores } = data;
  const friendStore = stores.friendStore;

  const findFriend = friendStore.get(userId);
  findFriend.onsuccess = function () {
    const friend = findFriend.result;
    friend.name = friendInfo.name;
    friend.email = friendInfo.email;
    friend.propilePic = friendInfo.profilePic;
    friendStore.put(friend);
  };
};

export const handleNewFriend = async (userId: string) => {
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

export const handleUpdateDb = async (userId: string, clientId: string | undefined) => {
  if (!clientId) return;
  try {
    const res = await fetch("/api/auth/userFriends", { method: "POST", body: JSON.stringify({ userId }) });
    if (res.status === 200) {
      const data: SavedDbFriends = await res.json();
      data["lastMessageDate"] = 2;
      await saveFriends(clientId, data);
    }
  } catch (err) {
    console.log(err);
  }
};
export const updateFriend = async ({ clientId, userId, image, message, audio }: { clientId: string; userId: string; image?: string | string[]; message?: string; audio?: Blob[] }) => {
  const type = image ? "image" : message ? "message" : audio && "audio";
  if (!type) return;
  const updates: FriendUpdate[] = [];
  updates.push({ key: "lastMessage", value: type === "message" ? message || type : type });
  updates.push({ key: "lastMessageDate", value: Date.now() });
  try {
    await updateFriendsInDb(clientId, { userId, update: updates });
  } catch {}
};
