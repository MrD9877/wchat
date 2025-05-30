"use client";
import { setUser, setIncomingCall, UserState } from "@/redux/Slice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "@/socket";
import CallRequestPage from "./CallRequestPage";
import { Usertype } from "@/app/(backend)/model/User";
import ServiceWorkerClass from "@/utility/ServiceWorker";
import useConnectToServer from "../hooks/useConnectToServer";
import useGetMessages from "@/hooks/useGetMessages";
import useInAppNotification from "./InAppNotification";

export default function SetUser() {
  const dispatch = useDispatch();
  const exceptions = ["/login", "/register", "/verify"];
  const pathname = usePathname();
  const userId = useSelector((state: UserState) => state.userId);
  const inComingCall = useSelector((state: UserState) => state.inComingCall);
  const router = useRouter();
  const [calling, setCalling] = useState(false);
  const voids = useConnectToServer(userId);
  const voids2 = useGetMessages(userId);
  const n = useInAppNotification();

  const setOfflineMessages = async () => {
    try {
      // const res = await fetch("/api/auth");
    } catch {}
  };

  const rejectCall = () => {
    if (inComingCall) socket.emit("closeCall", { from: userId, to: inComingCall.from });
    dispatch(setIncomingCall({ inComingCall: null }));
    setCalling(false);
  };

  const acceptCall = async () => {
    setCalling(false);
    if (inComingCall && inComingCall.type == "video") {
      router.push(`/videoCall?room=${inComingCall.from}`);
    }
  };

  const handleCallRequest = async ({ offer, from, name, type }: { offer: RTCSessionDescriptionInit; from: string; name: string; type: "voice" | "video" }) => {
    // setIncomingCall({ offer, from });
    dispatch(setIncomingCall({ inComingCall: { from, name, type } }));
  };

  const getUser = async () => {
    try {
      const res = await fetch("/api/auth/getUser");
      if (res.status === 200) {
        const data: Usertype = await res.json();
        dispatch(setUser({ email: data.email, name: data.name, userId: data.userId, profilePic: data.profilePic }));
        setOfflineMessages();
      }
    } catch {}
  };

  const handleCallRequestClosed = ({ from }: { from: string }) => {
    if (!inComingCall) return;
    if (from === inComingCall.from) {
      dispatch(setIncomingCall({ inComingCall: null }));
      setCalling(false);
    }
  };

  useEffect(() => {
    if (inComingCall) {
      setCalling(true);
    }
  }, [inComingCall]);

  useEffect(() => {
    socket.on("requestCall", handleCallRequest);
    socket.on("closeCall", handleCallRequestClosed);

    return () => {
      socket.off("requestCall", handleCallRequest);
      socket.off("closeCall", handleCallRequestClosed);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inComingCall]);

  useEffect(() => {
    if (exceptions.includes(pathname)) return;
    getUser();
    ServiceWorkerClass.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (userId)
    return (
      <div>
        {calling && (
          <>
            <CallRequestPage acceptCall={acceptCall} rejectCall={rejectCall} inComingCall={inComingCall} />
          </>
        )}
      </div>
    );
}
