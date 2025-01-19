"use client";
import WeButton from "@/app/utility/WeButton";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const handleNext = () => {
    router.push("/register");
    console.log("Next");
  };
  return (
    <div className="bg-white h-screen flex flex-col justify-center items-center">
      <div className="flex flex-col gap-10">
        <Image width={200} height={200} src={"/getStarted.png"} alt="" />
        <div className="w-52">
          <p className="text-xl text-center  text-gray-900">Welcome to WeChat platform to chat with your friends</p>
        </div>
      </div>
      <div className="absolute w-screen bottom-20">
        <WeButton handler={handleNext} btnText={"NEXT"} />
      </div>
    </div>
  );
}
