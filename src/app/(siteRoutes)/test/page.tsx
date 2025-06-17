"use client";
import { verify } from "@/action/verify";
import { getKeysForFirstTime, getKeysFromDb } from "@/utility/Encription";

import React, { useState } from "react";

const s = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoic2h1YmhhbWJhbnNhbDEyMzVAZ21haWwuY29tIiwibmFtZSI6IlNodWJoYW0gQmFuc2FsIiwicHJvZmlsZVBpYyI6IjYyN2M2OGU5YzRiYTM4OTciLCJ1c2VySWQiOiIxMDk3MzM3ODczNTQ5NzQxNDMxNjAifSwiaWF0IjoxNzUwMTYwMjI5LCJleHAiOjE3NTg4MDAyMjl9.MSm7aZhj8DiQp_DtTOxni8Ooa3gHHhs6H2xOjY-Lb20";

export default function Page() {
  const [state, setState] = useState("");
  const [user, setUser] = useState("");
  const handler = async () => {
    const data = await verify(state, "hellothisisasecreatsoenjoy");
    const user = (data as { user: string }).user;
    setUser(JSON.stringify(user));
  };
  return (
    <div>
      {user}
      <input type="text" value={state || ""} onChange={(e) => setState(e.currentTarget.value)} />
      <button onClick={handler}>Click</button>
    </div>
  );
}
