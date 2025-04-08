import webPush from "web-push";

// Generate the VAPID keys
export function createKeys() {
  const vapidKeys = webPush.generateVAPIDKeys();
  console.log("VAPID Public Key:", vapidKeys.publicKey);
  console.log("VAPID Private Key:", vapidKeys.privateKey);
}
