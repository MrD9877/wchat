import Image from "next/image";
import React from "react";

type ImageBubble = {
  src: string[] | string;
  msg: string | undefined;
  time: string;
  setShowImage: React.Dispatch<React.SetStateAction<string[] | null>>;
};

const inLargeImage = (src: string[], setShowImage: React.Dispatch<React.SetStateAction<string[] | null>>) => {
  if (src) setShowImage(src);
};

function DisplayMultipleImage({ src, msg, time, setShowImage, className }: Omit<ImageBubble, "src"> & { className: string; src: string[] }) {
  return (
    <div onClick={() => inLargeImage(src, setShowImage)} className={` px-4  py-1 rounded-xl  w-fit  my-2 h-fit flex  flex-col ${className}`}>
      <div className="grid grid-cols-2 gap-2 h-fit max-w-[250px] py-2 ">
        {src.map((img, index) => {
          if (index > 3) return;
          if (index === 3 && src.length > 4)
            return (
              <div key={index} className=" bg-white w-[100] h-[100]  text-black flex justify-center items-center text-2xl font-bold opacity-60">
                <div>+{src.length - 3}</div>
              </div>
            );
          return (
            <div key={index}>
              <div className="bg-white w-[100] h-[100] flex justify-center items-center relative overflow-clip rounded-xl">
                <Image style={{ objectFit: "contain" }} className="object-cover" width={100} height={100} src={img} alt={msg || "image"} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-xs px-1 text-gray-600">{time}</div>
    </div>
  );
}

function DisplaySingleImage({ src, msg, time, setShowImage, className }: ImageBubble & { className: string }) {
  return (
    <div onClick={() => inLargeImage(Array.isArray(src) ? src : [src], setShowImage)} className={`bg-weChat px-2.5 py-1 rounded-xl  w-fit flex  my-2 max-h-[220px] flex-col justify-center max-w-[210px]  overflow-clip ${className}`}>
      <div className="max-h-[180px] overflow-clip rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-[180px] h-[150px]" width={180} height={150} src={Array.isArray(src) ? src[0] : src} alt={msg || "image"} />
      </div>
      <div style={{ justifyContent: msg ? "space-between" : "flex-end" }} className="flex   w-full items-center min-h-[20px]">
        {msg && <div className="overflow-scroll">{msg}</div>}
        <div className="text-xs px-1 text-gray-600">{time}</div>
      </div>
    </div>
  );
}

export function ImageBubbleSend({ src, msg, time, setShowImage }: ImageBubble) {
  if (Array.isArray(src) && src.length > 1) {
    return (
      <div className="flex w-screen justify-end  mr-2 px-2.5">
        <DisplayMultipleImage src={src} msg={msg} time={time} setShowImage={setShowImage} className="bg-weChat items-end" />
      </div>
    );
  }
  return (
    <div className="flex justify-end w-screen px-2.5">
      <DisplaySingleImage src={src} msg={msg} time={time} setShowImage={setShowImage} className="bg-weChat items-end" />
    </div>
  );
}
export function ImageBubbleRecive({ src, msg, time, setShowImage }: ImageBubble) {
  if (Array.isArray(src) && src.length > 1) {
    return (
      <div className="w-screen ">
        <DisplayMultipleImage src={src} msg={msg} time={time} setShowImage={setShowImage} className="bg-white" />
      </div>
    );
  }
  return (
    <div className="bg-white px-2.5 py-1 rounded-xl mr-2 w-fit flex  my-2 h-[200px] flex-col justify-center max-w-[210px]">
      <DisplaySingleImage src={src} msg={msg} time={time} setShowImage={setShowImage} className="bg-white " />
    </div>
  );
}
