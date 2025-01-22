import React, { useEffect, useRef, useState } from "react";

export default function AudioInputUI() {
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      if (sec === 60) {
        setSec(0);
        setMin((pre) => pre + 1);
      } else {
        setSec((pre) => pre + 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ userSelect: "none" }} className="text-gray-600 flex">
      <span className="mx-3">
        <svg width="12" height="18" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 17.5C11.5609 17.5 13.6364 15.15 13.6364 12.25V5.25C13.6364 2.35 11.5609 0 9 0C6.43909 0 4.36364 2.35 4.36364 5.25V12.25C4.36364 15.15 6.43909 17.5 9 17.5ZM18 12.1875C18 12.05 17.9018 11.9375 17.7818 11.9375H16.1455C16.0255 11.9375 15.9273 12.05 15.9273 12.1875C15.9273 16.5719 12.8264 20.125 9 20.125C5.17364 20.125 2.07273 16.5719 2.07273 12.1875C2.07273 12.05 1.97455 11.9375 1.85455 11.9375H0.218182C0.0981818 11.9375 0 12.05 0 12.1875C0 17.4594 3.45273 21.8094 7.90909 22.425V25.625H3.94636C3.57273 25.625 3.27273 26.0719 3.27273 26.625V27.75C3.27273 27.8875 3.34909 28 3.44182 28H14.5582C14.6509 28 14.7273 27.8875 14.7273 27.75V26.625C14.7273 26.0719 14.4273 25.625 14.0536 25.625H9.98182V22.4406C14.49 21.8781 18 17.5031 18 12.1875Z"
            fill={sec % 2 === 0 ? "red" : "none"}
          />
        </svg>
      </span>
      <span>{sec > 9 ? `0${min}:${sec}` : `0${min}:0${sec}`}</span>
    </div>
  );
}
