type ChatBubbleType = {
  text: string;
  time: string;
};

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
  return <ChatBubble time={time} text={text} className="bg-white px-2.5 py-1 rounded-xl ml-2 w-fit flex items-end my-2 select-none" />;
}
export function ChatbubblesOut({ text, time }: ChatBubbleType) {
  return (
    <div className="w-screen flex justify-end">
      <ChatBubble text={text} time={time} className="bg-weChat px-2.5 py-1 rounded-xl mr-2 w-fit flex items-end my-2 select-none" />
    </div>
  );
}
