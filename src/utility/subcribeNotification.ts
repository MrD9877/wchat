import { urlB64ToUint8Array } from "./b64ToUint8";

export const unsubscribe = async () => {
  try {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      await existingSubscription.unsubscribe();
    }
    await fetch("/api/auth/save-subscription", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {}
};

export const subscribe = async () => {
  const publickey = process.env.NEXT_PUBLIC_NOTIFICATION_PUBLIC_KEY;
  if (!publickey) return;
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check for an existing subscription
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      await existingSubscription.unsubscribe();
    }

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(publickey),
    });

    // Send to backend to store
    await fetch("/api/auth/save-subscription", {
      method: "POST",
      body: JSON.stringify(newSubscription),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error during subscription:", error);
  }
};
