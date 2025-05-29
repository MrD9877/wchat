/* eslint-disable @next/next/no-img-element */
import { X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

export default function OpenProfilePic({ url, setUrl }: { url: string; setUrl: Dispatch<SetStateAction<string | undefined>> }) {
  return (
    <div className="absolute top-0 w-screen h-[100svh] z-[140] bg-black/60 flex justify-center items-center">
      <div className="absolute top-10 right-10 z-[150]" onClick={() => setUrl(undefined)}>
        <X stroke="white" width={40} height={40} />
      </div>
      <img style={{ viewTransitionName: `open ${url}` }} src={url} alt="profile pic" className="max-h-[70svh] max-w-screen" />
    </div>
  );
}
