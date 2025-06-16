/* eslint-disable @next/next/no-img-element */
"use client";
import { fetchAvatar } from "@/app/(backend)/utility/setInitialAvatar";
import { setLoading, UserState } from "@/redux/Slice";
import { uploadProfilePic } from "@/utility/uploadProfilePic";
import { ArrowBigLeft, ArrowLeft, CircleCheck, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function AvatarPage() {
  const [src, setSrc] = useState<string[]>();
  const profilePicId = useSelector((state: UserState) => state.profilePic);
  const dispatch = useDispatch();
  const router = useRouter();
  const [selected, setSelected] = useState<number>();

  const sendImage = async () => {
    if (!src || !selected) return;
    try {
      const avatarBlob = await fetchAvatar(src[selected]);
      const arrayBuffer = await avatarBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await uploadProfilePic(undefined, profilePicId, buffer, "image/svg+xml");
      toast(`Profile image updated successfully.
           Please refresh the page to see the changes`);
    } catch {
      //to do
      toast(`Error:Profile image was not updates`);
    } finally {
      dispatch(setLoading(false));
      window.location.replace("/setting");
    }
  };

  useEffect(() => {
    const randomStrings = Array.from({ length: 40 }, () => Math.random().toString(36).slice(2, 10));
    setSrc(randomStrings);
  }, []);

  return (
    <div className=" text-black absolute top-0  w-screen z-50 flex flex-col bg-weChat min-h-screen">
      <div className="h-[9svh] w-screen z-[-1]"></div>
      <div className="h-[9svh] fixed top-0 w-screen bg-white border-b border-black flex items-center px-4 gap-4 z-10">
        <button className="absolute" onClick={() => router.back()}>
          <ArrowLeft width={35} height={35} />
        </button>
        <span className="text-lg w-screen flex justify-center">Select Avatar</span>
      </div>
      <div className="w-screen grid grid-cols-4 gap-2 p-2 ">
        {src
          ? src.map((s, index) => {
              return (
                <div key={index} className="border border-black rounded-2xl relative bg-white" onClick={() => setSelected(index)} style={selected === index ? { background: "var(--color-weblue)" } : {}}>
                  {selected === index && (
                    <span className="absolute z-[5] flex w-full h-full justify-end items-end px-2 py-2">
                      <CircleCheck fill="green" stroke="white" />
                    </span>
                  )}
                  <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s}`} alt="" />
                </div>
              );
            })
          : Array.from({ length: 20 }).map((_, i) => {
              return (
                <div key={i} className="border border-black rounded-2xl relative bg-white w-full h-52">
                  h
                </div>
              );
            })}
      </div>
      {src && selected && (
        <>
          <div className="h-[10svh] w-screen"></div>
          <div className="h-[10svh] fixed bottom-0 bg-[#404040]/55 w-screen border-t border-black flex items-center justify-between px-5">
            <div className="grid w-[30vw] grid-rows-1 max-h-full py-1 h-full">
              <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${src[selected]}`} className="object-contain w-full h-full opacity-100" alt="" />
            </div>
            <div>
              <button className="bg-weblue p-3 rounded-full mr-2" onClick={sendImage}>
                <Send width={40} height={40} stroke="white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
