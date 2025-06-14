"use client";

import { useEffect, useState } from "react";
import { getEmoteByGroup, updateEmotes } from "../utility/emotesLocal";

export type EmojiData = {
  name: string;
  character: string;
  _id: string;
};

export default function EmoteKeyBoard({ setTextMessage }: { setTextMessage: React.Dispatch<React.SetStateAction<string>> }) {
  const [group, setGroup] = useState(["Loading...."]);
  const [emoji, setEmoji] = useState<EmojiData[]>([]);
  const [selectedGroup, setSelectGroup] = useState<string>();
  const [loading, setLoading] = useState(false);

  const getEmotes = async (groupName: string) => {
    const dbPromise = await getEmoteByGroup(groupName);
    if (dbPromise) {
      setEmoji(dbPromise);
    } else {
      try {
        setLoading(true);
        const res = await fetch("/api/getEmote", { method: "POST", body: JSON.stringify({ groupName }) });
        if (res.status === 200) {
          const { emotes } = await res.json();
          setEmoji(emotes.emotesArray);
          updateEmotes(emotes.groupName, emotes.emotesArray);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
  };
  const getGroups = async () => {
    try {
      const res = await fetch("/api/getEmoteGroup");
      if (res.status === 200) {
        const data = await res.json();
        const group = data.group;
        setGroup(group);
        setSelectGroup(group[0]);
      }
    } catch {}
  };
  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    getEmotes(selectedGroup);
  }, [selectedGroup]);
  return (
    <div className="py-8 h-[40svh] bottom-0 max-w-screen vw:max-w-viewWidth px-4">
      <div>
        {group && (
          <div className="flex mx-auto gap-5 w-full overflow-x-auto whitespace-nowrap py-4 px-3 text-bold text-lg bg-white">
            {group.map((groupName, index) => (
              <button disabled={loading} onClick={() => setSelectGroup(groupName)} style={selectedGroup === groupName ? { opacity: 1 } : { opacity: 0.5 }} key={index} className="shrink-0">
                {groupName.split("-")[0].toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {emoji && (
          <div className="overflow-y-scroll w-full px-4 grid gap-3 grid-cols-6 h-[37svh] bg-white">
            {emoji.map((item, index) => (
              <button onClick={() => setTextMessage((pre) => pre + item.character)} className="text-3xl" key={index}>
                {item.character}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
