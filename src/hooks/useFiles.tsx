"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

export default function useFiles() {
  const [files, setFile] = useState<File[] | null>(null);
  const [src, setSrc] = useState<string[]>([]);

  const fileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFile(fileArray);
    }
  };

  const updateSrc = () => {
    if (!files) return;
    files.forEach((file) => {
      const render = new FileReader();
      render.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setSrc((pre) => [...pre, result]);
        }
      };
      render.readAsDataURL(file);
    });
  };
  useEffect(() => {
    if (files) {
      updateSrc();
    }
  }, [files]);
  return { src, setSrc, files, setFile, fileSelected } as const;
}
