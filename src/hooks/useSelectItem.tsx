import { ItemSelected } from "@/app/(siteRoutes)/chatpage/[chatId]/page";
import React, { useState } from "react";
import useLongPress from "./useLongPress";

export default function useSelectItem() {
  const [itemSelected, setItemSelected] = useState<ItemSelected>();

  const clearSelected = () => {
    setItemSelected(undefined);
  };

  const handleLongPress = (e: HTMLDivElement) => {
    const type = e.dataset["type"];
    const content = e.dataset["content"];
    const ItemsType = ["text", "image", "audio", "video"] as const;
    type AllowedType = (typeof ItemsType)[number];
    if (typeof content !== "string" || !type || !ItemsType.includes(type as AllowedType)) return;
    setItemSelected({ type: type as AllowedType, content });
  };

  const longPressEvents = useLongPress((e) => handleLongPress(e), 600); // 600ms delay
  return { itemSelected, longPressEvents, clearSelected } as const;
}
