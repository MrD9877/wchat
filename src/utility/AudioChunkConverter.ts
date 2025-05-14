export const handleAudioChunk = (record: Blob[]) => {
  const audioBlob = new Blob(record, {
    type: "audio/wav",
  });
  const audioURL = URL.createObjectURL(audioBlob);
  return audioURL;
};
