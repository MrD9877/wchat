import { BeforeInstallPromptEvent } from "@/app/(siteRoutes)/setting/layout";
import { UserState } from "@/redux/Slice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ImageWithFallBack from "./ImageWithFallBack";
import { deleteInvalidCache, logoutfn } from "@/utility/logout";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import useLoggedIn from "@/hooks/useLoggedIn";

export default function ProfileFront() {
  const profilePic = useSelector((state: UserState) => state.profilePic);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const logedIn = useLoggedIn();
  const router = useRouter();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        setDeferredPrompt(null);
      });
    }
  };
  return (
    <div className="bg-white shadow-xl pb-8">
      <div x-data="{ openSettings: false }" className="absolute right-12 mt-4 "></div>
      <div className="w-full h-[150px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="image" src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg" className="w-full h-full object-cover " />
      </div>
      <div className="flex flex-col items-center -mt-20">
        {profilePic && <ImageWithFallBack className="w-32 h-32 border-4 border-white rounded-full" src={`${process.env.NEXT_PUBLIC_AWS_URL}/${profilePic}`} alt="profile Image" width={120} height={120} />}
        {logedIn && (
          <div className="flex flex-col items-center space-x-2 mt-2">
            <Link href={"setting/editProfile?edit=profilePic"}>
              <span className="text-blue-500 rounded-full p-1 text-xs select-none" title="Verified" style={{ viewTransitionName: "EditBox" }}>
                EDIT
              </span>
            </Link>
          </div>
        )}
      </div>
      <div className="flex  gap-2 justify-between mt-2 px-10 text-lg">
        <button onClick={handleInstallClick} className="flex items-center bg-weblue hover:opacity-75 text-gray-100 px-[14px] py-2 rounded text-sm space-x-2 transition duration-100">
          <svg className="-ms-0.5 me-1.5 h-4 w-4" fill="#000000" viewBox="-4 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.031 17.969l-0.094 0.063c-0.469 0.25-0.781 0.438-0.906 0.438-0.094 0.031-0.156 0.063-0.219 0.094-0.219-0.406-0.844-1.625-1.781-3.25-1.125-2.063-4.344-9.656-4.438-9.969-0.063-0.313 0-0.625 0.219-0.75 0.031-0.031 0.094-0.031 0.156-0.031 0.188 0 0.406 0.125 0.531 0.219 0.188 0.156 3.844 5.75 5.813 9.313 1.188 2.156 1.594 2.938 1.75 3.219-0.063 0.031-0.125 0.063-0.188 0.125-0.125 0.156-0.563 0.406-0.75 0.5h-0.031zM11.031 8.594l0.406 0.219c0.688 0.375 0.844 1.188 0.5 1.875l-2.719-1.563c0.25-0.438 0.719-0.688 1.156-0.688 0.25 0 0.469 0.031 0.656 0.156zM11.5 11.438l0.031 0.031c0.094 0.031 0.094 0.188 0.063 0.25s-0.094 0.094-0.156 0.094h-0.125l-0.031-0.031-0.094 0.156h0.031c0.094 0.063 0.125 0.156 0.094 0.25-0.063 0.063-0.094 0.094-0.156 0.094-0.031 0-0.063 0-0.094-0.031l-0.031-0.031-0.188 0.344 0.031 0.031c0.063 0.031 0.094 0.156 0.063 0.219s-0.094 0.094-0.156 0.094c-0.031 0-0.063 0-0.094-0.031h-0.031l-0.094 0.156 0.031 0.031c0.094 0.063 0.125 0.156 0.063 0.25-0.031 0.063-0.063 0.094-0.125 0.094-0.031 0-0.063-0.031-0.094-0.031l-0.031-0.031-0.094 0.125-0.125 0.219-2.719-1.563 0.125-0.219 0.094-0.125-0.031-0.031c-0.094-0.031-0.125-0.188-0.063-0.25 0.031-0.063 0.063-0.094 0.125-0.094 0.031 0 0.063 0 0.094 0.031h0.031l0.094-0.125-0.031-0.031c-0.094-0.063-0.125-0.156-0.063-0.25 0.031-0.063 0.094-0.094 0.156-0.094 0.031 0 0.063 0.031 0.094 0.031l0.031 0.031 0.188-0.344h-0.031c-0.094-0.063-0.125-0.156-0.063-0.25 0.031-0.063 0.063-0.094 0.125-0.094 0.031 0 0.063 0.031 0.094 0.031l0.031 0.031 0.094-0.188-0.031-0.031c-0.094-0.031-0.125-0.156-0.063-0.219 0.031-0.063 0.094-0.094 0.156-0.094h0.125l0.031 0.031 0.125-0.219 2.719 1.563zM1.75 22l5.375-9.313 2.719 1.594-5.5 9.5c-0.469-0.188-0.938-0.438-1.375-0.688-0.438-0.281-0.906-0.594-1.313-0.906l0.031-0.094zM0 20.625v-4.656h4.156l-2.719 4.656h-1.438zM16.281 19.625l0.438 0.656 0.156 0.156 0.094 0.188h-9.719l2.719-4.656h4.344c1.063 1.906 1.719 3.156 1.719 3.188 0.063 0.094 0.094 0.156 0.156 0.188 0.031 0.094 0.063 0.219 0.094 0.281zM20.531 18.125l-0.281-0.656c-0.063-0.094-0.094-0.156-0.156-0.219-0.031-0.094-0.063-0.188-0.094-0.25l-0.25-0.5c-0.094-0.156-0.188-0.313-0.313-0.531h4.563v4.656h-2.344c0-0.031-0.031-0.094-0.031-0.156l-0.344-0.719c-0.031-0.063-0.063-0.156-0.125-0.219 0-0.094-0.031-0.156-0.063-0.219l-0.313-0.719c-0.031-0.063-0.125-0.125-0.156-0.188-0.031-0.094-0.063-0.219-0.094-0.281zM20.406 20.156l0.313 0.625 0.031 0.094s-0.469 0.406-0.875 0.625-0.969 0.406-0.969 0.406l-0.094-0.125-0.344-0.563v-0.25l-0.25-0.188-0.469-0.656v-0.219l-0.219-0.156-0.25-0.406-0.156-0.25c0.219-0.031 0.594-0.188 1.156-0.5 0.031 0 0.031-0.031 0.063-0.031s0.031-0.031 0.063-0.031c0.469-0.25 0.813-0.469 0.969-0.688l0.125 0.281 0.188 0.406v0.344l0.219 0.125 0.313 0.719-0.031 0.313zM20.938 21.563l2.625 3.938c0.344 0.625 0.031 1.375-0.594 1.719-0.219 0.125-0.469 0.188-0.688 0.188-0.438 0-0.844-0.188-1.094-0.594l-1.906-4.344c0.219-0.094 0.594-0.25 0.906-0.406 0.25-0.156 0.563-0.344 0.75-0.5zM1 26.906l-0.156 0.281c-0.031 0.063-0.125 0.094-0.219 0.094h-0.031c-0.031 0-0.063 0-0.063-0.031-0.031 0-0.031-0.031-0.063-0.031-0.063-0.063-0.063-0.188-0.031-0.25l0.156-0.281 0.906-3.813c0.375 0.281 0.781 0.563 1.156 0.781s0.781 0.406 1.188 0.563z"></path>
          </svg>
          <span>GetApp</span>
        </button>
        {logedIn ? (
          <button
            onClick={async () => {
              await deleteInvalidCache();
              logoutfn();
              router.push("/login");
            }}
            className="flex items-center bg-red-600 hover:bg-red-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100"
          >
            <svg className="-ms-0.5 me-1.5 h-4 w-4" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z"
                fill="#FFFFFF"
              />
            </svg>
            <span>Logout</span>
          </button>
        ) : (
          <button onClick={() => router.push("/login")} className="flex items-center bg-green-600 hover:bg-green-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
            <span>Login</span>
            <LogIn />
          </button>
        )}
      </div>
    </div>
  );
}
