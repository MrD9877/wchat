import { socket } from "@/socket";
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
type LocalMedia = readonly [MediaStream | undefined, React.RefObject<HTMLVideoElement | null>, React.Dispatch<React.SetStateAction<MediaStream | undefined>>, React.RefObject<RTCPeerConnection | null>];
type RemoteMedia = readonly [React.RefObject<HTMLVideoElement | null>, React.Dispatch<React.SetStateAction<MediaStream | undefined>>, MediaStream | undefined];
type EndCallHook = {
  localMedia: LocalMedia;
  remoteMedia: RemoteMedia;
};

export default function useEndCall({ localMedia, remoteMedia }: EndCallHook) {
  const [remoteVideo, setRemoteStream, remoteStream] = remoteMedia;
  const [localStream, localVideo, setLocalStream, peerConnection] = localMedia;
  const router = useRouter();

  const stopMediaStream = (stream: MediaStream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log(track);
        track.stop(); // Stop each track (audio/video)
      });
    }
  };
  const closeConnection = useCallback(() => {
    const peer = peerConnection.current;
    if (!peer) return;
    peer.ontrack = null;
    peer.onicecandidate = null;
    peer.onconnectionstatechange = null;
    peer.close();
    if (localVideo.current) localVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;

    peer.getSenders().forEach((sender) => {
      const track = sender.track;
      if (track) {
        track.stop();
      }
    });
    peerConnection.current = null;
  }, [peerConnection, localVideo, remoteVideo]);

  const handleEndCall = useCallback(() => {
    if (localStream) stopMediaStream(localStream);
    if (remoteStream) stopMediaStream(remoteStream);
    setLocalStream(undefined);
    setRemoteStream(undefined);
    closeConnection();
    router.back();
  }, [router, localStream, remoteStream, setLocalStream, setRemoteStream, closeConnection]);

  useEffect(() => {
    socket.on("closeCall", handleEndCall);
    return () => {
      socket.off("closeCall", handleEndCall);
    };
  }, [handleEndCall]);
  return [handleEndCall];
}
