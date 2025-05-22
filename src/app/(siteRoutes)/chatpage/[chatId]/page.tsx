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
import { checkFriendData, getMessagesSortedByTime, SavedDbMessages, saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { generateRandom } from "@/app/(backend)/utility/random";
import { updateFriend } from "@/utility/updateFriend";

export type ItemSelected = {
  type: "text" | "image" | "audio" | "video";
  content: string;
  index: number;
  id: string | undefined;
};

export default function ChatPage() {
  const [emojiKeyBoard, setEmojiKeyBoard] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [chat, setChat] = useState<SavedDbMessages[]>([]);
  const [showImage, setShowImage] = useState<string[] | null>(null);
  const { itemSelected, longPressEvents, clearSelected } = useSelectItem();

  const placeholder = useRef<HTMLDivElement>(null);
  const placeholder2 = useRef<HTMLDivElement>(null);

  const clientId = useSelector((state: UserState) => state.userId);

  const { clearTimer, showInput, scrollToBottom } = useScrollToInput(setEmojiKeyBoard, placeholder2, placeholder);

  const { room, friend } = useGetRoom(setChat);

  // for received msg
  const handleNewMessage = async ({ message, user, image, audio }: { message: string; user: string; image?: string[]; audio?: Blob[] }) => {
    if (!clientId || !room) {
      //todo
      console.log({ clientId, room });
      return;
    }
    try {
      const id = generateRandom(16);
      await saveMessageForUser(clientId, { message: message, audio, image, sender: false, id }, room);
      setChat((pre) => {
        return [...pre, { id, userId: user, image, audio, message, timestamp: Date.now(), video: undefined, sender: false }];
      });
      await updateFriend({ clientId, userId: room, image, message, audio });
    } catch (err) {
      console.log(err);
    }
    scrollToBottom();
  };

  const handleOldChat = async () => {
    if (!clientId || !room) return;
    try {
      await checkFriendData(clientId, room);
      const data = await getMessagesSortedByTime(clientId, room);
      setChat(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.on("chat message", handleNewMessage);
    return () => {
      socket.off("chat message", handleNewMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, clientId]);

  useEffect(() => {
    handleOldChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, room]);

  return (
    <div className="h-[100svh]">
      <ShowImageAndVideo sources={showImage} setSrc={setShowImage} />
      <ChatPageTop room={room} friend={friend} itemSelected={itemSelected} clearSelected={clearSelected} setChat={setChat} chat={chat} />
      <div style={{ height: "92svh", background: "url('/chatpageBg.png')" }} className="grid grid-rows-12 bg-sky-100  z-10">
        {/* chat */}
        <div className="overflow-scroll row-span-11">
          {chat.map((item, index) => {
            // const day = getDate(item.timestamp);
            const time = convertTime(item.timestamp);
            {
              /* <DateBubble>{day}</DateBubble> */
            }
            if (!item.sender) {
              if (item.image) {
                return (
                  <div {...longPressEvents} data-type="image" data-content={item.image} data-index={index} data-id={item.id} {...longPressEvents} key={index}>
                    <ImageBubbleRecive src={item.image} time={time} msg={item.message} setShowImage={setShowImage} />
                  </div>
                );
              } else if (item.audio && typeof item.audio === "string") {
                return (
                  <div {...longPressEvents} data-type="audio" data-content={item.audio} data-index={index} key={index} data-id={item.id}>
                    <AudioBubbleIn url={item.audio} />
                  </div>
                );
              } else if (item.message) {
                return (
                  <div {...longPressEvents} data-type="text" data-content={item.message} data-index={index} key={index} data-id={item.id}>
                    <ChatbubblesIn time={time} text={item.message} />
                  </div>
                );
              }
            } else if (item.sender) {
              if (item.image) {
                return (
                  <div {...longPressEvents} data-type="image" data-content={item.message} data-index={index} key={index} data-id={item.id}>
                    <ImageBubbleSend src={item.image} time={time} msg={item.message} setShowImage={setShowImage} />
                  </div>
                );
              } else if (item.audio && typeof item.audio !== "string") {
                const audioURL = handleAudioChunk(item.audio);
                return (
                  <div {...longPressEvents} data-type="audio" data-content={item.audio} data-index={index} key={index} data-id={item.id}>
                    <AudioBubbleOut url={audioURL} />
                  </div>
                );
              } else if (item.message) {
                return (
                  <div {...longPressEvents} data-type="text" data-content={item.message} data-index={index} data-id={item.id} key={index}>
                    <ChatbubblesOut time={time} text={item.message} />
                  </div>
                );
              }
            }
          })}
          <div ref={placeholder} className="mt-2"></div>
        </div>
        {room && <ChatpageInput scrollToBottom={scrollToBottom} clearTimer={clearTimer} showInput={showInput} emojiKeyBoard={emojiKeyBoard} setEmojiKeyBoard={setEmojiKeyBoard} setChat={setChat} room={room} textMessage={textMessage} setTextMessage={setTextMessage} />}
        {emojiKeyBoard && <EmoteKeyBoard setTextMessage={setTextMessage} />}
        <div ref={placeholder2} className="mt-2"></div>
      </div>
    </div>
  );
}
