"use client";
import useFiles from "@/hooks/useFiles";
import { uploadImageAndGetUrl } from "@/utility/uploadAndGetUrl";
import React, { useState } from "react";

export default function Page() {
  const { fileSelected, src } = useFiles();
  const [url, setUrl] = useState<string>();
  async function upload() {
    const url = await uploadImageAndGetUrl({ image: src[0] });
    if (url) setUrl(url);
  }
  return (
    <div>
      <input type="file" accept="image/*" onChange={fileSelected} />
      <button onClick={upload}>UPLOAD</button>
      {url && <img src={url} alt="image" />}
    </div>
  );
}
