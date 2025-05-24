import { LoaderCircle, PlayIcon, Volume2 } from "lucide-react";
import React from "react";

export default function DownLoadingAudio() {
  return (
    <div className="px-2.5 my-2 ">
      <div className="w-56 h-10 bg-gray-200 rounded-2xl flex items-center px-3 justify-between">
        <div className="flex gap-2 items-center">
          <PlayIcon fill="black" width={16} />
          0:00
        </div>
        <LoaderCircle className="text-blue-600 animate-spin" />
        <Volume2 className="ml-2" />
      </div>
    </div>
  );
}
