"use client";

import Camera from "@/components/Camera";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();
  const [image, setImage] = useState<boolean>(false);

  function toggle() {
    document.startViewTransition(() => {
      setImage(!image);
    });
  }

  return <Camera />;
}
