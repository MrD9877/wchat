import { deleteTokens } from "@/action/deleteToken";
import { exportPublicKeyBase64, getKeysForFirstTime } from "./Encription";
import { signIn } from "./singIn";

export async function logoutfn() {
  return await deleteTokens();
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
