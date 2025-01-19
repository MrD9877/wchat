import Image from "next/image";
import React from "react";

export function ImageBubbleSend({ src, msg, time }) {
  const inLargeImage = (src) => {};
  return (
    <div className="flex justify-end w-screen">
      <div className="bg-weChat px-2.5 py-1 rounded-xl mr-2 w-fit flex items-end my-2 h-[200px] flex-col justify-center max-w-[210px]">
        <Image onClick={() => inLargeImage(src)} width={200} height={150} src={src} alt={msg} />
        <div className="overflow-scroll">{msg ? msg : "image"}</div>
        <div className="text-xxs px-1 text-gray-600">{time}</div>
      </div>
    </div>
  );
}
export function ImageBubbleRecive({ src, msg, time }) {
  console.log(src);
  const inLargeImage = (src) => {};
  return (
    <div className="bg-white px-2.5 py-1 rounded-xl mr-2 w-fit flex  my-2 h-[200px] flex-col justify-center max-w-[210px]">
      <Image onClick={() => inLargeImage(src)} width={200} height={150} src={src} alt={msg} />
      <div className="overflow-scroll">{msg ? msg : "image"}</div>
      <div className="text-xxs px-1 text-gray-600">{time}</div>
    </div>
  );
}
