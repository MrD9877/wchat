/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DownLoadImage from "./DownLoadImage";
import { getMediaInDb } from "@/utility/saveAndRetrievedb";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/Slice";

type ImageBubble = {
  src: string[] | string;
  msg: string | undefined;
  time: string;
  setShowImage: React.Dispatch<React.SetStateAction<string[] | null>>;
};

export async function isImageCached(url: string) {
  const cache = await caches.open("media");
  console.log(url);
  const media = await cache.match(url);
  console.log(media);
  if (media) return true;
  else return false;
}

const inLargeImage = (src: string[], setShowImage: React.Dispatch<React.SetStateAction<string[] | null>>) => {
  if (src) setShowImage(src);
};

function DisplayMultipleImage({ src, msg, time, setShowImage, className }: Omit<ImageBubble, "src"> & { className: string; src: string[] }) {
  return (
    <div className={` px-4  py-1 rounded-xl  w-fit  my-2 h-fit flex  flex-col ${className}`}>
      <div className="grid grid-cols-2 gap-2 h-fit max-w-[250px] py-2 ">
        {src.map((img, index) => {
          if (index > 3) return;
          if (index === 3 && src.length > 4)
            return (
              <div onClick={() => inLargeImage(src, setShowImage)} key={index} className=" bg-white w-[100] h-[100]  text-black flex justify-center items-center text-2xl font-bold opacity-60">
                <div>+{src.length - 3}</div>
              </div>
            );
          return (
            <div key={index}>
              <div className="bg-white w-[100] h-[100] flex justify-center items-center relative overflow-clip rounded-xl">
                <Image onClick={() => inLargeImage(src, setShowImage)} style={{ objectFit: "contain" }} className="object-cover" width={100} height={100} src={img} alt={msg || "image"} />
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
    <div className={`bg-weChat px-2.5 py-1 rounded-xl  w-fit flex  my-2 max-h-[220px] flex-col justify-center max-w-[210px]  overflow-clip ${className}`}>
      <div className="max-h-[180px] overflow-clip rounded-xl">
        <img onClick={() => inLargeImage(Array.isArray(src) ? src : [src], setShowImage)} className="w-[180px] object-cover h-[150px]" width={180} height={150} src={Array.isArray(src) ? src[0] : src} alt={msg || "image"} />
      </div>
      <div style={{ justifyContent: msg ? "space-between" : "flex-end" }} className="flex   w-full items-center min-h-[20px]">
        {msg && <div className="overflow-scroll select-none">{msg}</div>}
        <div className="text-xs px-1 text-gray-600 select-none">{time}</div>
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
  const [isMediaCaches, setIsMediaCaches] = useState(false);
  const [url, setUrl] = useState<string[]>();
  const clientId = useSelector((state: UserState) => state.userId);

  useEffect(() => {
    if (!clientId) return;
    (async () => {
      try {
        const isMedia = await getMediaInDb(clientId, typeof src === "string" ? src : src[0]);
        setIsMediaCaches(!!isMedia);
      } catch {
        // todo
      }
    })();
  }, [src, clientId]);

  useEffect(() => {
    if (!clientId || !isMediaCaches) return;
    (async () => {
      const results: string[] = [];
      const urls = typeof src === "string" ? [src] : src;
      try {
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];
          const blob = await getMediaInDb(clientId, url);
          const result = URL.createObjectURL(blob);
          results.push(result);
        }
        setUrl(results);
      } catch {
        // todo
      }
    })();
  }, [isMediaCaches, clientId, src]);

  if (!isMediaCaches) return <DownLoadImage src={src} time={time} setIsMediaCaches={setIsMediaCaches} />;
  if (!url) return;
  if (Array.isArray(src) && src.length > 1) {
    return (
      <div className="w-screen ">
        <DisplayMultipleImage src={url} msg={msg} time={time} setShowImage={setShowImage} className="bg-white" />
      </div>
    );
  }
  return (
    <div className="bg-white px-2.5 py-1 rounded-xl mr-2 w-fit flex  my-2 h-[200px] flex-col justify-center max-w-[210px]">
      <DisplaySingleImage src={url[0]} msg={msg} time={time} setShowImage={setShowImage} className="bg-white " />
    </div>
  );
}
