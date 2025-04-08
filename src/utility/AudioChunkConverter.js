export const handleAudioChunk = (record) => {
  const audioBlob = new Blob(record, {
    type: "audio/wav",
  });
  const audioURL = URL.createObjectURL(audioBlob);
  return audioURL;
};
