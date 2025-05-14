import React, { RefObject, useEffect, useState } from "react";

export default function useScrool(chatBox: RefObject<HTMLDivElement | null>, chatPageDiv: RefObject<HTMLDivElement | null>) {
  const [windowHeight, setWindowHeight] = useState<number>();
  useEffect(() => {
    // setInitialHeight(window.visualViewport.height);
    const handleResize = () => {
      const visualHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setWindowHeight(visualHeight);
    };

    // Monitor changes to the viewport size using visualViewport
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    //listening on any message to us

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!chatBox.current || !chatPageDiv.current) return;
    chatBox.current.scrollTop = chatBox.current.scrollHeight;
    chatPageDiv.current.style.overflow = "hidden";
  }, [windowHeight, chatBox, chatPageDiv]);

  return windowHeight;
}
