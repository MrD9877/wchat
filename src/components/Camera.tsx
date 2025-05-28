"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ImageTaken, { ImageTakenType } from "./ImageTaken";
import { Circle, Trash2Icon } from "lucide-react";
import { stopStream } from "@/utility/MediaStreamFn";

export default function Camera(props: Omit<ImageTakenType, "dataUri">) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dataUri, setDataUri] = useState<string>();
  const [faceMode, setFaceMode] = useState<"environment" | "user" | undefined>("environment");
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setVideo = async (video: HTMLVideoElement | null, faceMode: string | undefined) => {
    if (!video) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: faceMode } });
      video.srcObject = stream;
    } catch {}
  };

  useEffect(() => {
    if (!dataUri) setVideo(videoRef.current, faceMode);
  }, [videoRef, faceMode, dataUri]);

  const toggleCamera = () => {
    setFaceMode(faceMode === "environment" ? "user" : "environment");
    setVisible(false);
    setTimeout(() => {
      setVisible(true);
    }, 400);
  };

  const handleCapture = async () => {
    const canvas = canvasRef.current;
    const stream = videoRef.current;

    if (!canvas || !stream) return;
    const width = stream.videoWidth;
    const height = stream.videoHeight;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.translate(canvas.width, 0);
    if (faceMode === "user") {
      ctx.scale(-1, 1); // mirror horizontally
    }
    ctx.drawImage(stream, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    const dataUri = canvas.toDataURL("image/png");
    document.startViewTransition(() => {
      setDataUri(dataUri);
    });
    stopStream(stream.srcObject as MediaStream);
    stream.srcObject = null;
  };

  return (
    <div className="bg-black">
      <canvas ref={canvasRef} className="hidden" />
      <div className="bg-black h-[100svh] w-screen pt-10  text-white overflow-hidden absolute top-0 z-50">
        <button onClick={() => router.back()} className="px-1.5 py-1  flex items-center m-4 absolute z-50 bg-weblue w-fit rounded-full opacity-45 " style={{ viewTransitionName: "capturedImage" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8L8 16M8.00001 8L16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          {dataUri && dataUri !== "" ? (
            <>
              <div tabIndex={10} className=" flex items-center my-4 px-4 absolute z-10  w-full justify-end  ">
                <button
                  className="w-fit px-1.5 py-1 bg-black  rounded-full opacity-45"
                  onClick={() => {
                    setDataUri(undefined);
                  }}
                >
                  <Trash2Icon width={30} height={30} stroke="red" />
                </button>
              </div>
              <ImageTaken dataUri={dataUri} sendImage={props.sendImage} isCaption={props.isCaption} />
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
                <div style={{ display: visible ? "block" : "none" }} className="h-fit w-screen absolute bottom-20 flex" tabIndex={0}>
                  <video ref={videoRef} autoPlay playsInline className="w-screen h-[100svh] bg-black scale-x-[-1]" muted />
                </div>
              </div>
            </>
          )}
        </div>
        {!dataUri && (
          <div className="absolute z-60 bottom-20 w-screen flex justify-center">
            <button onClick={handleCapture}>
              <Circle fill="white" width={70} height={70} className="px-2 bg-white/40 rounded-full" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
