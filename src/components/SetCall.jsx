"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import peer from "@/utility/peer";
import { socket } from "@/socket";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import VideoCallNav from "@/components/VideoCallNav";
import { useRouter } from "next/navigation";

function Call({ localStream, setLocalStream, remoteStream, setRemoteStream, callUser, setCallUser }) {
  const pathname = usePathname();
  const room = useSelector((state) => state.userId);
  const inComingCall = useSelector((state) => state.inComingCall);
  const router = useRouter();

  // start stream

  // stopSteam
  const stopMediaStream = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop(); // Stop each track (audio/video)
      });
    }
  };
  //   send stream
  const sendStream = async () => {
    try {
      for (const track of localStream.getTracks()) {
        peer.peer.addTrack(track, localStream);
      }
    } catch {}
  };

  //   ending the call

  const handleEndCall = () => {
    stopMediaStream(localStream);
    stopMediaStream(remoteStream);
    setLocalStream(null);
    setRemoteStream(null);
    peer.closeConnection();
    router.back();
  };
  //  if call is accepted
  const acceptCall = useCallback(async () => {
    const ans = await peer.getAnswer(inComingCall.offer);
    socket.emit("call:accepted", { to: inComingCall.from, answer: ans, from: room });
  }, [room, inComingCall]);

  //   if call request accepted

  const handleCallAccept = async ({ answer, from }) => {
    await peer.setLocalDescription(answer);
    await sendStream();
  };

  //   negotiations

  const handleNegotiation = async (e) => {
    const offer = await peer.getOffer();
    socket.emit("peer:negotiation", { from: room, to: callUser, offer });
  };

  const handleNegotiationOffer = async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:negotiation:done", { to: callUser, from: room, answer: ans });
  };
  const handleNegotiationDone = async ({ from, answer }) => {
    await peer.setLocalDescription(answer);
    socket.emit("request:after:course", { from: room, to: callUser });
  };

  //   setTrack

  const handleTrackReceived = async (e) => {
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
  return <></>;
}

export default Call;
