"use client";
import { setUser, setIncomingCall } from "@/redux/Slice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConnectToServer from "./ConnectToServer";
import { setOfflineMessages } from "../utility/updateDbMessages";
import { socket } from "@/socket";
import peer from "@/app/utility/peer";
import CallRequestPage from "./CallRequestPage";
import useNetworkStatus from "./NetworkStatus";

export default function SetUser() {
  const dispatch = useDispatch();
  const exceptions = ["/login", "/register", "/verify"];
  const pathname = usePathname();
  const userId = useSelector((state) => state.userId);
  const inComingCall = useSelector((state) => state.inComingCall);
  const router = useRouter();
  const [calling, setCalling] = useState(false);
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (isOnline) {
      console.log("User is back online");
    }
  }, [isOnline]);

  const rejectCall = () => {
    socket.emit("closeCall", { from: userId, to: inComingCall.from });
    dispatch(setIncomingCall({ inComingCall: null }));
    setCalling(false);
  };

  const acceptCall = async () => {
    if (!peer.peer) {
      peer.closeConnection();
      await peer.initializePeerConnection();
    }
    setCalling(false);
    if (inComingCall.type == "video") {
      router.push(`/videoCall/${inComingCall.from}`);
    }
    if (inComingCall.type == "voice") {
      router.push(`/VoiceCall/${inComingCall.from}`);
    }
  };

  const handleCallRequest = async ({ offer, from, name, type }) => {
    setIncomingCall({ offer, from });
    dispatch(setIncomingCall({ inComingCall: { offer, from, name, type } }));
  };

  const getUser = async () => {
    try {
      const res = await fetch("/api/auth/getUser");
      if (res.status === 200) {
        const data = await res.json();
        dispatch(setUser({ email: data.email, name: data.name, userId: data.userId }));
        await setOfflineMessages(data.chatPages);
      }
    } catch {}
  };

  const handleCallRequestClosed = ({ from }) => {
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
    if (exceptions.includes(pathname)) return;
    getUser();
    socket.on("requestCall", handleCallRequest);
    socket.on("closeCall", handleCallRequestClosed);

    return () => {
      socket.off("requestCall", handleCallRequest);
      socket.off("closeCall", handleCallRequestClosed);
    };
  }, [inComingCall]);
  if (userId)
    return (
      <div>
        <ConnectToServer room={userId} />
        {calling && (
          <>
            <CallRequestPage acceptCall={acceptCall} rejectCall={rejectCall} inComingCall={inComingCall} />
          </>
        )}
      </div>
    );
}
