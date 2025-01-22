import React, { useRef, useState } from "react";

export const AudioBubbleOut = React.memo(({ url }) => {
  const audioRef = useRef();
  return (
    <div className="flex w-screen justify-end px-2.5 my-2">
      <audio ref={audioRef} controls src={url}></audio>
    </div>
  );
});
export function AudioBubbleIn({ url }) {
  const audioRef = useRef();
  return (
    <div className="px-2.5 my-2">
      <audio ref={audioRef} controls src={url}></audio>
    </div>
  );
}
export const CustomAudioPlayer = ({ audioURL }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume range 0 to 1

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (event) => {
    const volume = event.target.value;
    setVolume(volume);
    audioRef.current.volume = volume;
  };

  const handleProgressChange = (event) => {
    const currentTime = event.target.value;
    audioRef.current.currentTime = currentTime;
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg p-5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <button onClick={togglePlayPause} className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition duration-200">
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      {/* Custom volume control */}
      <div className="w-full flex items-center justify-between mb-4">
        <label htmlFor="volume" className="text-sm text-gray-600">
          Volume
        </label>
        <input type="range" id="volume" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-2/3" />
      </div>

      {/* Custom progress bar */}
      <div className="w-full mb-4">
        <label htmlFor="progress" className="text-sm text-gray-600">
          Progress
        </label>
        <input type="range" id="progress" min="0" max={audioRef.current?.duration || 1} step="0.01" onChange={handleProgressChange} className="w-full" />
      </div>

      <audio ref={audioRef} src={audioURL} />
    </div>
  );
};
