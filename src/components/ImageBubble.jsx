import Image from "next/image";
import React from "react";

const inLargeImage = (src) => {};

export function ImageBubbleSend({ src, msg, time }) {
  if (Array.isArray(src)) {
    return (
      <>
        <div onClick={() => inLargeImage(src)} className="bg-weChat px-4 mx-2 py-1 rounded-xl mr-2 w-fit  my-2 h-fit flex items-end flex-col">
          <div className="grid grid-cols-2 gap-2 h-fit max-w-[250px] py-4 px-2">
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
                  <div className="bg-white w-[100] h-[100] flex justify-center items-center relative overflow-clip">
                    <Image style={{ objectFit: "contain" }} className="object-cover" width={100} height={100} src={img} alt={msg} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xxs px-1 text-gray-600">{time}</div>
        </div>
      </>
    );
  }
  return (
    <div onClick={() => inLargeImage(src)} className="flex justify-end w-screen px-2.5">
      <div className="bg-weChat px-2.5 py-1 rounded-xl mr-2 w-fit flex items-end my-2 h-[200px] flex-col justify-center max-w-[210px]">
        <Image width={200} height={150} src={src} alt={msg} />
        <div className="overflow-scroll">{msg ? msg : "image"}</div>
        <div className="text-xxs px-1 text-gray-600">{time}</div>
      </div>
    </div>
  );
}
export function ImageBubbleRecive({ src, msg, time }) {
  if (Array.isArray(src)) {
    return (
      <div onClick={() => inLargeImage(src)} className="w-screen flex justify-end">
        <div className="bg-weChat px-4 mx-2 py-1 rounded-xl mr-2 w-fit  my-2 h-fit flex items-end flex-col">
          <div className="grid grid-cols-2 gap-2 h-fit max-w-[250px] py-4 px-2">
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
                  <div className="bg-white w-[100] h-[100] flex justify-center items-center relative overflow-clip">
                    <Image style={{ objectFit: "contain" }} className="object-cover" width={100} height={100} src={img} alt={msg} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xxs px-1 text-gray-600">{time}</div>
        </div>
      </div>
    );
  }
  return (
    <div onClick={() => inLargeImage(src)} className="bg-white px-2.5 py-1 rounded-xl mr-2 w-fit flex  my-2 h-[200px] flex-col justify-center max-w-[210px]">
      <Image onClick={() => inLargeImage(src)} width={200} height={150} src={src} alt={msg} />
      <div className="overflow-scroll">{msg ? msg : "image"}</div>
      <div className="text-xxs px-1 text-gray-600">{time}</div>
    </div>
  );
}
