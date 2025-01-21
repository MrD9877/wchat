"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import peer from "@/app/utility/peer";
// import { socket } from "@/socket";
import { useSelector } from "react-redux";
// import { usePathname } from "next/navigation";
import VideoCallNav from "@/app/components/VideoCallNav";
import { useRouter } from "next/navigation";
import Call from "@/app/components/SetCall";

function VideoCall() {
  const room = useSelector((state) => state.userId);
  const [localStream, setLocalStream] = useState();
  const [callUser, setCallUser] = useState("");
  const [remoteStream, setRemoteStream] = useState();
  const router = useRouter();

  // start stream

  useEffect(() => {
    const startStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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

  return (
    <div className="bg-black text-white h-screen w-screen">
      <Call localStream={localStream} setLocalStream={setLocalStream} remoteStream={remoteStream} setRemoteStream={setRemoteStream} callUser={callUser} setCallUser={setCallUser} />
      <div className="flex w-fit h-fit justify-end items-end">
        {localStream && (
          <div className="absolute px-3 py-10 z-10">
            <ReactPlayer playing={true} muted url={localStream} width="150px" height="250px" />
          </div>
        )}
        {remoteStream ? (
          <div className="z-0 top-0 flex justify-start w-fit max-w-[100vw] overflow-clip  h-fit bg-black">
            <ReactPlayer playing={true} url={remoteStream} height="75vh" />
          </div>
        ) : (
          <div className="z-0 top-0 flex justify-start w-screen h-[75vh] bg-black text-white">No data</div>
        )}
      </div>

      <div className="w-fit mx-auto py-10 z-1 absolute"></div>
      <div className="z-50 absolute  bottom-10 w-screen">
        <VideoCallNav sendStream={sendStream} handleEndCall={handleEndCall} callUser={callUser} room={room} localStream={localStream} />
      </div>
    </div>
  );
}

export default VideoCall;
