"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import peer from "@/utility/peer";
import { useSelector } from "react-redux";
import VideoCallNav from "@/components/VideoCallNav";
import { useRouter } from "next/navigation";
import Call from "@/components/SetCall";

function VoiceCall() {
  const room = useSelector((state) => state.userId);
  const [localStream, setLocalStream] = useState();
  const [callUser, setCallUser] = useState("");
  const [remoteStream, setRemoteStream] = useState();
  const router = useRouter();
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  // start stream

  useEffect(() => {
    const startStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
    };
    startStream();
  }, []);

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

  useEffect(() => {
    if (localStream && localAudioRef.current) {
      localAudioRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="bg-black text-white h-screen w-screen">
      <Call localStream={localStream} setLocalStream={setLocalStream} remoteStream={remoteStream} setRemoteStream={setRemoteStream} callUser={callUser} setCallUser={setCallUser} />
      <div className="flex w-fit h-fit justify-end items-end bg-white">
        {localStream && <audio autoPlay muted ref={localAudioRef} />}

        {/* Remote audio stream */}
        {remoteStream && <audio autoPlay ref={remoteAudioRef} />}
      </div>

      <div className="w-fit mx-auto py-10 z-1 absolute"></div>
      <div className="z-50 absolute  bottom-10 w-screen">
        <VideoCallNav sendStream={sendStream} handleEndCall={handleEndCall} callUser={callUser} room={room} localStream={localStream} />
      </div>
    </div>
  );
}

export default VoiceCall;
