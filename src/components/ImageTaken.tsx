import { UserState } from "@/redux/Slice";
import { uploadProfilePic } from "@/utility/uploadProfilePic";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

export default function ImageTaken({ dataUri, setLoading, back }: { dataUri: string; setLoading: React.Dispatch<React.SetStateAction<boolean>>; back?: number }) {
  const profilePicId = useSelector((state: UserState) => state.profilePic);
  const router = useRouter();

  const sendImage = async () => {
    await uploadProfilePic(dataUri, profilePicId);
    if (back) window.history.go(-2);
    else router.back();
  };
  return (
    <>
      <img src={dataUri || ""} alt="capture Image" />
      <div className="bottom-0 absolute">
        <div className="w-screen flex justify-between px-5 py-3 items-center bg-gray-800 ">
          <div className="px-2 py-1 rounded-2xl bg-gray-900">name</div>
          <div className="bg-weblue px-4 pt-[15px] pb-2 rounded-full w-fit">
            <button
              onClick={() => {
                sendImage();
                setLoading(true);
              }}
            >
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.3208 12L19.3208 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M19.3209 1L12.8209 19C12.777 19.0957 12.7066 19.1769 12.6179 19.2338C12.5293 19.2906 12.4262 19.3209 12.3209 19.3209C12.2156 19.3209 12.1125 19.2906 12.0238 19.2338C11.9352 19.1769 11.8647 19.0957 11.8209 19L8.32087 12L1.32087 8.5C1.22513 8.45613 1.144 8.38569 1.08712 8.29705C1.03024 8.20842 1 8.10532 1 8C1 7.89468 1.03024 7.79158 1.08712 7.70295C1.144 7.61431 1.22513 7.54387 1.32087 7.5L19.3209 1Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
