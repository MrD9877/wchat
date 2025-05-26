import { subscribe, unsubscribe } from "@/utility/subcribeNotification";
import React, { useEffect, useState } from "react";

export default function NotificationSetting() {
  const [isChecked, setIsChecked] = useState(false);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await subscribe();
    }
  };

  useEffect(() => {
    (async () => {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setIsChecked(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (isChecked) {
      requestPermission();
    } else {
      unsubscribe();
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
                <input onChange={(e) => setIsChecked(e.target.checked)} checked={isChecked || false} type="checkbox" value="notification" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
