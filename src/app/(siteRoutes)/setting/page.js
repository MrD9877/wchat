"use client";

import { urlB64ToUint8Array } from "@/app/utility/b64ToUint8";
import NavBarChatBox from "../../components/NavBarChatBox";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function FriendsPage({ user }) {
  const [avatarSrc, setAvatarSrc] = useState("/getStarted.png");
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const userName = useSelector((state) => state.name);
  const email = useSelector((state) => state.email);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isChecked, setIsChecked] = useState({});

  useEffect(() => {
    if (Notification.permission === "granted") {
      setPermissionGranted(true);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setPermissionGranted(true);
        } else {
          console.log("Notification permission denied.");
        }
      });
    }
  }, []);

  useEffect(() => {
    // Check if the app is already installed and in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false); // Hide the install button if in standalone mode
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default prompt
      setDeferredPrompt(e); // Store the event for later use
      setIsInstallable(true); // Show the install button
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);
  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(`User response: ${choiceResult.outcome}`);
        // Reset the prompt after the user responds
        setDeferredPrompt(null);
        setIsInstallable(false); // Hide the install button after prompt is shown
      });
    }
  };

  const subscribe = async () => {
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager.subscribe({
          userVisibleOnly: true, // This ensures the user sees the notification
          applicationServerKey: urlB64ToUint8Array("BO3Jr3L3pKHVPp7SnEpmelRfoI-9T7o1FtIMleCDemAku_U83dTK--h_3JRPoXxFoHaUUr8h-noipUpNtgMVe4g"),
        });
      })
      .then((subscription) => {
        console.log("sub2");
        fetch("/api/auth/save-subscription", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch((error) => {
        console.error("Error during subscription:", error);
      });
  };

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPermissionGranted(true);
      console.log("sub");
      await subscribe();
    } else {
      console.log("Permission denied for notifications.");
    }
  };

  const handleToggle = (e) => {
    setIsChecked((pre) => ({ ...pre, [e.target.value]: e.target.checked }));
  };

  useEffect(() => {
    if (isChecked.notification) {
      requestPermission();
    }
  }, [isChecked]);

  return (
    <div>
      <div className="bg-gray-200 rounded-lg  sm:p-8 h-[90vh] overflow-y-scroll overflow-x-clip">
        <div className="bg-white rounded-lg shadow-xl pb-8">
          <div x-data="{ openSettings: false }" className="absolute right-12 mt-4 rounded"></div>
          <div className="w-full h-[150px]">
            <img src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg" className="w-full h-full object-cover rounded-tl-lg rounded-tr-lg" />
          </div>
          <div className="flex flex-col items-center -mt-20">
            <img src={avatarSrc} className="w-32 border-4 border-white rounded-full" />
            <div className="flex flex-col items-center space-x-2 mt-2">
              <p className="text-2xl">{userName && userName.toUpperCase()}</p>
              <span className="bg-blue-500 rounded-full p-1 w-4" title="Verified">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-100 h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                </svg>
              </span>
            </div>
          </div>
          <div style={isInstallable ? {} : { alignItems: "end", marginRight: "10px", justifyContent: "end" }} className="flex  gap-2 justify-between mt-2 px-10 text-lg">
            {isInstallable && (
              <button onClick={handleInstallClick} className="flex items-center bg-weblue hover:opacity-75 text-gray-100 px-[14px] py-2 rounded text-sm space-x-2 transition duration-100">
                <svg className="-ms-0.5 me-1.5 h-4 w-4" fill="#000000" viewBox="-4 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.031 17.969l-0.094 0.063c-0.469 0.25-0.781 0.438-0.906 0.438-0.094 0.031-0.156 0.063-0.219 0.094-0.219-0.406-0.844-1.625-1.781-3.25-1.125-2.063-4.344-9.656-4.438-9.969-0.063-0.313 0-0.625 0.219-0.75 0.031-0.031 0.094-0.031 0.156-0.031 0.188 0 0.406 0.125 0.531 0.219 0.188 0.156 3.844 5.75 5.813 9.313 1.188 2.156 1.594 2.938 1.75 3.219-0.063 0.031-0.125 0.063-0.188 0.125-0.125 0.156-0.563 0.406-0.75 0.5h-0.031zM11.031 8.594l0.406 0.219c0.688 0.375 0.844 1.188 0.5 1.875l-2.719-1.563c0.25-0.438 0.719-0.688 1.156-0.688 0.25 0 0.469 0.031 0.656 0.156zM11.5 11.438l0.031 0.031c0.094 0.031 0.094 0.188 0.063 0.25s-0.094 0.094-0.156 0.094h-0.125l-0.031-0.031-0.094 0.156h0.031c0.094 0.063 0.125 0.156 0.094 0.25-0.063 0.063-0.094 0.094-0.156 0.094-0.031 0-0.063 0-0.094-0.031l-0.031-0.031-0.188 0.344 0.031 0.031c0.063 0.031 0.094 0.156 0.063 0.219s-0.094 0.094-0.156 0.094c-0.031 0-0.063 0-0.094-0.031h-0.031l-0.094 0.156 0.031 0.031c0.094 0.063 0.125 0.156 0.063 0.25-0.031 0.063-0.063 0.094-0.125 0.094-0.031 0-0.063-0.031-0.094-0.031l-0.031-0.031-0.094 0.125-0.125 0.219-2.719-1.563 0.125-0.219 0.094-0.125-0.031-0.031c-0.094-0.031-0.125-0.188-0.063-0.25 0.031-0.063 0.063-0.094 0.125-0.094 0.031 0 0.063 0 0.094 0.031h0.031l0.094-0.125-0.031-0.031c-0.094-0.063-0.125-0.156-0.063-0.25 0.031-0.063 0.094-0.094 0.156-0.094 0.031 0 0.063 0.031 0.094 0.031l0.031 0.031 0.188-0.344h-0.031c-0.094-0.063-0.125-0.156-0.063-0.25 0.031-0.063 0.063-0.094 0.125-0.094 0.031 0 0.063 0.031 0.094 0.031l0.031 0.031 0.094-0.188-0.031-0.031c-0.094-0.031-0.125-0.156-0.063-0.219 0.031-0.063 0.094-0.094 0.156-0.094h0.125l0.031 0.031 0.125-0.219 2.719 1.563zM1.75 22l5.375-9.313 2.719 1.594-5.5 9.5c-0.469-0.188-0.938-0.438-1.375-0.688-0.438-0.281-0.906-0.594-1.313-0.906l0.031-0.094zM0 20.625v-4.656h4.156l-2.719 4.656h-1.438zM16.281 19.625l0.438 0.656 0.156 0.156 0.094 0.188h-9.719l2.719-4.656h4.344c1.063 1.906 1.719 3.156 1.719 3.188 0.063 0.094 0.094 0.156 0.156 0.188 0.031 0.094 0.063 0.219 0.094 0.281zM20.531 18.125l-0.281-0.656c-0.063-0.094-0.094-0.156-0.156-0.219-0.031-0.094-0.063-0.188-0.094-0.25l-0.25-0.5c-0.094-0.156-0.188-0.313-0.313-0.531h4.563v4.656h-2.344c0-0.031-0.031-0.094-0.031-0.156l-0.344-0.719c-0.031-0.063-0.063-0.156-0.125-0.219 0-0.094-0.031-0.156-0.063-0.219l-0.313-0.719c-0.031-0.063-0.125-0.125-0.156-0.188-0.031-0.094-0.063-0.219-0.094-0.281zM20.406 20.156l0.313 0.625 0.031 0.094s-0.469 0.406-0.875 0.625-0.969 0.406-0.969 0.406l-0.094-0.125-0.344-0.563v-0.25l-0.25-0.188-0.469-0.656v-0.219l-0.219-0.156-0.25-0.406-0.156-0.25c0.219-0.031 0.594-0.188 1.156-0.5 0.031 0 0.031-0.031 0.063-0.031s0.031-0.031 0.063-0.031c0.469-0.25 0.813-0.469 0.969-0.688l0.125 0.281 0.188 0.406v0.344l0.219 0.125 0.313 0.719-0.031 0.313zM20.938 21.563l2.625 3.938c0.344 0.625 0.031 1.375-0.594 1.719-0.219 0.125-0.469 0.188-0.688 0.188-0.438 0-0.844-0.188-1.094-0.594l-1.906-4.344c0.219-0.094 0.594-0.25 0.906-0.406 0.25-0.156 0.563-0.344 0.75-0.5zM1 26.906l-0.156 0.281c-0.031 0.063-0.125 0.094-0.219 0.094h-0.031c-0.031 0-0.063 0-0.063-0.031-0.031 0-0.031-0.031-0.063-0.031-0.063-0.063-0.063-0.188-0.031-0.25l0.156-0.281 0.906-3.813c0.375 0.281 0.781 0.563 1.156 0.781s0.781 0.406 1.188 0.563z"></path>
                </svg>
                <span>GetApp</span>
              </button>
            )}
            <button className="flex items-center bg-red-600 hover:bg-red-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
              <svg className="-ms-0.5 me-1.5 h-4 w-4" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z"
                  fill="#FFFFFF"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="my-4  flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
          <div className="w-full flex flex-col ">
            <div className="flex-1 bg-white rounded-lg shadow-xl p-3 sm:p-8">
              <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
              <ul className="w-full mt-2 text-gray-700">
                <li className="flex border-y py-2">
                  <span className="font-bold w-24 ">Full name:</span>
                  <span className="text-gray-700 ml-2 sm:ml-0 overflow-scroll">{userName}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Email:</span>
                  <span className="text-gray-700 ml-2 sm:ml-0 overflow-scroll">{email ? email : "Not provided"}</span>
                </li>
                <li className="flex border-b py-2">
                  <span className="font-bold w-24">Languages:</span>
                  <span className="text-gray-700 ml-2 sm:ml-0">English</span>
                </li>
                <Link href={"/profile/delivery"}>
                  <button className="flex items-center mt-3 bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded text-sm space-x-2 transition duration-100">
                    <svg className="-ms-0.5 me-1.5 h-6 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
                    </svg>
                    <span>EditProfile</span>
                  </button>
                </Link>
              </ul>
            </div>
          </div>
        </div>
        <div className="my-4  flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
          <div className="w-full flex flex-col ">
            <div className="flex-1 bg-white rounded-lg shadow-xl p-3 sm:p-8">
              <h4 className="text-xl text-gray-900 font-bold">Options</h4>
              <ul className="w-full mt-2 text-gray-700">
                <li className="flex border-y py-2">
                  <span className="font-bold w-24 mr-2">Notification:</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input onChange={handleToggle} checked={isChecked.notification} type="checkbox" value="notification" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <NavBarChatBox />
    </div>
  );
}
