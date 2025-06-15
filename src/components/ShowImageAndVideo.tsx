/* eslint-disable @next/next/no-img-element */
"use Client";
import React, { useEffect } from "react";

export default function ShowImageAndVideo({ sources, setSrc }: { sources: string[] | null; setSrc: React.Dispatch<React.SetStateAction<string[] | null>> }) {
  return (
    <div style={{ display: sources ? "flex" : "none" }} className="absolute  h-screen bg-black z-50 top-0 left-0 w-screen ">
      {sources && (
        <div className="flex gap-4 flex-col ">
          {sources.map((src) => {
            return (
              <div key={src} className="flex w-screen  min-h-[100svh] justify-center items-center bg-black relative">
                <div className="z-50 absolute top-0 right-0 m-6">
                  <button
                    onClick={() => {
                      document.startViewTransition(() => {
                        setSrc(null);
                      });
                    }}
                    className="px-1.5 py-1 bg-white w-fit rounded-full opacity-65 "
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8L8 16M8.00001 8L16 16" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <img src={src} alt="image" className="object-contain" style={{ viewTransitionName: `${src}` }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
