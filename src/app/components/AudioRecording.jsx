import React, { useState, useEffect, useRef } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null); // Reference for MediaRecorder
  const audioChunksRef = useRef([]); // To store the audio data chunks
  const audioRef = useRef(null); // Reference for playing the recorded audio

  // Request access to the microphone
  useEffect(() => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data); // Collect audio data chunks
          };

          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/wav",
            });
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioURL(audioURL); // Create audio URL to play the recording
            audioChunksRef.current = []; // Reset the chunks array
          };
        })
        .catch((error) => {
          console.error("Error accessing the microphone:", error);
        });
    }
  }, []);

  // Start recording
  const startRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <div>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
      </div>
      {audioURL && (
        <div>
          <h3>Recorded Audio</h3>
          <audio ref={audioRef} controls src={audioURL}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
