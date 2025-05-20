import { ItemSelected } from "@/app/(siteRoutes)/chatpage/[chatId]/page";
import React, { useState } from "react";
import useLongPress from "./useLongPress";

const ItemsType = ["text", "image", "audio", "video"] as const;
type AllowedType = (typeof ItemsType)[number];

export default function useSelectItem() {
  const [itemSelected, setItemSelected] = useState<ItemSelected>();

  const clearSelected = () => {
    setItemSelected(undefined);
  };

  const handleLongPress = (e: HTMLDivElement) => {
    const type = e.dataset["type"];
    const content = e.dataset["content"];
    const index = Number(e.dataset["index"]);
    const id = e.dataset["id"];
    if (typeof content !== "string" || !type || !ItemsType.includes(type as AllowedType)) return;
    setItemSelected({ type: type as AllowedType, content, index, id });
  };

  const longPressEvents = useLongPress((e) => handleLongPress(e), 600); // 600ms delay
  return { itemSelected, longPressEvents, clearSelected } as const;
}
