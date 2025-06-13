import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

type AttachPhotoUI = {
  src: (string | ArrayBuffer | null)[];
  setSrc: Dispatch<SetStateAction<string[]>>;
  sendMsg: () => Promise<void>;
  setFile: Dispatch<SetStateAction<File[] | null>>;
};

export default function AttachPhotoUI({ src, setSrc, sendMsg, setFile }: AttachPhotoUI) {
  const [slide, setSlide] = useState<number>(0);
  const [slides, setSlides] = useState<string[]>([]);
  const swiperDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const arr = new Array(src.length).fill("k");
    setSlides(arr);
    setSlide(0);
  }, [src]);

  const handleDiscard = () => {
    setSrc([]);
    setFile(null);
  };

  const handleSendSrc = () => {
    setSrc([]);
  };

  if (!src || src.length === 0) return null; // Ensure src is valid and has images
  return (
    <div style={{ background: "rgba(0,0,0,0.5)" }} className="absolute top-0 w-full h-screen flex items-center flex-col justify-center max-w-viewWidth px-4">
      <div className="z-50 fixed top-0 left-0 m-6 max-w-viewWidth">
        <button onClick={handleDiscard} className="px-1.5 py-1 bg-white w-fit rounded-full opacity-65 ">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8L8 16M8.00001 8L16 16" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div style={{ background: "rgba(0,0,0,0.5)" }} className="overflow-clip w-full mx-auto   rounded-lg">
        <div ref={swiperDiv} className="rounded-xl flex h-fit justify-start">
          <Swiper onSlideChange={(e) => setSlide(e.activeIndex)} spaceBetween={1} slidesPerView={1}>
            {src.map((sr, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="bg-black h-[50vh] justify-center flex ">
                    <img className="rounded-xl mx-auto object-contain " src={typeof sr === "string" ? sr : ""} alt="img" />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div>
          <div className="px-4 flex w-3/4 mx-auto ">
            {slides &&
              slide !== null &&
              slides.map((item, index) => {
                return <div key={index} style={{ width: `${(1 / slides.length) * 100}%`, background: slide >= index ? "red" : "white", height: "3px" }}></div>;
              })}
          </div>
        </div>
      </div>
      <div style={{ background: "rgba(0,0,0,0.5)" }} className=" flex items-end justify-end  fixed bottom-0 max-w-viewWidth w-full px-10 py-3 ">
        <div className="bg-weblue px-4 pt-[15px] pb-2 rounded-full my-1 mx-2 z-50">
          <button onClick={sendMsg}>
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
  );
}
