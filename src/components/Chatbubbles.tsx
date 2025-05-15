export function DateBubble({ children }: { children: React.ReactNode }) {
  return <div className="w-fit mx-auto my-2 bg-weChat px-2.5 py-1 rounded-xl">{children}</div>;
}
export function ChatbubblesIn({ children, time }: { children: React.ReactNode; time: string }) {
  return (
    <div className="bg-white px-2.5 py-1 rounded-xl ml-2 w-fit flex items-end my-2">
      {children}
      <div className="text-xs px-1 text-gray-600">{time}</div>
    </div>
  );
}
export function ChatbubblesOut({ children, time }: { children: React.ReactNode; time: string }) {
  return (
    <div className="flex justify-end w-screen">
      <div className="bg-weChat px-2.5 py-1 rounded-xl mr-2 w-fit flex items-end my-2">
        {children}
        <div className="text-xs px-1 text-gray-600">{time}</div>
      </div>
    </div>
  );
}
