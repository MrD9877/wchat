/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useEffect, useState } from "react";
type Props = React.HTMLAttributes<HTMLDivElement>;
type ClassName = Pick<Props, "className">;
export default function ImageWithFallBack({ src, alt, width, height, className }: { src: string; alt: string; width: number; height: number; className: ClassName["className"] }) {
  const [imageSrc, setImageSrc] = useState<string>("/getStarted.png");
  useEffect(() => {
    setImageSrc(src);
  }, [src]);
  return <img src={imageSrc} alt={alt} width={width} height={height} className={`object-fill ${className}`} onError={() => setImageSrc("/getStarted.png")} />;
}
