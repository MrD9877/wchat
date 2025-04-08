"use client"; // Make sure this code runs only on the client-side

import { useEffect, useState } from "react";
import { urlB64ToUint8Array } from "./b64ToUint8";

const NotificationButton = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [key, setKey] = useState();

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

  const showNotification = () => {
    if (Notification.permission === "granted") {
      console.log("grant");
      new Notification("Hello from PWA!", {
        body: "This is a custom notification!",
        icon: "/icons/icon-192.png",
      });
    } else {
      console.log("Permission not granted for notifications.");
    }
  };

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPermissionGranted(true);
      // Get the FCM token after permission is granted
    } else {
      console.log("Permission denied for notifications.");
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
        console.log("Push subscription:", subscription);
        setKey(subscription.endpoint);
        // Send the subscription object to your server
        // This is typically done via an API POST request
        fetch("/api/save-subscription", {
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
  return (
    <div>
      {permissionGranted ? (
        <>
          <button onClick={showNotification}>Show Notification</button>
          <button onClick={subscribe}>Subcribe</button>
          {key && <div className="mx-auto my-2 p-4 bg-weblue text-white">{key}</div>}
        </>
      ) : (
        <>
          <button onClick={requestPermission} className="text-blue-600 p-2 bg-black">
            Permit
          </button>
          <p>Notifications are not enabled. Please allow notifications.</p>
        </>
      )}
    </div>
  );
};

export default NotificationButton;
