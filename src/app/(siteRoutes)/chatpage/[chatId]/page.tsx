"use client";
import { AudioBubbleIn, AudioBubbleOut } from "@/components/AudioBubble";
import { ChatbubblesIn, ChatbubblesOut, DateBubble, WrapperBubble } from "@/components/Chatbubbles";
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
import { checkFriendData, getLastRead, getMessagesSortedByTime, SavedDbMessages, updateLastRead } from "@/utility/saveAndRetrievedb";
import { MessageData } from "@/hooks/useGetMessages";
import { handleNewMessage } from "@/utility/getNewMessage";

export type ItemSelected = {
  type: "text" | "image" | "audio" | "video";
  content: string;
  index: number;
  id: string | undefined;
};

export type ChatType = SavedDbMessages & { unread?: number };

export default function ChatPage() {
  const [emojiKeyBoard, setEmojiKeyBoard] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [chat, setChat] = useState<ChatType[]>([]);
  const [showImage, setShowImage] = useState<string[] | null>(null);
  const { itemSelected, longPressEvents, clearSelected, clickSelect } = useSelectItem();

  const placeholder = useRef<HTMLDivElement>(null);
  const placeholder2 = useRef<HTMLDivElement>(null);

  const clientId = useSelector((state: UserState) => state.userId);

  const { clearTimer, showInput, scrollToBottom } = useScrollToInput(setEmojiKeyBoard, placeholder2, placeholder);

  const { room, friend } = useGetRoom(setChat);

  // for received msg
  const handleMessage = async (data: MessageData) => {
    if (!clientId || !room) {
      //todo
      return;
    }
    try {
      const parsedData = await handleNewMessage(clientId, data, `/chatpage/${data.userId}`);
      if (!parsedData) throw Error(parsedData);
      setChat((pre) => {
        const temp = [...pre];
        temp.forEach((item, index) => {
          if (item.unread) {
            temp[index].unread = undefined;
          }
        });
        return [{ ...parsedData, video: undefined, sender: false }, ...temp];
      });
      await updateLastRead(clientId, data.userId);
    } catch (err) {
      console.log(err);
    } finally {
      scrollToBottom();
    }
  };

  const handleOldChat = async () => {
    if (!clientId || !room) return;
    try {
      await checkFriendData(clientId, room);
      const data: ChatType[] = await getMessagesSortedByTime(clientId, room);
      const lastRead = await getLastRead(clientId, room);
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.timestamp > lastRead) {
          data[i].unread = data.length - i;
          i = data.length;
        }
      }
      setChat(data.reverse());
      await updateLastRead(clientId, room);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.on("chat message", handleMessage);
    return () => {
      socket.off("chat message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, clientId]);

  useEffect(() => {
    handleOldChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, room]);

  return (
    <div className="h-[100svh] relative max-w-viewWidth">
      <ChatPageTop room={room} friend={friend} itemSelected={itemSelected} clearSelected={clearSelected} setChat={setChat} chat={chat} />
      <div style={{ height: "92svh", background: "url('/chatpageBg.png')" }} className="grid grid-rows-12 z-10 w-full">
        {/* chat */}
        <div className="overflow-scroll row-span-11 flex flex-col-reverse">
          <div ref={placeholder} className="mt-2"></div>
          {chat.map((item, index) => {
            const time = convertTime(item.timestamp);
            if (!item.sender) {
              if (item.image) {
                return (
                  <WrapperBubble setShowImage={setShowImage} clickSelect={clickSelect} itemSelected={itemSelected} longPressEvents={longPressEvents} type="image" item={item} index={index} key={index}>
                    <ImageBubbleRecive src={item.image} time={time} msg={item.message} />
                  </WrapperBubble>
                );
              } else if (item.audio && typeof item.audio === "string") {
                return (
                  <WrapperBubble setShowImage={setShowImage} clickSelect={clickSelect} itemSelected={itemSelected} longPressEvents={longPressEvents} type="audio" item={item} index={index} key={index}>
                    <AudioBubbleIn url={item.audio} />
                  </WrapperBubble>
                );
              } else if (item.message) {
                return (
                  <WrapperBubble setShowImage={setShowImage} clickSelect={clickSelect} itemSelected={itemSelected} longPressEvents={longPressEvents} type="text" item={item} index={index} key={index}>
                    <ChatbubblesIn time={time} text={item.message} />
                  </WrapperBubble>
                );
              }
            } else if (item.sender) {
              if (item.image) {
                return (
                  <WrapperBubble setShowImage={setShowImage} clickSelect={clickSelect} itemSelected={itemSelected} longPressEvents={longPressEvents} type="image" item={item} index={index} key={index}>
                    <ImageBubbleSend src={item.image} time={time} msg={item.message} />
                  </WrapperBubble>
                );
              } else if (item.audio && typeof item.audio !== "string") {
                const audioURL = handleAudioChunk(item.audio);
                return (
                  <WrapperBubble setShowImage={setShowImage} clickSelect={clickSelect} itemSelected={itemSelected} longPressEvents={longPressEvents} type="audio" item={item} index={index} key={index}>
                    <AudioBubbleOut url={audioURL} />
                  </WrapperBubble>
                );
              } else if (item.message) {
                return (
                  <WrapperBubble setShowImage={setShowImage} clickSelect={clickSelect} itemSelected={itemSelected} longPressEvents={longPressEvents} type="text" item={item} index={index} key={index}>
                    <ChatbubblesOut time={time} text={item.message} />
                  </WrapperBubble>
                );
              }
            }
          })}
        </div>
        {room && <ChatpageInput friend={friend} scrollToBottom={scrollToBottom} clearTimer={clearTimer} showInput={showInput} emojiKeyBoard={emojiKeyBoard} setEmojiKeyBoard={setEmojiKeyBoard} setChat={setChat} room={room} textMessage={textMessage} setTextMessage={setTextMessage} />}
        {emojiKeyBoard && <EmoteKeyBoard setTextMessage={setTextMessage} />}
        <div ref={placeholder2} className="mt-2"></div>
      </div>
    </div>
  );
}
