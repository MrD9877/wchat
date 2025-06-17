"use client";
import { verify } from "@/action/verify";
import { getKeysForFirstTime, getKeysFromDb } from "@/utility/Encription";

import React from "react";

const s = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiZGh1cnV2YmFuc2FsNzFAZ21haWwuY29tIiwibmFtZSI6IkRodXJ1diBCYW5zYWwiLCJwcm9maWxlUGljIjoiY2NkNTk0MmJiYmVjMmM3ZSIsInVzZXJJZCI6IjExMTk5NTQ4MDIxOTI3ODMwNjIwMCJ9LCJpYXQiOjE3NTAxNTg2MTksImV4cCI6MTgzNjU1ODYxOX0.3C6GMxtM7Lbbmt7RZyUkuS1kLJtYIVzRMyKj8axc5jc";

export default function Page() {
  const handler = async () => {
    console.log(await verify(s, "hellothisisasecreatsoenjoy"));
  };
  return (
    <div>
      <button onClick={handler}>Click</button>
    </div>
  );
}
