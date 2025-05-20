import { FriendRequest } from "@/app/(backend)/model/User";
import { UserState } from "@/redux/Slice";
import { FriendInfo, handleUpdateDb } from "@/utility/updateFriend";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function useFriendAndRequests(page: string) {
  const [request, setRequest] = useState<FriendRequest[]>();
  const [friends, setFriends] = useState<Omit<FriendInfo, "newMessages" | "lastMessage">[]>();
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
  const handleAcceptRequest = async (email: string, index: number, userId: string) => {
    setPending((pre) => ({ ...pre, [email]: true }));
    try {
      const res = await fetch("/api/auth/acceptfriendrequest", { method: "POST", body: JSON.stringify({ email }) });
      if (res.status === 200) {
        await handleUpdateDb(userId, clientId);
        setRequest((pre) => {
          if (!pre) return;
          let temp = [...pre];
          temp.splice(index, 1);
          return temp;
        });
      } else if (res.status === 404) {
        toast(404);
      } else {
        const { msg } = await res.json();
        toast(msg);
      }
      setPending((pre) => ({ ...pre, [email]: undefined }));
    } catch {
      setPending((pre) => ({ ...pre, [email]: undefined }));
    }
  };

  useEffect(() => {
    getData();
  }, [page]);
  return { request, friends, isPending, handleAcceptRequest } as const;
}
