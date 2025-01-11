"use client";
import { ChatbubblesIn, ChatbubblesOut, DateBubble } from "@/app/components/Chatbubbles";
import ChatpageInput from "@/app/components/ChatpageInput";
import ChatPageTop from "@/app/components/ChatPageTop";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ChatPage() {
  const [windowHeight, setWindowHeight] = useState("100vh");
  const [initialHeight, setInitialHeight] = useState("100vh");
  const chatBox = useRef();
  const chatPageDiv = useRef();
  const popTost = (msg, success) => {
    let emote = "❌";
    if (success) emote = "✅";
    toast(`${msg}`, {
      icon: `${emote}`,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };
  useEffect(() => {
    setInitialHeight(window.visualViewport.height);
    const handleResize = () => {
      const visualHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setWindowHeight(visualHeight);
    };

    // Monitor changes to the viewport size using visualViewport
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!chatBox) return;
    chatBox.current.scrollTop = chatBox.current.scrollHeight;
    chatPageDiv.current.style.overflow = "hidden";
  }, [windowHeight]);

  return (
    <div className="h-screen bg-chatPattern">
      {windowHeight && (
        <div ref={chatPageDiv} style={{ height: windowHeight }} className="bg-chatPattern bg-sky-100 top-0">
          <ChatPageTop popTost={popTost} />
          {/* chat */}
          <div ref={chatBox} style={{ height: windowHeight - 150 }} className="overflow-scroll ">
            <div className="h-[200vh]"></div>
            <DateBubble>Today</DateBubble>
            <ChatbubblesOut time={"3:45pm"}>hello</ChatbubblesOut>
            <ChatbubblesIn time={"3:48pm"}>How are you?</ChatbubblesIn>
          </div>
          <ChatpageInput popTost={popTost} />
        </div>
      )}
    </div>
  );
}
