import { useEffect, useRef, useState } from "react";

// type RemoteMediaHook = { peerConnection: React.RefObject<RTCPeerConnection | null> };

export default function useRemoteMedia() {
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const remoteVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteVideo && remoteStream && remoteVideo.current) {
      remoteVideo.current.srcObject = remoteStream;
    }
  }, [remoteVideo, remoteStream]);

  return [remoteVideo, setRemoteStream, remoteStream] as const;
}
