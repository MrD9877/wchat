import { socket } from "@/socket";
import { getCookie } from "@/utility/getCookie";

type GenerateOffer = {
  peerConnection: React.RefObject<RTCPeerConnection | null>;
  room: string | null;
};

export default function useGenerateOffer() {
  const generateOffer = async ({ peerConnection, room }: GenerateOffer) => {
    const peer = peerConnection.current;
    if (!peer) return;

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    const accessToken = getCookie("accessToken");
    socket.emit("offer", { offer: JSON.stringify(peer.localDescription), to: room, accessToken });
  };
  const generateAnswer = async ({ peerConnection, room }: GenerateOffer, offer: string) => {
    const peer = peerConnection.current;
    if (!peer) return;

    const remoteOffer = JSON.parse(offer);
    await peer.setRemoteDescription(remoteOffer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const accessToken = getCookie("accessToken");
    socket.emit("answer", { answer: JSON.stringify(peer.localDescription), to: room, accessToken });
  };

  const addAnswer = async (answer: string, peerConnection: React.RefObject<RTCPeerConnection | null>) => {
    const peer = peerConnection.current;
    if (!peer) return;
    const remoteAnswer = await JSON.parse(answer);
    if (remoteAnswer) {
      await peer.setRemoteDescription(remoteAnswer);
    }
  };

  return [generateOffer, generateAnswer, addAnswer] as const;
}
