import { FriendRequest } from "@/app/(backend)/model/User";
import { Users } from "@/components/SearchBar";
import { FriendInfo } from "@/utility/updateFriend";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useFriendAndRequests(page: string) {
  const [request, setRequest] = useState<FriendRequest[]>();
  const [friends, setFriends] = useState<Omit<FriendInfo, "newMessages" | "lastMessage">[]>();
  const [isPending, setPending] = useState<{ [userEmail: string]: boolean | undefined }>({});

  const getData = async () => {
    try {
      const res = await fetch("/api/auth/userFriends", { method: "GET" });
      if (res.status === 200) {
        const { requests, friends } = await res.json();
        console.log(friends);
        setRequest(requests);
        setFriends(friends);
      }
    } catch {}
  };
  const handleSendRequest = async (email: string, index: number) => {
    setPending((pre) => ({ ...pre, [email]: true }));
    try {
      const res = await fetch("/api/auth/acceptfriendrequest", { method: "POST", body: JSON.stringify({ email }) });
      if (res.status === 200) {
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
  return { request, friends, isPending, handleSendRequest } as const;
}
