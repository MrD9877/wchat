import { FriendRequest } from "@/app/(backend)/model/User";
import { UserState } from "@/redux/Slice";
import { Base64ToPublicKey } from "@/utility/Encription";
import { SavedDbFriends, saveFriend } from "@/utility/saveAndRetrievedb";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
export type FriendInfo = { name: string; email: string; profilePic: string; userId: string; publicKey: CryptoKey };
export type FriendInfoFromServer = Omit<SavedDbFriends, "publicKey"> & { publicKey: string };

export default function useFriendAndRequests(page: string) {
  const [request, setRequest] = useState<FriendRequest[]>();
  const [friends, setFriends] = useState<FriendInfo[]>();
  const [isPending, setPending] = useState<{ [userEmail: string]: boolean | undefined }>({});
  const clientId = useSelector((state: UserState) => state.userId);

  const getData = async () => {
    try {
      const res = await fetch("/api/auth/userFriends", { method: "GET" });
      if (res.status === 200) {
        const { requests, friends } = await res.json();
        setRequest(requests);
        setFriends(friends);
      }
    } catch {}
  };

  const handleAcceptRequest = async (email: string, index: number) => {
    setPending((pre) => ({ ...pre, [email]: true }));
    if (!clientId) return;
    try {
      const res = await fetch("/api/auth/acceptfriendrequest", { method: "POST", body: JSON.stringify({ email }) });
      if (!res.ok) throw Error(res.statusText);

      const data: FriendInfoFromServer = await res.json();
      data["lastMessageDate"] = 2;
      const publicKey = await Base64ToPublicKey(data.publicKey);
      await saveFriend(clientId, { ...data, publicKey });

      setRequest((pre) => {
        if (!pre) return;
        let temp = [...pre];
        temp.splice(index, 1);
        return temp;
      });

      toast(`${email} added as friend`);
    } catch (err) {
      if (err instanceof Error) {
        toast(err.message);
      } else {
        toast("somthing went wrong try again!!");
      }
    } finally {
      setPending((pre) => ({ ...pre, [email]: undefined }));
    }
  };

  useEffect(() => {
    getData();
  }, [page]);
  return { request, friends, isPending, handleAcceptRequest } as const;
}
