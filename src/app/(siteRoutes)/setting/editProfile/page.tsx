"use client";
import Loading from "@/components/Loading";
import { UserState } from "@/redux/Slice";
import { ArrowLeftSquare, CameraIcon, GalleryHorizontal, Images, LucideProps, MoveLeft, Trash2Icon, User, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function EditOptionsCard({ text, children, callbackfn }: { text: string; children: React.ReactNode; callbackfn: () => void }) {
  return (
    <div className="border border-gray-500 rounded-xl flex justify-center items-center flex-col p-3" onClick={callbackfn}>
      {children}
      {text}
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState("");
  const { name } = useSelector((state: UserState) => ({ email: state.email, name: state.name }));
  const edit = searchParams.get("edit");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit === "userName" && name) {
      setData(name);
    }
  }, [name, edit]);

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

  if (edit === "profilePic")
    return (
      <div className="absolute z-30 h-[100svh] w-screen bg-black/20 flex items-end flex-col">
        <div className="h-[78svh] w-screen" onClick={() => router.back()}></div>
        <div className="bg-white w-screen h-[22svh] rounded-t-3xl px-6 py-4">
          <div className="flex justify-between text-gray-500 py-2">
            <button onClick={() => router.back()}>
              <X />
            </button>
            Profile Photo
            <button>
              <Trash2Icon />
            </button>
          </div>
          <div className="flex justify-between my-2">
            <EditOptionsCard text="Camera" callbackfn={() => router.push("camera")}>
              <CameraIcon className="text-green-500" />
            </EditOptionsCard>
            <EditOptionsCard text="Gallery" callbackfn={() => console.log("camera")}>
              <Images className="text-green-500" />
            </EditOptionsCard>
            <EditOptionsCard text="Avatar" callbackfn={() => console.log("camera")}>
              <User className="text-green-500" />
            </EditOptionsCard>
          </div>
        </div>
      </div>
    );
  if (loading) return <Loading />;
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
