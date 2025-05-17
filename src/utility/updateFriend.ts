import { connectIndexDb } from "./IndexDbConnect";

export type FriendInfo = { name: string; email: string; profilePic: string; userId: string; newMessages: number; lastMessage: { message: string; date: Date } };

export const updateNewFriendInDb = async (userId: string, friendInfo: FriendInfo) => {
  const data = await connectIndexDb();
  if (!data) return;
  const { stores, transaction } = data;
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
