import { useEffect, useRef, useState } from "react";

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

export default function useLocalMedia(setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>) {
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

  const peerConnectionFn = async () => {
    peerConnection.current = new RTCPeerConnection(configuration);
    const peer = peerConnection.current;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream);
      });
    }
    peer.ontrack = (ev) => {
      setRemoteStream(ev.streams[0]);
    };
  };

  useEffect(() => {
    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        const track = sender.track;
        if (track) {
          track.stop();
        }
      });
    }
    peerConnectionFn();
  }, [localStream]);

  return [localStream, localVideo, setLocalStream, peerConnection] as const;
}
