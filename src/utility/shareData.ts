"use client";
const fileTypes = {
  text: "text/plain",
  image: "image/png",
  video: "video/mp4",
  audio: "audio/mpeg",
} as const;

type FileTypes = keyof typeof fileTypes;
export const handleShare = async (dataUri: string, type: FileTypes) => {
  const base64 = dataUri.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const blob = new Blob([buffer], { type: fileTypes[type] });
  const file = new File([blob], "shared", { type: blob.type });
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: "Check out this image!",
        text: "Sharing from my React app",
        files: [file],
      });
      alert("Image shared successfully!");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    alert("Sharing not supported on this browser.");
  }
};
