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
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/Slice";
import ShowImageAndVideo from "@/components/ShowImageAndVideo";
import useSelectItem from "@/hooks/useSelectItem";
import useScrollToInput from "@/hooks/useScrollToInput";
import useGetRoom from "@/hooks/useGetRoom";

export type ChatReference = {
  chatId: string;
  date: Date;
};

export type Friend = {
  id: string;
  name: string;
  chats: ChatReference[];
  profilePic: string;
};

export type Chat = {
  date: Date;
  chats: {
    date: Date;
    message: string;
    user: string;
    image?: string[] | null;
    audio?: Blob[];
  }[];
};

export type ItemSelected = {
  type: "text" | "image" | "audio" | "video";
  content: string;
};

export default function ChatPage() {
  const [emojiKeyBoard, setEmojiKeyBoard] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [chat, setChat] = useState<Chat[]>([]);
  const [showImage, setShowImage] = useState<string[] | null>(null);
  const { itemSelected, longPressEvents, clearSelected } = useSelectItem();

  const placeholder = useRef<HTMLDivElement>(null);
  const placeholder2 = useRef<HTMLDivElement>(null);

  const userId = useSelector((state: UserState) => state.userId);

  const { clearTimer, showInput, scrollToBottom } = useScrollToInput(setEmojiKeyBoard, placeholder2, placeholder);

  const { room, friend } = useGetRoom(setChat);

  // for received msg
  useEffect(() => {
    const handleNewMessage = ({ message, user, image, audio }: { message: string; user: string; image?: string[]; audio?: Blob[] }) => {
      setChat((pre) => {
        let data: {
          date: Date;
          message: string;
          user: string;
          image?: string[];
          audio?: Blob[];
        } = { date: new Date(), message: message, user: user };
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
      scrollToBottom();
    };
    socket.on("chat message", handleNewMessage);
    return () => {
      socket.off("chat message", handleNewMessage);
    };
  }, [chat]);

  return (
    <div className="h-[100svh]">
      <ShowImageAndVideo sources={showImage} setSrc={setShowImage} />
      <ChatPageTop room={room} friend={friend} itemSelected={itemSelected} clearSelected={clearSelected} />
      <div style={{ height: "92svh", background: "url('/chatpageBg.png')" }} className="grid grid-rows-12 bg-sky-100  z-10">
        {/* chat */}
        <div className="overflow-scroll row-span-11">
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
                          <div {...longPressEvents} data-type="image" data-content={msg.message} {...longPressEvents} key={index}>
                            <ImageBubbleRecive src={msg.image} time={time} msg={msg.message} setShowImage={setShowImage} />
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
                          <div {...longPressEvents} data-type="text" data-content={msg.message} key={index}>
                            <ChatbubblesIn time={time} text={msg.message} />
                          </div>
                        );
                      }
                    } else if (msg.user === userId) {
                      if (msg.image) {
                        return (
                          <div {...longPressEvents} data-type="image" data-content={msg.message} key={index}>
                            <ImageBubbleSend src={msg.image} time={time} msg={msg.message} setShowImage={setShowImage} />
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
                          <div {...longPressEvents} data-type="text" data-content={msg.message} key={index}>
                            <ChatbubblesOut time={time} text={msg.message} />
                          </div>
                        );
                      }
                    }
                  })}
              </div>
            );
          })}
          <div ref={placeholder} className="mt-2"></div>
        </div>
        <ChatpageInput scrollToBottom={scrollToBottom} clearTimer={clearTimer} showInput={showInput} emojiKeyBoard={emojiKeyBoard} setEmojiKeyBoard={setEmojiKeyBoard} setChat={setChat} room={room} textMessage={textMessage} setTextMessage={setTextMessage} />
        {emojiKeyBoard && <EmoteKeyBoard setTextMessage={setTextMessage} />}
        <div ref={placeholder2} className="mt-2"></div>
      </div>
    </div>
  );
}
