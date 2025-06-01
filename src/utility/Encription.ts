"use client";
import { generateKeyPairSync, publicEncrypt, privateDecrypt } from "crypto";

type CryptoKeys = { publicKey?: CryptoKey; privateKey?: CryptoKey };

export function openChatDB() {
  return new Promise((resolve: (r: IDBDatabase) => void, reject) => {
    const request = indexedDB.open(`encrypt`, 1);

    request.onupgradeneeded = function () {
      const db = request.result;
      db.createObjectStore("keys", { keyPath: "type" });
    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };
  });
}

export const getKeysFromDb = async () => {
  const db = await openChatDB();
  const tx = db.transaction("keys", "readwrite");
  const store = tx.objectStore("keys");
  const request = store.getAll();
  const keys = new Promise((res: (r: CryptoKeys | false) => void, rej: (r: boolean | "error") => void) => {
    request.onsuccess = () => {
      const data: { type: "publicKey" | "privateKey"; value: CryptoKey }[] | undefined | null = request.result;
      if (data && data.length >= 2) {
        const temp: CryptoKeys = {};
        data.forEach((item) => {
          temp[item.type] = item.value;
        });
        res(temp);
      } else res(false);
    };
    request.onerror = () => rej("error");
  });
  const data = await keys;
  return data;
};

export async function generateEncryptionKeys(): Promise<{
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export const generateKeysAndSave = async () => {
  const { publicKey, privateKey } = await generateEncryptionKeys();
  const db = await openChatDB();
  const tx = db.transaction("keys", "readwrite");
  const store = tx.objectStore("keys");
  await Promise.all([store.put({ type: "publicKey", value: publicKey }), store.put({ type: "privateKey", value: privateKey })]);
  await new Promise((res: (r: true) => void, rej: (r: false) => void) => {
    tx.oncomplete = () => res(true);
    tx.onerror = () => rej(false);
  });
  return { publicKey, privateKey } as const;
};

export const getKeysForFirstTime = async () => {
  const keysInDb = await getKeysFromDb();
  if (keysInDb) return keysInDb;
  else {
    const keys = await generateKeysAndSave();
    console.log(keys);
    return keys;
  }
};

export async function encryptMessage({ message, publicKey }: { publicKey: CryptoKey; message: string }): Promise<string> {
  const encoded = new TextEncoder().encode(message);
  const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, encoded);

  // Convert ArrayBuffer to Base64 safely
  const buffer = new Uint8Array(encrypted);
  const binary = buffer.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
  return btoa(binary);
}

export async function decryptOne(encryptedString: string | undefined, privateKey: CryptoKey): Promise<string | undefined> {
  if (!encryptedString) return;
  const encrypted = Uint8Array.from(atob(encryptedString), (c) => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, encrypted);
  return new TextDecoder().decode(decrypted);
}

export async function exportPublicKeyBase64(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("spki", key); // spki = format for public key
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  return btoa(exportedAsString); // Base64 encode
}
export async function Base64ToPublicKey(base64: string): Promise<CryptoKey> {
  // Decode base64 to ArrayBuffer
  const binaryString = atob(base64);
  const binaryData = new Uint8Array([...binaryString].map((char) => char.charCodeAt(0)));

  return await window.crypto.subtle.importKey(
    "spki", // Public key format
    binaryData.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true, // extractable
    ["encrypt"] // usage
  );
}
