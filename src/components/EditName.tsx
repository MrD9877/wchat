"use client";
import { UserState } from "@/redux/Slice";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function EditName({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>> }) {
  const router = useRouter();
  const [data, setData] = useState("");
  const { name } = useSelector((state: UserState) => ({ email: state.email, name: state.name }));

  useEffect(() => {
    if (name) {
      setData(name);
    }
  }, [name]);

  const saveChange = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BASE}/api/auth/editProfile`, { method: "POST", body: JSON.stringify({ newName: data }) });
      console.log(res);
      if (res.ok) {
        router.back();
      }
    } catch {}
  };

  return (
    <div className="bg-white h-[100svh] w-screen absolute top-0 z-50">
      <div className="text-xl gap-4 flex my-4 mx-4 items-center">
        <button onClick={() => router.back()}>
          <MoveLeft />
        </button>
        Name
      </div>
      <div className="w-screen flex justify-center">
        <div className="px-2 py-3 border border-weblue w-fit rounded-lg">
          <input className="px-1 border-0 outline-none" type="text" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
      </div>
      <div className="absolute bottom-98 w-screen flex justify-center">
        <button className="bg-weblue px-22 py-1 rounded-2xl text-lg text-white" onClick={saveChange}>
          Save
        </button>
      </div>
    </div>
  );
}
