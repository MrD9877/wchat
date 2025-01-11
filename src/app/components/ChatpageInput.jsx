"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatpageInput({ popTost }) {
  const [textMessage, setTextMessage] = useState("");
  const [files, setFile] = useState(null);
  const [sendVisible, setSendVisible] = useState(false);
  const [src, setSrc] = useState([]);

  const fileSelected = (event) => {
    const temp = event.target.files;
    setFile([...temp]);
  };

  const updateSrc = () => {
    files.forEach((file) => {
      const render = new FileReader();
      render.onload = (e) => {
        setSrc((pre) => [...pre, e.target.result]);
      };
      render.readAsDataURL(file);
    });
  };
  const sendMsg = async (e) => {
    if (textMessage === "") return;
    try {
      // todo fetch api
      e.target.disabled = true;
      const res = await fetch("", { method: "POST", credentials: "include", body: JSON.stringify({ textMessage }) });
      e.target.disabled = false;
      if (res.status === 200) {
        setTextMessage("");
      } else if (res.status === 400) {
        const data = await res.json();
        popTost(data.msg);
      } else {
        popTost(res.status);
      }
    } catch {
      e.target.disabled = false;
      popTost("somthing wend wrong");
    }
  };

  useEffect(() => {
    if (files) {
      updateSrc();
    }
  }, [files]);
  useEffect(() => {
    console.log(src);
  }, [src]);

  useEffect(() => {
    if (files) return;
    setSendVisible(textMessage === "" ? false : true);
  }, [textMessage]);

  return (
    <div className="h-[8%]">
      {src.length > 0 && (
        <div className="bg-white mx-auto p-8 rounded-xl max-w-[70vw] h-fit grid grid-cols-2 gap-2 mb-4">
          {src.map((sr, index) => {
            if (index > 3) return;
            return (
              <div key={index}>
                <img className="rounded-xl object-cover" src={sr} width="100" alt="img" />
              </div>
            );
          })}
        </div>
      )}
      <div className="flex justify-between  w-screen px-4 gap-2">
        <div className="flex px-4 py-2 gap-3 bg-white rounded-3xl items-center justify-between w-[80%]">
          {/* emote  */}
          <div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.8284 12.8284C11.2663 14.3905 8.7337 14.3905 7.17157 12.8284M7 8H7.01M13 8H13.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#191919" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* input  */}
          <input value={textMessage ? textMessage : ""} onChange={(e) => setTextMessage(e.target.value)} className="w-[70%] outline-none px-2 text-lg h-auto overflow-y-scroll" type="text" />
          {/* attachment  */}
          <div>
            <input id="dropzone-file" className="hidden" type="file" onChange={fileSelected} accept="image/*" multiple></input>
            <label htmlFor="dropzone-file">
              <svg width="14" height="20" viewBox="0 0 9 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.77163 4.7032L7.77163 13.3583C7.77163 15.0681 6.51999 16.5897 4.81841 16.7533C2.87141 16.9415 1.2271 15.4117 1.2271 13.4974L1.2271 3.38612C1.2271 2.31445 1.99608 1.34095 3.05957 1.2346C4.28667 1.11189 5.31743 2.06903 5.31743 3.27159L5.31743 11.8613C5.31743 12.3112 4.9493 12.6794 4.49937 12.6794C4.04943 12.6794 3.6813 12.3112 3.6813 11.8613L3.6813 4.7032C3.6813 4.36779 3.40316 4.08965 3.06775 4.08965C2.73234 4.08965 2.4542 4.36779 2.4542 4.7032L2.4542 11.7468C2.4542 12.8184 3.22318 13.7919 4.28667 13.8983C5.51377 14.021 6.54453 13.0638 6.54453 11.8613L6.54453 3.41066C6.54453 1.7009 5.29289 0.179295 3.59131 0.0156803C1.63613 -0.172474 0 1.35731 0 3.27159L0 13.3093C0 15.6571 1.71794 17.7595 4.05761 17.9804C6.74905 18.2258 8.99873 16.1316 8.99873 13.4974V4.7032C8.99873 4.36779 8.72059 4.08965 8.38518 4.08965C8.04978 4.08965 7.77163 4.36779 7.77163 4.7032Z"
                  fill="#191919"
                  fillOpacity="0.75"
                />
              </svg>
            </label>
          </div>
          {/* camera  */}
          <div style={{ display: sendVisible ? "none" : "" }}>
            <Link href={"/camera"}>
              <svg width="24" height="20" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.8 17.2H17.2C18.1941 17.2 19 16.3941 19 15.4V6.04C19 5.04589 18.1941 4.24 17.2 4.24H14.5L12.25 1H7.75L5.5 4.24H2.8C1.80589 4.24 1 5.04589 1 6.04V15.4C1 16.3941 1.80589 17.2 2.8 17.2Z" stroke="#191919" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 13.5999C11.9882 13.5999 13.6 11.9881 13.6 9.9999C13.6 8.01168 11.9882 6.3999 10 6.3999C8.0118 6.3999 6.40002 8.01168 6.40002 9.9999C6.40002 11.9881 8.0118 13.5999 10 13.5999Z" stroke="#191919" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
        {/* audio  */}
        <div style={{ display: sendVisible ? "none" : "" }} className="bg-weblue px-4 py-2 rounded-full">
          <button>
            <svg width="18" height="28" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 17.5C11.5609 17.5 13.6364 15.15 13.6364 12.25V5.25C13.6364 2.35 11.5609 0 9 0C6.43909 0 4.36364 2.35 4.36364 5.25V12.25C4.36364 15.15 6.43909 17.5 9 17.5ZM18 12.1875C18 12.05 17.9018 11.9375 17.7818 11.9375H16.1455C16.0255 11.9375 15.9273 12.05 15.9273 12.1875C15.9273 16.5719 12.8264 20.125 9 20.125C5.17364 20.125 2.07273 16.5719 2.07273 12.1875C2.07273 12.05 1.97455 11.9375 1.85455 11.9375H0.218182C0.0981818 11.9375 0 12.05 0 12.1875C0 17.4594 3.45273 21.8094 7.90909 22.425V25.625H3.94636C3.57273 25.625 3.27273 26.0719 3.27273 26.625V27.75C3.27273 27.8875 3.34909 28 3.44182 28H14.5582C14.6509 28 14.7273 27.8875 14.7273 27.75V26.625C14.7273 26.0719 14.4273 25.625 14.0536 25.625H9.98182V22.4406C14.49 21.8781 18 17.5031 18 12.1875Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        {/* send  */}
        <div style={{ display: sendVisible ? "" : "none" }} className="bg-weblue px-4 pt-[15px] pb-2 rounded-full">
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
