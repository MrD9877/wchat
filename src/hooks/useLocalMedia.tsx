import { UserState } from "@/redux/Slice";
import { socket } from "@/socket";
import { getCookie } from "@/utility/getCookie";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
};
const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:your.turn.server:3478",
      username: "user",
      credential: "pass",
    },
  ],
};

const onComplete = (peer: RTCPeerConnection, ev: RTCPeerConnectionIceEvent, room: string, stream: MediaStream) => {
  console.log(peer.iceGatheringState);
  if (peer.iceGatheringState === "complete") {
    const accessToken = getCookie("accessToken");
    console.log(ev.candidate);
    socket.emit("iceCandidate", { iceCandidate: JSON.stringify(ev.candidate), to: room, accessToken });
  }
};

const sendMedia = async (stream: MediaStream, peer: RTCPeerConnection) => {
  stream.getTracks().forEach((track) => {
    peer.addTrack(track, stream);
  });
};

export default function useLocalMedia(setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>, callUser: string | null) {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const localVideo = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection>(null);

  const startMedia = async () => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
  };

  useEffect(() => {
    if (localVideo && localStream && localVideo.current) {
      localVideo.current.srcObject = localStream;
    }
  }, [localStream, localVideo]);

  useEffect(() => {
    startMedia();
  }, []);

  const peerConnectionFn = async (localStream: MediaStream, callUser: string) => {
    peerConnection.current = new RTCPeerConnection(configuration);
    const peer = peerConnection.current;
    sendMedia(localStream, peer);
    peer.ontrack = (ev) => {
      setRemoteStream(ev.streams[0]);
    };
    console.log(peer.iceGatheringState);
    peer.oniceconnectionstatechange = () => {
      if (peer.connectionState === "disconnected" || peer.connectionState === "failed") {
        peer.restartIce(); // This restarts ICE without renegotiation
      }
      console.log("ice:", peer.iceConnectionState);
    };
    peer.onconnectionstatechange = () => {
      console.log("state:", peer.connectionState);
    };

    peer.onicecandidate = (ev) => {
      onComplete(peer, ev as RTCPeerConnectionIceEvent, callUser, localStream);
    };
  };

  useEffect(() => {
    if (!localStream || !callUser) return;
    console.log(2);
    peerConnectionFn(localStream, callUser);
    return () => {
      if (peerConnection.current) {
        peerConnection.current.getSenders().forEach((sender) => {
          const track = sender.track;
          if (track) {
            track.stop();
          }
        });
        peerConnection.current.close();
      }
      peerConnection.current = null;
    };
  }, [localStream, callUser]);

  return [localStream, localVideo, setLocalStream, peerConnection] as const;
}
