"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import peer from "@/utility/peer";
import { socket } from "@/socket";
import { getCookie } from "../utility/getCookie";
import { Friend, ItemSelected } from "@/app/(siteRoutes)/chatpage/[chatId]/page";
import { CopyIcon, Trash2Icon, X } from "lucide-react";
import { copyToClipboard } from "@/utility/copyToClipboard";

export default function ChatPageTop({ friend, room, itemSelected, clearSelected }: { friend: Friend | undefined; room: string | undefined; itemSelected: ItemSelected | undefined; clearSelected: () => void }) {
  // const userId = useSelector((state) => state.userId);
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const OpenProfile = () => {
    router.push("/");
  };

  const handleVideoCall = async () => {
    if (!peer.peer) {
      peer.closeConnection();
      await peer.initializePeerConnection();
    }
    const offer = await peer.getOffer();
    const accessToken = getCookie("accessToken");
    socket.emit("call", { to: room, offer, accessToken, type: "video" });
    router.push(`/videoCall/${room}`);
  };

  const handleVoiceCall = async () => {
    if (!peer.peer) {
      peer.closeConnection();
      await peer.initializePeerConnection();
    }
    const offer = await peer.getOffer();
    const accessToken = getCookie("accessToken");
    socket.emit("call", { to: room, offer, accessToken, type: "voice" });
    router.push(`/VoiceCall/${room}`);
  };
  return (
    <>
      <div className="bg-weblue h-[8svh] fixed top-0 w-screen flex justify-between items-center px-4 rounded-b-3xl">
        <div className="flex items-center gap-4">
          {/* back  */}
          <div>
            <button onClick={handleBack}>
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.75 7.50156H3.925L8.4625 2.05157C8.67467 1.79629 8.77675 1.46719 8.74628 1.13666C8.7158 0.806128 8.55527 0.501239 8.3 0.289065C8.04473 0.0768921 7.71563 -0.0251853 7.3851 0.00528938C7.05456 0.035764 6.74967 0.196295 6.5375 0.451565L0.2875 7.95156C0.245451 8.01122 0.207849 8.07389 0.175 8.13907C0.175 8.20157 0.175 8.23907 0.0875002 8.30157C0.0308421 8.44489 0.0011764 8.59745 0 8.75156C0.0011764 8.90568 0.0308421 9.05824 0.0875002 9.20156C0.0875002 9.26406 0.0874998 9.30157 0.175 9.36407C0.207849 9.42924 0.245451 9.49191 0.2875 9.55157L6.5375 17.0516C6.65503 17.1927 6.8022 17.3061 6.96856 17.3839C7.13491 17.4617 7.31636 17.5019 7.5 17.5016C7.79207 17.5021 8.07511 17.4004 8.3 17.2141C8.42657 17.1091 8.5312 16.9803 8.60789 16.8348C8.68458 16.6894 8.73183 16.5303 8.74692 16.3665C8.76202 16.2028 8.74466 16.0377 8.69586 15.8807C8.64705 15.7237 8.56775 15.5779 8.4625 15.4516L3.925 10.0016H18.75C19.0815 10.0016 19.3995 9.86987 19.6339 9.63545C19.8683 9.40103 20 9.08309 20 8.75156C20 8.42004 19.8683 8.1021 19.6339 7.86768C19.3995 7.63326 19.0815 7.50156 18.75 7.50156Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          {/* profile pic  */}
          <button onClick={OpenProfile}>
            <Image className="rounded-full items-start flex-shrink-0 " src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-01_pfck4u.jpg" width="36" height="36" alt="Marie Zulfikar" />
          </button>
          {/* name  */}
          <div className="text-white text-lg">{(friend && friend.name) || ""}</div>
        </div>
        {itemSelected ? (
          <div className="flex items-center gap-5 justify-center mr-3 text-white">
            {itemSelected.type === "text" && (
              <button
                className="hover:text-blue-800"
                onClick={() => {
                  copyToClipboard(itemSelected.content);
                  clearSelected();
                }}
              >
                <CopyIcon />
              </button>
            )}
            <button
              className="hover:text-red-800"
              onClick={() => {
                clearSelected();
              }}
            >
              <Trash2Icon />
            </button>
            <button onClick={clearSelected}>
              <X />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 justify-center">
            <div>
              {/* call  */}
              <button onClick={handleVoiceCall}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.33073 2.16538H7.19202L8.75867 6.08257L6.24141 7.76074C6.09317 7.85964 5.97164 7.99361 5.88759 8.15074C5.80355 8.30788 5.75959 8.48334 5.75961 8.66154C5.76286 8.76331 5.75961 8.66262 5.75961 8.66262V8.68536C5.76018 8.73378 5.76234 8.78216 5.76611 8.83044C5.77261 8.91922 5.78343 9.0394 5.804 9.18773C5.84623 9.48005 5.92743 9.88282 6.0855 10.357C6.40382 11.3098 7.02745 12.543 8.24223 13.7578C9.45701 14.9726 10.6902 15.5962 11.6419 15.9145C12.1172 16.0726 12.5189 16.1527 12.8134 16.196C12.9796 16.2192 13.1469 16.2336 13.3146 16.2393L13.3287 16.2404H13.3374C13.3374 16.2404 13.4586 16.2339 13.3385 16.2404C13.5395 16.2403 13.7365 16.1842 13.9074 16.0785C14.0784 15.9727 14.2165 15.8215 14.3064 15.6417L15.0318 14.1908L19.8346 14.992V19.6693C17.5491 19.9995 11.3755 20.3254 6.52508 15.4749C1.67462 10.6245 1.99942 4.44987 2.33073 2.16538ZM8.00403 9.18773L9.96046 7.88417C10.3738 7.60848 10.6797 7.19906 10.827 6.72456C10.9742 6.25007 10.9538 5.73937 10.7692 5.27813L9.20258 1.36094C9.04181 0.959163 8.76434 0.614769 8.40597 0.372188C8.0476 0.129608 7.62477 -2.90091e-05 7.19202 4.86911e-09H2.27443C1.29026 4.86911e-09 0.364558 0.683179 0.203237 1.75071C-0.164879 4.17811 -0.664 11.3477 4.99415 17.0058C10.6523 22.664 17.8219 22.1638 20.2493 21.7968C21.3168 21.6344 22 20.7097 22 19.7256V14.992C22.0001 14.4795 21.8183 13.9835 21.487 13.5923C21.1557 13.2012 20.6964 12.9402 20.1908 12.8559L15.388 12.0558C14.9312 11.9795 14.462 12.0517 14.0493 12.2618C13.6365 12.4719 13.302 12.8087 13.0949 13.2229L12.7202 13.9732C12.5878 13.9406 12.4567 13.9027 12.3272 13.8595C11.656 13.6365 10.7238 13.1774 9.77316 12.2268C8.82255 11.2762 8.36349 10.344 8.14046 9.67169C8.08721 9.51276 8.04204 9.35123 8.00512 9.18773H8.00403Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
            {/* vedio call */}
            <div>
              <button onClick={handleVideoCall}>
                <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.7886 2.57871C22.4242 2.41463 22.0196 2.36126 21.6251 2.42523C21.2306 2.4892 20.8636 2.6677 20.5697 2.93853L17.991 5.33733V3.5982C17.991 2.6439 17.6119 1.72868 16.9371 1.05389C16.2623 0.379095 15.3471 0 14.3928 0H3.5982C2.6439 0 1.72868 0.379095 1.05389 1.05389C0.379095 1.72868 0 2.6439 0 3.5982V13.1934C0 14.1477 0.379095 15.0629 1.05389 15.7377C1.72868 16.4125 2.6439 16.7916 3.5982 16.7916H14.3928C15.3471 16.7916 16.2623 16.4125 16.9371 15.7377C17.6119 15.0629 17.991 14.1477 17.991 13.1934V11.4543L20.5817 13.8531C20.9631 14.1983 21.4586 14.3905 21.973 14.3928C22.2585 14.3921 22.5406 14.3308 22.8006 14.2129C23.1544 14.0698 23.4574 13.8245 23.6711 13.5083C23.8847 13.1921 23.9992 12.8194 24 12.4378V4.35382C23.9983 3.97084 23.882 3.59714 23.6661 3.28079C23.4502 2.96445 23.1446 2.71993 22.7886 2.57871ZM15.5922 13.1934C15.5922 13.5115 15.4658 13.8166 15.2409 14.0415C15.016 14.2664 14.7109 14.3928 14.3928 14.3928H3.5982C3.2801 14.3928 2.97503 14.2664 2.7501 14.0415C2.52517 13.8166 2.3988 13.5115 2.3988 13.1934V3.5982C2.3988 3.2801 2.52517 2.97503 2.7501 2.7501C2.97503 2.52517 3.2801 2.3988 3.5982 2.3988H14.3928C14.7109 2.3988 15.016 2.52517 15.2409 2.7501C15.4658 2.97503 15.5922 3.2801 15.5922 3.5982V13.1934ZM21.5892 11.5142L18.2189 8.3958L21.5892 5.27736V11.5142Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
            {/* vectors  */}
            <div>
              <button>
                <svg width="4" height="17" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.69231 14.1538C3.69231 14.6435 3.4978 15.1131 3.15158 15.4593C2.80536 15.8055 2.33578 16 1.84615 16C1.35652 16 0.886947 15.8055 0.540726 15.4593C0.194505 15.1131 0 14.6435 0 14.1538C0 13.6642 0.194505 13.1946 0.540726 12.8484C0.886947 12.5022 1.35652 12.3077 1.84615 12.3077C2.33578 12.3077 2.80536 12.5022 3.15158 12.8484C3.4978 13.1946 3.69231 13.6642 3.69231 14.1538ZM3.69231 8C3.69231 8.48963 3.4978 8.95921 3.15158 9.30543C2.80536 9.65165 2.33578 9.84615 1.84615 9.84615C1.35652 9.84615 0.886947 9.65165 0.540726 9.30543C0.194505 8.95921 0 8.48963 0 8C0 7.51037 0.194505 7.04079 0.540726 6.69457C0.886947 6.34835 1.35652 6.15385 1.84615 6.15385C2.33578 6.15385 2.80536 6.34835 3.15158 6.69457C3.4978 7.04079 3.69231 7.51037 3.69231 8ZM3.69231 1.84615C3.69231 2.33578 3.4978 2.80536 3.15158 3.15158C2.80536 3.4978 2.33578 3.69231 1.84615 3.69231C1.35652 3.69231 0.886947 3.4978 0.540726 3.15158C0.194505 2.80536 0 2.33578 0 1.84615C0 1.35652 0.194505 0.886948 0.540726 0.540727C0.886947 0.194506 1.35652 0 1.84615 0C2.33578 0 2.80536 0.194506 3.15158 0.540727C3.4978 0.886948 3.69231 1.35652 3.69231 1.84615Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="h-[8svh]"></div>
    </>
  );
}
