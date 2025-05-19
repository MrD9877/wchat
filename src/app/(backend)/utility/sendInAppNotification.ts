"use server";

export type InAppNotificationData = {
  userId: string;
} & (
  | {
      notification: { from: string };
      type: "friend Request";
    }
  | {
      type: "new message";
      notification: { from: string; message: string; type: "image" | "video" | "audio" | "message" };
    }
  | {
      type: "friend request accepted";
      notification: { from: string };
    }
);

export async function sendInAppNotification(data: InAppNotificationData) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/notification`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LOCAL_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch {}
}
