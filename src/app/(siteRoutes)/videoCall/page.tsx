"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCallNav from "@/components/VideoCallNav";
import { useSearchParams } from "next/navigation";
import { UserState } from "@/redux/Slice";
import useLocalMedia from "@/hooks/useLocalMedia";
import useRemoteMedia from "@/hooks/useRemoteMedia";
import useGenerateOffer from "@/hooks/useGenerateOffer";
import { socket } from "@/socket";
import useEndCall from "@/hooks/useEndCall";

function VideoCall() {
  const userId = useSelector((state: UserState) => state.userId);
  const inComingCall = useSelector((state: UserState) => state.inComingCall);

  const query = useSearchParams();
  const callUser = query.get("room");

  const [isMuted, setIsMuted] = useState(false);

  const remoteMedia = useRemoteMedia();
  const [remoteVideo, setRemoteStream, remoteStream] = remoteMedia;

  const localMedia = useLocalMedia(setRemoteStream, callUser);
  const [localStream, localVideo, setLocalStream, peerConnection] = localMedia;

  const [generateOffer, generateAnswer, addAnswer] = useGenerateOffer();

  const [handleEndCall] = useEndCall({ localMedia, remoteMedia });

  useEffect(() => {
    if (!peerConnection.current) return;
    const handlerOffer = async (msg: { offer: string; from: string }) => {
      await generateAnswer({ peerConnection, room: msg.from }, msg.offer);
    };
    const handlerAnswer = async (msg: { answer: string }) => {
      await addAnswer(msg.answer, peerConnection);
    };

    const handleIceCandidate = async (msg: { iceCandidate: string }) => {
      console.log("here");
      console.log(msg);
      if (!peerConnection.current) return;
      const candidate = (await JSON.parse(msg.iceCandidate)) as RTCIceCandidateInit;
      if (candidate && candidate.candidate && candidate.sdpMid !== null && candidate.sdpMLineIndex !== null) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on("offer", handlerOffer);
    socket.on("answer", handlerAnswer);
    socket.on("iceCandidate", handleIceCandidate);

    return () => {
      socket.off("offer", handlerOffer);
      socket.off("answer", handlerAnswer);
      socket.off("iceCandidate", handleIceCandidate);
    };
  }, [peerConnection.current]);

  useEffect(() => {
    if (inComingCall && localStream && peerConnection.current) {
      (async () => {
        const wait = new Promise((res, rej) => setTimeout(res, 1000));
        await wait;
        await generateOffer({ peerConnection, room: inComingCall.from });
      })();
    }
  }, [inComingCall, localStream, peerConnection]);

  return (
    <>
      <div className="bg-black text-white h-screen w-screen">
        <div className="flex w-fit h-fit justify-end items-end">
          {localStream && (
            <div className="absolute px-3 py-10 z-10 w-full h-fit top-0 flex justify-end">
              <video ref={localVideo} autoPlay muted width="50px" height="50px" />
            </div>
          )}
          {remoteStream ? (
            <div className="z-0 top-0 flex justify-start w-fit max-w-[100vw] items-center overflow-clip  h-fit bg-black">
              <video ref={remoteVideo} autoPlay height="150px" width="150px" />
            </div>
          ) : (
            <div className="z-0 top-0 flex justify-start w-screen h-[75vh] bg-black text-white">No data</div>
          )}
        </div>

        <div className="w-fit mx-auto py-10 z-1 absolute"></div>
        <div className="z-50 absolute  bottom-10 w-screen">
          <VideoCallNav handleEndCall={handleEndCall} callUser={callUser} room={userId} isMuted={isMuted} setIsMuted={setIsMuted} />
        </div>
      </div>
    </>
  );
}

export default VideoCall;
