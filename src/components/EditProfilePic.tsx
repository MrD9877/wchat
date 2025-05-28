"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { CameraIcon, Images, Trash2Icon, User, X } from "lucide-react";
import useFiles from "@/hooks/useFiles";
import { uploadProfilePic } from "@/utility/uploadProfilePic";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, UserState } from "@/redux/Slice";
import ImageTaken from "./ImageTaken";
import { toast } from "sonner";

function EditOptionsCard({ text, children, callbackfn }: { text: string; children: React.ReactNode; callbackfn?: () => void }) {
  return (
    <div className="border border-gray-500 rounded-xl flex justify-center items-center flex-col p-3 select-none" onClick={callbackfn}>
      {children}
      {text}
    </div>
  );
}

export default function EditProfilePic() {
  const router = useRouter();
  const { src, fileSelected } = useFiles();
  const profilePicId = useSelector((state: UserState) => state.profilePic);
  const dispatch = useDispatch();

  const sendImage = async (dataUri: string) => {
    await uploadProfilePic(dataUri, profilePicId);
    toast(`Profile image updated successfully.
         Please refresh the page to see the changes`);
    dispatch(setLoading(false));
    router.push("/setting");
  };

  return (
    <div className="absolute z-100 h-[100svh] w-screen bg-black/20 flex items-end flex-col top-0">
      {src.length > 0 ? (
        <ImageTaken dataUri={src[0]} sendImage={sendImage} />
      ) : (
        <>
          <div style={{ viewTransitionName: "EditBox" }} className="h-[78svh] w-screen" onClick={() => router.back()}></div>
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
              <input id="dropzone-file" className="hidden" type="file" onChange={fileSelected} accept="image/*"></input>
              <label htmlFor="dropzone-file">
                <EditOptionsCard text="Gallery">
                  <Images className="text-green-500" />
                </EditOptionsCard>
              </label>
              <EditOptionsCard text="Avatar" callbackfn={() => router.push("avatar")}>
                <User className="text-green-500" />
              </EditOptionsCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
