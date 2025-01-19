/* eslint-disable @next/next/no-img-element */
"use client";
import { getCookie } from "@/app/utility/getCookie";
import { handleIndexDb } from "@/app/utility/saveMessageLocalDB";
import { socket } from "@/socket";
import { forbidden, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useSelector } from "react-redux";

export default function CaremaPage() {
  const [dataUri, setDataUri] = useState(null);
  const [faceMode, setFaceMode] = useState("environment");
  const [caption, setCaption] = useState("");
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const userId = useSelector((state) => state.userId);

  const sendImage = async () => {
    const formData = new FormData();
    const id = pathname.split("/");
    const room = id[id.length - 1];
    const accessToken = getCookie("accessToken");
    socket.emit("private message", room, { message: caption, accessToken, image: dataUri });
    handleIndexDb(caption, room, dataUri, userId);
    router.back();
  };

  function handleTakePhotoAnimationDone(dataUri) {
    setDataUri(dataUri);
  }
  const toggleCamera = () => {
    setFaceMode(faceMode === "environment" ? "user" : "environment");
    setVisible(false);
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  };
  return (
    <div className="bg-black h-screen w-screen pt-10  text-white overflow-hidden">
      <div tabIndex={10} className="px-1.5 py-1  flex items-center m-4 absolute z-10 bg-black w-fit rounded-full opacity-45 ">
        <button onClick={() => router.back()}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8L8 16M8.00001 8L16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="">
        {dataUri && dataUri !== "" ? (
          <>
            <img src={dataUri && dataUri !== "" ? dataUri : null} alt="capture Image" />
            <div className="bottom-0 absolute">
              <div className="mx-5 bg-gray-800 rounded-2xl my-2 h-10 flex items-center">
                <input value={caption ? caption : ""} onChange={(e) => setCaption(e.target.value)} className="bg-gray-800 px-2 mx-2 outline-none" type="text" placeholder="Add caption..." />
              </div>
              <div className="w-screen flex justify-between px-5 py-3 items-center bg-gray-800 ">
                <div className="px-2 py-1 rounded-2xl bg-gray-900">name</div>
                <div className="bg-weblue px-4 pt-[15px] pb-2 rounded-full w-fit">
                  <button onClick={sendImage}>
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.3208 12L19.3208 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M19.3209 1L12.8209 19C12.777 19.0957 12.7066 19.1769 12.6179 19.2338C12.5293 19.2906 12.4262 19.3209 12.3209 19.3209C12.2156 19.3209 12.1125 19.2906 12.0238 19.2338C11.9352 19.1769 11.8647 19.0957 11.8209 19L8.32087 12L1.32087 8.5C1.22513 8.45613 1.144 8.38569 1.08712 8.29705C1.03024 8.20842 1 8.10532 1 8C1 7.89468 1.03024 7.79158 1.08712 7.70295C1.144 7.61431 1.22513 7.54387 1.32087 7.5L19.3209 1Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div tabIndex={10} className=" flex items-center my-4 px-4 absolute z-10  w-full justify-end  ">
                <button className="w-fit px-1.5 py-1 bg-black  rounded-full opacity-45" onClick={toggleCamera}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.0028 3V7.49704C22.0028 7.77482 21.7776 8 21.4998 8V8C21.2999 8 21.12 7.88104 21.034 7.70059C19.4262 4.32948 15.9866 2 12.0028 2C6.81746 2 2.55391 5.94668 2.05219 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 16.4V9.39365C6 9.06228 6.26863 8.79365 6.6 8.79365H7.77283C7.97677 8.79365 8.16674 8.69006 8.2772 8.51863L9.7228 6.27502C9.83326 6.10359 10.0232 6 10.2272 6H13.7728C13.9768 6 14.1667 6.10359 14.2772 6.27502L15.7228 8.51863C15.8333 8.69006 16.0232 8.79365 16.2272 8.79365H17.4C17.7314 8.79365 18 9.06228 18 9.39365V16.4C18 16.7314 17.7314 17 17.4 17H6.6C6.26863 17 6 16.7314 6 16.4Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.05078 21V16.503C2.05078 16.2252 2.27596 16 2.55374 16V16C2.75366 16 2.93357 16.119 3.01963 16.2994C4.62737 19.6705 8.06703 22 12.0508 22C17.2361 22 21.4997 18.0533 22.0014 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div style={{ display: visible ? "" : "none" }} className="h-fit w-fit" tabIndex={0}>
                <Camera onTakePhotoAnimationDone={handleTakePhotoAnimationDone} isFullscreen={false} isImageMirror={false} idealFacingMode={faceMode} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
