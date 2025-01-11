"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/chatscreen");
  }, []);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-weblue">
      <div>
        <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M29 56V26C29 25.4477 28.5523 25 28 25H10C4.5 25 0 29.5 0 35V65C0 70.5 4.5 75 10 75H14C14.5523 75 15 75.4477 15 76V87.5858C15 88.4767 16.0771 88.9229 16.7071 88.2929L29.7071 75.2929C29.8946 75.1054 30.149 75 30.4142 75H55C60.5 75 65 70.5 65 65V56.9074C65 56.389 64.5184 56.0061 64 56.005H29.005C29.0022 56.005 29 56.0028 29 56ZM90 0H45C39.5 0 35 4.5 35 10V49C35 49.5523 35.4477 50 36 50H69.5858C69.851 50 70.1054 50.1054 70.2929 50.2929L83.2929 63.2929C83.9229 63.9229 85 63.4767 85 62.5858V51C85 50.4477 85.4477 50 86 50H90C95.5 50 100 45.505 100 40V10C100 4.5 95.5 0 90 0Z"
            fill="white"
          />
          <circle cx="53.8699" cy="25.2858" r="4.39754" fill="#27B1B2" />
          <circle cx="67.0632" cy="25.2858" r="4.39754" fill="#27B1B2" />
          <circle cx="80.2554" cy="25.2858" r="4.39754" fill="#27B1B2" />
        </svg>
      </div>
    </div>
  );
}
