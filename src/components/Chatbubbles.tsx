import { ChatType, ItemSelected } from "@/app/(siteRoutes)/chatpage/[chatId]/page";
import { CallbackEvent } from "@/hooks/useLongPress";
import { SavedDbMessages } from "@/utility/saveAndRetrievedb";
import { MouseEvent } from "react";

type ChatBubbleType = {
  text: string;
  time: string;
};

type LongPressEvents = {
  onMouseDown: (e: CallbackEvent) => void;
  onTouchStart: (e: CallbackEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchEnd: () => void;
};

type WrapperBubble = {
  children: React.ReactNode;
  longPressEvents: LongPressEvents;
  item: ChatType;
  index: number;
  type: "image" | "text" | "audio";
  itemSelected: ItemSelected | undefined;
  setShowImage: React.Dispatch<React.SetStateAction<string[] | null>>;
  clickSelect: (e: HTMLDivElement) => void;
};

export function WrapperBubble({ children, longPressEvents, item, index, type, itemSelected, setShowImage, clickSelect }: WrapperBubble) {
  const inLargeImage = (src: string[]) => {
    document.startViewTransition(() => {
      if (src) setShowImage(src);
    });
  };
  const handleWrapperClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (itemSelected) {
      clickSelect(e.currentTarget);
    } else if (item.image) {
      inLargeImage(typeof item.image === "string" ? [item.image] : item.image);
    }
  };
  return (
    <>
      <div style={{ display: item.sender ? "flex" : "block", background: itemSelected?.index === index ? "rgba(0,0,22,0.3)" : "" }} className="w-screen flex justify-end">
        <div onClick={handleWrapperClick} className="my-1 px-2 " {...longPressEvents} data-type={type} data-content={type === "image" ? item.image : type === "audio" ? item.audio : item.message} data-index={index} data-id={item.id} key={index}>
          {children}
        </div>
      </div>
      {!!item.unread && (
        <div className="flex justify-center items-center w-screen bg-[rgba(0,0,0,0.1)] py-1">
          <span className="px-1.5 py-0.5 rounded-xl bg-white text-xs">{item.unread} unread message</span>
        </div>
      )}
    </>
  );
}

export function DateBubble({ children }: { children: React.ReactNode }) {
  return <div className="w-fit mx-auto my-2 bg-weChat px-2.5 py-1 rounded-xl text-xs select-none">{children}</div>;
}

function ChatBubble({ text, time, className }: ChatBubbleType & { className: string }) {
  return (
    <div className={className}>
      {text}
      <div className="text-xs px-1 text-gray-600">{time}</div>
    </div>
  );
}
export function ChatbubblesIn({ text, time }: ChatBubbleType) {
  return <ChatBubble time={time} text={text} className="bg-white px-2.5 py-1 rounded-xl ml-2 w-fit flex items-end select-none" />;
}
export function ChatbubblesOut({ text, time }: ChatBubbleType) {
  return <ChatBubble text={text} time={time} className="bg-weChat px-2.5 py-1 rounded-xl mr-2 w-fit flex items-end select-none" />;
}
