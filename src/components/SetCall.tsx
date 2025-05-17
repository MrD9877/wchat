"use client";
import React, { useCallback, useEffect } from "react";
import peer from "@/utility/peer";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { UserState } from "@/redux/Slice";

interface Call {
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  callUser: string;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  setCallUser: React.Dispatch<React.SetStateAction<string>>;
}

export default function Call({ localStream, setLocalStream, remoteStream, setRemoteStream, callUser, setCallUser }: Call) {
  const pathname = usePathname();
  const room = useSelector((state: UserState) => state.userId);
  const inComingCall = useSelector((state: UserState) => state.inComingCall);
  const router = useRouter();

  // start stream

  // stopSteam
  const stopMediaStream = (stream: MediaStream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop(); // Stop each track (audio/video)
      });
    }
  };
  //   send stream
  const sendStream = async () => {
    try {
      if (!localStream || !peer.peer) return;
      for (const track of localStream.getTracks()) {
        if (peer.peer) peer.peer.addTrack(track, localStream);
      }
    } catch {}
  };

  //   ending the call

  const handleEndCall = () => {
    if (localStream) stopMediaStream(localStream);
    if (remoteStream) stopMediaStream(remoteStream);
    setLocalStream(undefined);
    setRemoteStream(undefined);
    peer.closeConnection();
    router.back();
  };
  //  if call is accepted
  const acceptCall = useCallback(async () => {
    if (!inComingCall) return;
    const ans = await peer.getAnswer(inComingCall.offer);
    socket.emit("call:accepted", { to: inComingCall.from, answer: ans, from: room });
  }, [room, inComingCall]);

  //   if call request accepted

  const handleCallAccept = async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
    await peer.setLocalDescription(answer);
    await sendStream();
  };

  //   negotiations

  const handleNegotiation = async (e: Event) => {
    const offer = await peer.getOffer();
    socket.emit("peer:negotiation", { from: room, to: callUser, offer });
  };

  const handleNegotiationOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:negotiation:done", { to: callUser, from: room, answer: ans });
  };

  const handleNegotiationDone = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
    await peer.setLocalDescription(answer);
    socket.emit("request:after:course", { from: room, to: callUser });
  };

  //   setTrack

  const handleTrackReceived = async (e: RTCTrackEvent) => {
    const remoteStrea = e.streams;
    setRemoteStream(remoteStrea[0]);
  };

  //   set room

  useEffect(() => {
    const id = pathname.split("/");
    const room = id[id.length - 1];
    setCallUser(room);
  }, [pathname]);

  //   if you are reciver of call and accept

  useEffect(() => {
    if (inComingCall) {
      acceptCall();
    }
  }, [inComingCall, room, acceptCall]);

  //   make sure strem is sent
  useEffect(() => {
    sendStream();
    socket.emit("requestStream", { from: room, to: callUser });
  }, [peer.peer, callUser, room, localStream, remoteStream]);

  useEffect(() => {
    if (peer.peer) {
      peer.peer.addEventListener("track", handleTrackReceived);
      peer.peer.addEventListener("negotiationneeded", handleNegotiation);
    }
    return () => {
      if (peer.peer) {
        peer.peer.removeEventListener("track", handleTrackReceived);
        peer.peer.removeEventListener("negotiationneeded", handleNegotiation);
      }
    };
  }, [callUser, room, inComingCall, localStream, remoteStream, peer.peer]);

  useEffect(() => {
    socket.on("callRequest:accepted", handleCallAccept);
    socket.on("peer:negotiation", handleNegotiationOffer);
    socket.on("peer:negotiation:done", handleNegotiationDone);
    socket.on("closeCall", handleEndCall);
    socket.on("requestStream", sendStream);

    return () => {
      socket.off("callRequest:accepted", handleCallAccept);
      socket.off("peer:negotiation", handleNegotiationOffer);
      socket.off("peer:negotiation:done", handleNegotiationDone);
      socket.off("closeCall", handleEndCall);
      socket.off("requestStream", sendStream);
    };
  }, [callUser, room, inComingCall, localStream, remoteStream, peer.peer]);
  return [];
}
