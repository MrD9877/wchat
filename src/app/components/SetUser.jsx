"use client";
import { setUser } from "@/redux/Slice";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConnectToServer from "./ConnectToServer";
// import { socket } from "@/socket";

export default function SetUser() {
  const dispatch = useDispatch();
  const exceptions = ["/login", "/register", "/verify"];
  const pathname = usePathname();
  const userId = useSelector((state) => state.userId);

  const getUser = async () => {
    try {
      const res = await fetch("/api/auth/getUser");
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        dispatch(setUser({ email: data.email, name: data.name, userId: data.userId }));
        // socket.on("chat message", handleNewMessage);
      }
    } catch {}
  };

  useEffect(() => {
    if (exceptions.includes(pathname)) return;
    getUser();
  }, []);
  if (userId)
    return (
      <div>
        <ConnectToServer room={userId} />
      </div>
    );
}
