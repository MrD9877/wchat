/* eslint-disable @next/next/no-img-element */
import { setLoading, UserState } from "@/redux/Slice";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export type ImageTakenType = { dataUri: string; sendImage: (data: string, caption?: string) => Promise<void>; isCaption?: boolean };

export default function ImageTaken({ dataUri, sendImage, isCaption = false }: ImageTakenType) {
  const [caption, setCaption] = useState<string>();
  const captionInput = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  function focusInput() {
    if (captionInput.current) {
      captionInput.current.focus();
    }
  }
  return (
    <>
      {dataUri && (
        <div className="w-screen h-[90svh] flex items-center justify-center">
          <img src={dataUri} alt="capture Image" className="max-w-screen max-h-[100svh] " style={{ viewTransitionName: "capturedImage" }} />
        </div>
      )}
      <div className="bottom-0 absolute">
        {isCaption && (
          <div onClick={focusInput} className="mx-5 bg-gray-800 rounded-2xl my-2 h-10 flex items-center">
            <input ref={captionInput} value={caption ? caption : ""} onChange={(e) => setCaption(e.target.value)} className="bg-gray-800 px-2 mx-2 outline-none" type="text" placeholder="Add caption..." />
          </div>
        )}
        <div className="w-screen flex justify-between px-5 py-3 items-center bg-gray-800 ">
          <div className="px-2 py-1 rounded-2xl bg-gray-900">Image</div>
          <div className="bg-weblue px-4 pt-[15px] pb-2 rounded-full w-fit">
            <button
              onClick={(e) => {
                e.currentTarget.disabled = true;
                dispatch(setLoading(true));
                sendImage(dataUri, caption);
              }}
            >
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
  );
}
