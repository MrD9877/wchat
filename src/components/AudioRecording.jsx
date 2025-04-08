import { socket } from "@/socket";
import React, { useState, useEffect, useRef } from "react";
import { getCookie } from "../utility/getCookie";
import { handleIndexDb } from "../utility/saveMessageLocalDB";
import { getDate } from "../utility/convertTime";
import { useSelector } from "react-redux";

const AudioRecorder = ({ audioRecording, room, setChat }) => {
  const mediaRecorderRef = useRef(null); // Reference for MediaRecorder
  const audioChunksRef = useRef([]); // To store the audio data chunks
  const userId = useSelector((state) => state.userId);

  // Request access to the microphone
  const startMedia = async () => {
    if (navigator.mediaDevices) {
      const promise = new Promise((resolve, reject) => {
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
      await promise;
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
      mediaRecorderRef.current.onstop = () => {
        // Send the audio chunks via socket (if necessary)
        setChat((pre) => {
          if (pre.length > 0 && getDate(pre[pre.length - 1].date) == getDate(new Date())) {
            const latest = pre.length - 1;
            const temp = structuredClone(pre);
            const saveMessage = { date: new Date(), message: undefined, user: userId, audio: audioChunksRef.current };
            temp[latest].chats.push(saveMessage);
            return temp;
          } else {
            const temp = [...pre];
            temp.push({ date: new Date(), chats: [{ ...saveMessage }] });
            return temp;
          }
        });
        handleIndexDb(undefined, room, undefined, userId, audioChunksRef.current);
        const accessToken = getCookie("accessToken");
        socket.emit("private message", room, { audio: structuredClone(audioChunksRef.current), accessToken });

        stopMediaStream(); // Custom function to stop media stream
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
  }, [audioRecording]);

  return <></>;
};

export default AudioRecorder;
