import { urlB64ToUint8Array } from "@/utility/b64ToUint8";
import React, { useEffect, useState } from "react";

export default function NotificationSetting() {
  const [isChecked, setIsChecked] = useState<{ [string: string]: boolean }>({});

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
      await subscribe();
    }
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked((pre) => ({ ...pre, [e.target.value]: e.target.checked }));
  };

  useEffect(() => {
    if (isChecked.notification) {
      requestPermission();
    }
  }, [isChecked]);

  return (
    <div className="my-4  flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
      <div className="w-full flex flex-col ">
        <div className="flex-1 bg-white rounded-lg shadow-xl p-3 sm:p-8">
          <h4 className="text-xl text-gray-900 font-bold">Options</h4>
          <ul className="w-full mt-2 text-gray-700">
            <li className="flex border-y py-2">
              <span className="font-bold w-24 mr-2">Notification:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input onChange={handleToggle} checked={isChecked["notification"] || false} type="checkbox" value="notification" className="sr-only " />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
