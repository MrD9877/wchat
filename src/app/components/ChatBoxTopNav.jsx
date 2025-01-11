"use client";
export default function ChatBoxTopNav() {
  return (
    <div className="h-[15vh]  bg-weblue rounded-b-2xl pt-8">
      <div className="bg-white px-2 pr-3 py-2 w-4/5 mx-auto rounded-2xl flex justify-between">
        <span className="bg-weblue px-3 py-1 text-black font-bold rounded-full">J</span>
        <input className="outline-none px-3" type="text" placeholder="Search by name or email.." />
        <div className="flex mr-3 justify-center items-center">
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="#191919" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.35 18L13 13.65" stroke="#191919" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <nav className="flex text-white font-bold justify-evenly text-xl mt-3">
        <div>Chats</div>
        <div>Calls</div>
      </nav>
    </div>
  );
}
