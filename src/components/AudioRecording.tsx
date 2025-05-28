import { socket } from "@/socket";
import React, { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { getCookie } from "../utility/getCookie";
import { useSelector } from "react-redux";
import { SavedDbMessages, saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { UserState } from "@/redux/Slice";
import { generateRandom } from "@/app/(backend)/utility/random";
import { updateFriend } from "@/utility/updateFriend";
import { uploadImageAndGetUrl } from "@/utility/uploadAndGetUrl";

type AudioRecorderType = {
  setChat: Dispatch<SetStateAction<SavedDbMessages[]>>;
  room: string;
  audioRecording: boolean;
};

const AudioRecorder = ({ audioRecording, room, setChat }: AudioRecorderType) => {
  const mediaRecorderRef = useRef<MediaRecorder>(null); // Reference for MediaRecorder
  const audioChunksRef = useRef<Blob[]>([]); // To store the audio data chunks
  const userId = useSelector((state: UserState) => state.userId);

  // Request access to the microphone
  const startMedia = async (): Promise<void> => {
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

      // Wait for the recording to finish before accessing audioChunks
      mediaRecorderRef.current.onstop = async () => {
        if (userId) {
          // Send the audio chunks via socket (if necessary)
          const url = await uploadImageAndGetUrl({ audio: audioChunksRef.current });
          if (!url) {
            // todo no url
            return;
          }
          const id = generateRandom(16);
          setChat((pre) => [...pre, { message: undefined, sender: true, audio: audioChunksRef.current, userId: room, image: undefined, video: undefined, id, timestamp: Date.now() }]);
          await saveMessageForUser(userId, { message: undefined, sender: true, audio: audioChunksRef.current, image: undefined, video: undefined, id, userId: room, timestamp: Date.now() });
          await updateFriend({ clientId: userId, userId: room, image: undefined, message: undefined, audio: audioChunksRef.current ? "true" : undefined });
          const accessToken = getCookie("accessToken");
          socket.emit("private message", room, { audio: url, accessToken, id });
        }
        stopMediaStream();
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
