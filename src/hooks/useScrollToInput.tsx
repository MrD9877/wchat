import React, { RefObject, useRef } from "react";

export default function useScrollToInput(setEmojiKeyBoard: React.Dispatch<React.SetStateAction<boolean>>, placeholder2: RefObject<HTMLDivElement | null>, placeholder: RefObject<HTMLDivElement | null>) {
  const interval = useRef<NodeJS.Timeout>(null);
  const timeOut = useRef<NodeJS.Timeout>(null);
  const clearTimer = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    if (timeOut.current) {
      clearTimeout(timeOut.current);
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
  return { clearTimer, showInput, scrollToBottom } as const;
}
