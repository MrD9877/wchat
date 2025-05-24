/* eslint-disable @next/next/no-img-element */
"use client";

import { streamToBlob } from "@/app/(backend)/utility/setInitialAvatar";
import { UserState } from "@/redux/Slice";
import { saveMediaInDb } from "@/utility/saveAndRetrievedb";
import { ArrowDown, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export const fetchAndStore = async (src: string, clientId: string | undefined) => {
  try {
    const res = await fetch(src);
    if (res.ok && res.body && clientId) {
      const blob = await streamToBlob(res.body);
      const save = await saveMediaInDb(clientId, src, blob);
      return blob;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

export default function DownLoadImage({ src, time, setIsMediaCaches }: { time: string; src: string | string[]; setIsMediaCaches: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [download, setDownLoad] = useState(false);
  const clientId = useSelector((state: UserState) => state.userId);

  const downLoadImage = async () => {
    if (typeof src === "string") {
      const result = await fetchAndStore(src, clientId);
      if (!result) {
        setDownLoad(false);
        return;
      }
    } else {
      for (let i = 0; i < src.length; i++) {
        const url = src[i];
        const result = await fetchAndStore(url, clientId);
        if (!result) {
          setDownLoad(false);
          i = src.length;
          return;
        }
      }
    }
    setIsMediaCaches(true);
  };
  return (
    <div className="mx-3 w-[200px] h-[190px]  px-2.5 py-1 rounded-xl flex  my-2  flex-col justify-center   bg-gray-200">
      <div className="w-[180px] h-[150px] relative bg-gray-700 rounded-xl ">
        <div className="absolute h-full w-full z-10 flex justify-center items-center rounded-xl  bg-black/60">
          {download ? (
            <button className="bg-white/30 rounded-full p-4">
              <LoaderCircle className="text-blue-600 animate-spin" />
            </button>
          ) : (
            <button
              className="bg-white/30 rounded-full p-4"
              onClick={() => {
                setDownLoad(true);
                downLoadImage();
              }}
            >
              <ArrowDown />
            </button>
          )}
        </div>
        <img className="h-full w-full " src={"/images/downloadImage.webp"} alt={"image"} />
        <div className="flex justify-end  w-full items-center min-h-[20px]">
          <div className="text-xs px-1 text-black">{time}</div>
        </div>
      </div>
    </div>
  );
}
