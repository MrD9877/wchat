"use client";
import Camera from "@/components/Camera";
import { setLoading, UserState } from "@/redux/Slice";
import { uploadProfilePic } from "@/utility/uploadProfilePic";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function EditProfileCameraPage() {
  const profilePicId = useSelector((state: UserState) => state.profilePic);
  const dispatch = useDispatch();
  const router = useRouter();

  const sendImage = async (dataUri: string) => {
    await uploadProfilePic(dataUri, profilePicId);
    toast(`Profile image updated successfully.
         Please refresh the page to see the changes`);
    dispatch(setLoading(false));
    window.location.replace("/setting");
  };

  return (
    <div>
      <Camera sendImage={sendImage} />
    </div>
  );
}
