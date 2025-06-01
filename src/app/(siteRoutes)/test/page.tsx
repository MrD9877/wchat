"use client";
import { getKeysForFirstTime, getKeysFromDb } from "@/utility/Encription";
import React from "react";

export default function Page() {
  const handler = async () => {
    const keys = await getKeysForFirstTime();
    console.log(keys.privateKey);
    console.log(keys.publicKey);
    const publicKey = JSON.stringify(keys.publicKey);
    console.log(publicKey);
  };
  return (
    <div>
      <button onClick={handler}>Click</button>
    </div>
  );
}
