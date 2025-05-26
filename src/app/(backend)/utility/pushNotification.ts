import webpush from "web-push";
export async function sendNotification(subData: webpush.PushSubscription, data: { title: string; body: string }) {
  const publicKey = process.env.NEXT_PUBLIC_NOTIFICATION_PUBLIC_KEY;
  const privateKey = process.env.NOTIFICATION_PRIVATE_KEY;
  if (!publicKey || !privateKey) return;
  webpush.setVapidDetails("mailto:your-email@example.com", publicKey, privateKey);

  const pushSubscription = { ...subData };
  const payload = JSON.stringify({
    title: data.title,
    body: data.body,
  });
  try {
    await webpush.sendNotification(pushSubscription, payload);
  } catch (err) {
    console.log(err);
  }
}
