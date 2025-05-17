import { useRef } from "react";

export type CallbackEvent = React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>;

const useLongPress = (callback: (e: HTMLDivElement) => void, delay = 500) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = (e: CallbackEvent) => {
    const currentTarget = e.currentTarget;
    timeoutRef.current = setTimeout(() => callback(currentTarget), delay);
  };

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
};

export default useLongPress;
