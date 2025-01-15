"use client";

import { useEffect, useRef } from "react";

export default function TestPage() {
  const scrollPage = useRef();
  useEffect(() => {
    if (scrollPage.current) {
      // Scroll to the bottom of the element
      scrollPage.current.scrollTop = scrollPage.current.scrollHeight;
    }
  }, []);
  return (
    <div className="h-[80vh] overflow-scroll" ref={scrollPage}>
      <div className="h-[300vh]"></div>
      <div>bottom</div>
    </div>
  );
}
