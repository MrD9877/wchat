"use client";
import { ChatbubblesIn, ChatbubblesOut, DateBubble } from "@/app/components/Chatbubbles";
import ChatpageInput from "@/app/components/ChatpageInput";
import ChatPageTop from "@/app/components/ChatPageTop";
import EmoteKeyBoard from "@/app/components/EmoteKeyBoard";
import { ImageBubbleRecive, ImageBubbleSend } from "@/app/components/ImageBubble";
import { convertTime, getDate } from "@/app/utility/convertTime";
import { onUpgrade } from "@/app/utility/indexDbFunctions";
import { socket } from "@/socket";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

export default function ChatPage() {
  const [windowHeight, setWindowHeight] = useState("100vh");
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);
  const [chat, setChat] = useState([]);
  const chatBox = useRef();
  const chatPageDiv = useRef();
  const pathname = usePathname();
  const [room, setRoom] = useState(null);
  const userId = useSelector((state) => state.userId);
  const [friend, setFriend] = useState({});
  const [textMessage, setTextMessage] = useState("");

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
  const handleIndexDb = (room) => {
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    if (!indexedDB) {
      console.log("IndexedDB could not be found in this browser.");
    }
    // 2
    const request = indexedDB.open("wchat", 1);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };

    request.onupgradeneeded = onUpgrade;

    request.onsuccess = function () {
      console.log("Database opened successfully");
      const db = request.result;
      // 1
      const transaction = db.transaction(["friends", "chats"], "readwrite");
      //2
      const friendStore = transaction.objectStore("friends");
      const chatStore = transaction.objectStore("chats");
      //3
      //   store.put({ id: 1, colour: "Red", make: "Toyota" });
      //4
      const findFriend = friendStore.get(room);

      // 5
      const temp = [];
      findFriend.onsuccess = function () {
        const friend = findFriend.result;
        setFriend(friend);
        if (friend && friend.chats) {
          friend.chats.forEach((chat) => {
            const findChat = chatStore.get(chat.chatId);
            findChat.onsuccess = function () {
              const chats = findChat.result.chats;
              temp.push({ date: chat.date, chats: structuredClone(chats) });
            };
          });
        }
      };
      transaction.oncomplete = function () {
        setChat([...temp]);
        console.log("Transaction completed successfully");
      };

      transaction.onerror = function () {
        console.error("Transaction failed", transaction.error);
      };
    };
  };

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
    const id = pathname.split("/");
    const room = id[id.length - 1];
    setRoom(room);
    handleIndexDb(room);
    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  // for received msg
  useEffect(() => {
    const handleNewMessage = ({ message, user, image }) => {
      setChat((pre) => {
        let data = { date: new Date(), message: message, user: user };
        if (image) data.image = image;
        if (pre.length > 0 && getDate(pre[pre.length - 1].date) === getDate(new Date())) {
          const temp = structuredClone(pre);
          temp[pre.length - 1].chats.push({ ...data });
          return temp;
        } else {
          const temp = [...pre];
          temp.push({ date: new Date(), chats: [{ ...data }] });
          return temp;
        }
      });
    };
    socket.on("chat message", handleNewMessage);
    socket.on("image", handleNewMessage);
    return () => {
      socket.off("chat message", handleNewMessage);
    };
  }, [chat]);

  useEffect(() => {
    if (!chatBox) return;
    chatBox.current.scrollTop = chatBox.current.scrollHeight;
    chatPageDiv.current.style.overflow = "hidden";
  }, [windowHeight]);

  useEffect(() => {
    console.log(chatBox.current);
    chatBox.current.scrollTop = chatBox.current.scrollHeight;
  }, [chat]);

  return (
    <div className="h-screen bg-chatPattern">
      <Toaster position="top-center" reverseOrder={false} />
      {windowHeight && (
        <div ref={chatPageDiv} style={{ height: windowHeight || "100vh" }} className="bg-chatPattern bg-sky-100 top-0 z-10">
          <ChatPageTop popTost={popTost} friend={friend} />
          {/* chat */}
          <div ref={chatBox} style={{ height: windowHeight - 150 - keyBoardHeight }} className="overflow-scroll ">
            {chat.map((chatBydates, index) => {
              const day = getDate(chatBydates.date);
              return (
                <div key={index}>
                  <DateBubble>{day}</DateBubble>
                  {chatBydates.chats &&
                    chatBydates.chats.map((msg, index) => {
                      const time = convertTime(msg.date);
                      if (msg.user === room) {
                        if (msg.image) {
                          return (
                            <div key={index}>
                              <ImageBubbleRecive src={msg.image} time={time} msg={msg.message} />
                            </div>
                          );
                        } else {
                          return (
                            <div key={index}>
                              <ChatbubblesIn time={time}>{msg.message}</ChatbubblesIn>
                            </div>
                          );
                        }
                      } else if (msg.user === userId) {
                        if (msg.image) {
                          return (
                            <div key={index}>
                              <ImageBubbleSend src={msg.image} time={time} msg={msg.message} />;
                            </div>
                          );
                        } else {
                          return (
                            <div key={index}>
                              <ChatbubblesOut time={time}>{msg.message}</ChatbubblesOut>
                            </div>
                          );
                        }
                      }
                    })}
                </div>
              );
            })}
          </div>
          <ChatpageInput setKeyBoardHeight={setKeyBoardHeight} popTost={popTost} setChat={setChat} room={room} textMessage={textMessage} setTextMessage={setTextMessage} />
          {keyBoardHeight > 0 && <EmoteKeyBoard keyBoardHeight={keyBoardHeight} setTextMessage={setTextMessage} />}
        </div>
      )}
    </div>
  );
}
