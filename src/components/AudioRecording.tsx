import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SavedDbFriends, SavedDbMessages } from "@/utility/saveAndRetrievedb";
import { UserState } from "@/redux/Slice";
import { generateRandom } from "@/app/(backend)/utility/random";
import { sendPrivateMessage } from "@/utility/sendPrivateMessage";
import { getPublicKey } from "@/action/getpublicKey";
import { Base64ToPublicKey } from "@/utility/Encription";

type AudioRecorderType = {
  setChat: Dispatch<SetStateAction<SavedDbMessages[]>>;
  room: string;
  audioRecording: boolean;
  friend: SavedDbFriends | null | undefined;
};

const AudioRecorder = ({ audioRecording, room, setChat, friend }: AudioRecorderType) => {
  const mediaRecorderRef = useRef<MediaRecorder>(null); // Reference for MediaRecorder
  const audioChunksRef = useRef<Blob[]>([]); // To store the audio data chunks
  const clientId = useSelector((state: UserState) => state.userId);
  const dispatch = useDispatch();

  // Request access to the microphone
  const startMedia = async (): Promise<void> => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    if (navigator.mediaDevices) {
      return new Promise((resolve, reject) => {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
              audioChunksRef.current.push(event.data); // Collect audio data chunks
            };
            resolve();
          })
          .catch((error) => {
            console.error("Error accessing the microphone:", error);
            reject();
          });
      });
    }
  };

  const stopMediaStream = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => {
        track.stop(); // Stop each track (audio/video)
      });
    }
  };

  // Start recording
  const startRecording = async () => {
    await startMedia();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = async () => {
        if (!clientId || !friend) return;
        const id = generateRandom(8);
        const timestamp = Date.now();
        try {
          const key = await getPublicKey(room);
          if (!key) throw Error();
          const publicKey = await Base64ToPublicKey(key);
          await sendPrivateMessage({ clientId, audio: audioChunksRef.current, userId: room, id, timestamp, publicKey }, dispatch);
          setChat((pre) => [{ sender: true, audio: audioChunksRef.current, userId: room, id, timestamp }, ...pre]);
        } catch (error) {
          console.log(error);
        } finally {
          stopMediaStream();
        }
      };
    }
  };

  useEffect(() => {
    if (audioRecording) {
      startRecording();
    }
    if (!audioRecording) {
      stopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRecording]);

  return [];
};

export default AudioRecorder;
