"use client";
import { AudioBubbleIn, AudioBubbleOut } from "@/components/AudioBubble";
import { ChatbubblesIn, ChatbubblesOut, DateBubble } from "@/components/Chatbubbles";
import ChatpageInput from "@/components/ChatpageInput";
import ChatPageTop from "@/components/ChatPageTop";
import EmoteKeyBoard from "@/components/EmoteKeyBoard";
import { ImageBubbleRecive, ImageBubbleSend } from "@/components/ImageBubble";
import { handleAudioChunk } from "@/utility/AudioChunkConverter";
import { convertTime, getDate } from "@/utility/convertTime";
import { socket } from "@/socket";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/Slice";
import useScrool from "@/hooks/useScrool";
import { connectIndexDb } from "@/utility/IndexDbConnect";

export type ChatReference = {
  chatId: string;
  date: Date;
};

export type Friend = {
  id: string;
  name: string;
  chats: ChatReference[];
};

export type Chat = {
  date: Date;
  chats: {
    date: Date;
    message: string;
    user: string;
    image?: (string | ArrayBuffer | null)[] | null;
    audio?: Blob[];
  }[];
};

export default function ChatPage() {
  const chatBox = useRef<HTMLDivElement>(null);
  const chatPageDiv = useRef<HTMLDivElement>(null);
  const windowHeight = useScrool(chatBox, chatPageDiv);
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);

  const [chat, setChat] = useState<Chat[]>([]);
  const pathname = usePathname();
  const [room, setRoom] = useState<string>();
  const userId = useSelector((state: UserState) => state.userId);
  const [friend, setFriend] = useState({});
  const [textMessage, setTextMessage] = useState("");

  const handleIndexDb = async (room: string) => {
    const db = await connectIndexDb();
    if (!db) return false;
    const { transaction, stores } = db;
    const findFriend = stores.friendStore.get(room);
    // 5
    const temp: Chat[] = [];
    findFriend.onsuccess = function () {
      const friend: Friend = findFriend.result;
      setFriend(friend);
      if (friend && friend.chats) {
        friend.chats.forEach((chat) => {
          const findChat = stores.chatStore.get(chat.chatId);
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
  };

  useEffect(() => {
    const id = pathname.split("/");
    const room = id[id.length - 1];
    setRoom(room);
    handleIndexDb(room);
  }, [pathname]);
  // for received msg
  useEffect(() => {
    const handleNewMessage = ({ message, user, image, audio }: { message: string; user: string; image?: Buffer; audio?: Buffer }) => {
      setChat((pre) => {
        let data = { date: new Date(), message: message, user: user };
        if (image) data.image = image;
        if (audio) data.audio = audio;
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
    return () => {
      socket.off("chat message", handleNewMessage);
    };
  }, [chat]);

  useEffect(() => {
    if (chatBox.current) chatBox.current.scrollTop = chatBox.current.scrollHeight;
  }, [chat]);

  return (
    <div className="h-screen bg-chatPattern">
      <div ref={chatPageDiv} style={{ height: windowHeight || "100vh" }} className="bg-chatPattern bg-sky-100 top-0 z-10">
        <ChatPageTop room={room} friend={friend} />
        {/* chat */}
        <div ref={chatBox} style={{ height: windowHeight ? windowHeight - 150 - keyBoardHeight : "80vh" }} className="overflow-scroll ">
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
                      } else if (msg.audio) {
                        const audioURL = handleAudioChunk(msg.audio);
                        return (
                          <div key={index}>
                            <AudioBubbleIn url={audioURL} />
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
                            <ImageBubbleSend src={msg.image} time={time} msg={msg.message} />
                          </div>
                        );
                      } else if (msg.audio) {
                        const audioURL = handleAudioChunk(msg.audio);
                        return (
                          <div key={index}>
                            <AudioBubbleOut url={audioURL} />
                            {/* <CustomAudioPlayer audioURL={audioURL} /> */}
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
        <ChatpageInput setKeyBoardHeight={setKeyBoardHeight} setChat={setChat} room={room} textMessage={textMessage} setTextMessage={setTextMessage} />
        {keyBoardHeight > 0 && <EmoteKeyBoard keyBoardHeight={keyBoardHeight} setTextMessage={setTextMessage} />}
      </div>
    </div>
  );
}
