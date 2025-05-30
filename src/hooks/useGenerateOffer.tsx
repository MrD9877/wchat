import { UserState } from "@/redux/Slice";
import { socket } from "@/socket";
import { useSelector } from "react-redux";

type GenerateOffer = {
  peerConnection: React.RefObject<RTCPeerConnection | null>;
  room: string | null;
};

export default function useGenerateOffer() {
  const userId = useSelector((state: UserState) => state.userId);
  const generateOffer = async ({ peerConnection, room }: GenerateOffer) => {
    const peer = peerConnection.current;
    if (!peer) return;

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    const waitForIce = new Promise<void>((resolve) => {
      if (peer.iceGatheringState === "complete") return resolve();

      const onComplete = () => {
        if (peer.iceGatheringState === "complete") {
          peer.removeEventListener("icegatheringstatechange", onComplete);
          resolve();
        }
      };

      peer.addEventListener("icegatheringstatechange", onComplete);

      setTimeout(() => {
        peer.removeEventListener("icegatheringstatechange", onComplete);
        resolve();
      }, 2000);
    });

    await waitForIce;
    socket.emit("offer", { offer: JSON.stringify(peer.localDescription), to: room, from: userId });
  };
  const generateAnswer = async ({ peerConnection, room }: GenerateOffer, offer: string) => {
    const peer = peerConnection.current;
    if (!peer) return;

    const remoteOffer = JSON.parse(offer);
    await peer.setRemoteDescription(remoteOffer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    const waitForIce = new Promise<void>((resolve) => {
      if (peer.iceGatheringState === "complete") return resolve();

      const onComplete = () => {
        if (peer.iceGatheringState === "complete") {
          peer.removeEventListener("icegatheringstatechange", onComplete);
          resolve();
        }
      };

      peer.addEventListener("icegatheringstatechange", onComplete);

      setTimeout(() => {
        peer.removeEventListener("icegatheringstatechange", onComplete);
        resolve();
      }, 2000);
    });

    await waitForIce;
    socket.emit("answer", { answer: JSON.stringify(peer.localDescription), to: room, from: userId });
  };

  const addAnswer = async (answer: string, peerConnection: React.RefObject<RTCPeerConnection | null>) => {
    const peer = peerConnection.current;
    if (!peer) return;
    console.log(answer);
    const remoteAnswer = await JSON.parse(answer);
    if (remoteAnswer) {
      await peer.setRemoteDescription(remoteAnswer);
    }
  };

  return [generateOffer, generateAnswer, addAnswer] as const;
}
