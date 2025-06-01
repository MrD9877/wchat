import { exportPublicKeyBase64, getKeysForFirstTime } from "./Encription";
import { signIn } from "./singIn";

export function logoutfn() {
  "use client";
  document.cookie = `accessToken=; Max-Age=0; path=/;`;
  document.cookie = `refreshToken=; Max-Age=0; path=/;`;
}

export async function deleteInvalidCache() {
  try {
    const cache = await caches.delete(`${process.env.NEXT_PUBLIC_URL_BASE}/api/auth/getUser`);
    return cache;
  } catch {}
}
export const handleOauhSignIn = async (provider: "google" | "discord") => {
  const keys = await getKeysForFirstTime();
  if (keys.publicKey) {
    const publicKey = await exportPublicKeyBase64(keys.publicKey);
    await signIn(provider, publicKey);
  }
};
