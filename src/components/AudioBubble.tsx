import { UserState } from "@/redux/Slice";
import { getMediaInDb } from "@/utility/saveAndRetrievedb";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAndStore } from "./DownLoadImage";
import DownLoadingAudio from "./DownLoadingAudio";

export const AudioBubbleOut = ({ url }: { url: string }) => {
  return (
    <div className="px-2.5">
      <audio controls src={url}></audio>
    </div>
  );
};

export function AudioBubbleIn({ url }: { url: string }) {
  const clientId = useSelector((state: UserState) => state.userId);
  const [src, setSrc] = useState<string>();

  const fetchMedia = async () => {
    const blob = await fetchAndStore(url, clientId);
    if (blob) {
      setSrc(URL.createObjectURL(blob));
    }
  };

  const getMedia = async (clientId: string | undefined, url: string) => {
    if (!clientId) return;
    try {
      const blob = await getMediaInDb(clientId, url);
      return URL.createObjectURL(blob);
    } catch (err) {
      await fetchMedia();
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getMedia(clientId, url);
      if (data) setSrc(data);
    })();
  }, [url, clientId]);

  if (!src) return <DownLoadingAudio />;
  return (
    <div className="px-2.5">
      <audio controls src={src}></audio>
    </div>
  );
}
