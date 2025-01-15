"use client";
import Image from "next/image";

export default function Chatlog() {
  return (
    <div className="overflow-scroll">
      <div className="py-3 px-5">
        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
        {/* <!-- Chat list --> */}
        <div className="divide-y divide-gray-200">
          {/* <!-- User --> */}
          <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
            <div className="flex items-center">
              <Image className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-01_pfck4u.jpg" width="32" height="32" alt="Marie Zulfikar" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Marie Zulfikar</h4>
                <div className="text-[13px]">The video chat ended · 2hrs</div>
              </div>
              <div className="absolute right-10 bg-weblue px-2 text-[12px] text-white py-0.5 rounded-full">1</div>
            </div>
          </button>
          {/* <!-- User --> */}
          <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
            <div className="flex items-center">
              <Image className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-02_vll8uv.jpg" width="32" height="32" alt="Nhu Cassel" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Nhu Cassel</h4>
                <div className="text-[13px]">Hello Lauren 👋, · 24 Mar</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
