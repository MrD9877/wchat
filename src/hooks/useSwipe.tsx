import { useState } from "react";

export default function useSwipe() {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipe, setSwipe] = useState<"left" | "right">();

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      const newDirection = isLeftSwipe ? "left" : "right";
      if ((newDirection === "left" && swipe === "right") || (newDirection === "right" && swipe === "left")) {
        setSwipe(undefined);
      } else {
        setSwipe(newDirection);
      }
    }
    console.log(isLeftSwipe);
    // add your conditional logic here
  };
  return { onTouchEnd, onTouchMove, onTouchStart, swipe, setSwipe } as const;
}
