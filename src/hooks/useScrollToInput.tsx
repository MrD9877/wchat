import React, { RefObject, useEffect, useRef } from "react";

export default function useScrollToInput(setEmojiKeyBoard: React.Dispatch<React.SetStateAction<boolean>>, placeholder2: RefObject<HTMLDivElement | null>, placeholder: RefObject<HTMLDivElement | null>) {
  const interval = useRef<NodeJS.Timeout>(null);
  const timeOut = useRef<NodeJS.Timeout>(null);
  const timeOut2 = useRef<NodeJS.Timeout>(null);

  const clearTimer = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }
    if (timeOut2.current) {
      clearTimeout(timeOut2.current);
    }
  };
  const showInput = () => {
    setEmojiKeyBoard(false);
    clearTimer();
    interval.current = setInterval(() => {
      placeholder2.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    setTimeout(clearTimer, 600);
  };
  const scrollToBottom = () => {
    placeholder.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  useEffect(() => {
    clearTimer();
    timeOut2.current = setTimeout(() => {
      scrollToBottom();
    }, 400);
  }, []);
  return { clearTimer, showInput, scrollToBottom } as const;
}
