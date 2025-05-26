"use client";
import { socket } from "@/socket";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getCookie } from "../utility/getCookie";
import { useRouter } from "next/navigation";
import AudioRecorder from "./AudioRecording";
import AudioInputUI from "./AudioInputUI";
import AttachPhotoUI from "./AttachPhotoUI";
import { UserState } from "@/redux/Slice";
import useFiles from "@/hooks/useFiles";
import { SavedDbMessages, saveMessageForUser } from "@/utility/saveAndRetrievedb";
import { generateRandom } from "@/app/(backend)/utility/random";
import { updateFriend } from "@/utility/updateFriend";
import { uploadImageAndGetUrl } from "@/utility/uploadAndGetUrl";

interface ChatInputComponent {
  room: string;
  textMessage: string;
  setTextMessage: Dispatch<SetStateAction<string>>;
  setChat: Dispatch<SetStateAction<SavedDbMessages[]>>;
  showInput: () => void;
  emojiKeyBoard: boolean;
  setEmojiKeyBoard: Dispatch<SetStateAction<boolean>>;
  clearTimer: () => void;
  scrollToBottom: () => void;
}

export default function ChatpageInput({ scrollToBottom, clearTimer, setChat, room, setTextMessage, textMessage, showInput, emojiKeyBoard, setEmojiKeyBoard }: ChatInputComponent) {
  const [sendVisible, setSendVisible] = useState(false);
  const userId = useSelector((state: UserState) => state.userId);
  const router = useRouter();
  const textInput = useRef<HTMLInputElement>(null);
  const [audioRecording, setAudioRecording] = useState(false);
  const [changesInInpur, setChanges] = useState(false);
  const { src, setSrc, files, setFile, fileSelected } = useFiles();
  const audioRecorder = AudioRecorder({ audioRecording, room, setChat });
  void audioRecorder;

  const handleExpire = async () => {
    // const res = await fetch("/api/refreshAuth");
    // if (res.status === 200) {
    //   const accessToken = getCookie("accessToken");
    //   sendMsg();
    // } else {
    //   router.push("/login");
    // }
  };

  const sendMsg = async () => {
    console.log("send");
    if (src.length < 1 && textMessage === "") return;
    const image = src.length > 0 ? src : undefined;
    const urls: string[] = [];
    if (!userId || !room) return;
    if (image) {
      for (let i = 0; i < image.length; i++) {
        const dataUri = image[i];
        const url = await uploadImageAndGetUrl({ image: dataUri });
        if (url) urls.push(url);
      }
    }
    const id = generateRandom(16);
    setChat((pre) => [...pre, { message: textMessage, sender: true, id, userId: room, timestamp: Date.now(), image, audio: undefined, video: undefined }]);
    // save in localstorage
    try {
      await saveMessageForUser(userId, { message: textMessage, image, audio: undefined, video: undefined, sender: true, id }, room);
      await updateFriend({ clientId: userId, userId: room, image, message: textMessage, audio: undefined });
    } catch (err) {
      console.log(err);
    }
    const accessToken = getCookie("accessToken");
    socket.emit("private message", room, { message: textMessage, accessToken, image: urls.length > 0 ? urls : undefined, id });
    socket.on("tokenExpire", handleExpire);
    setTextMessage("");
    setSrc([]);
    setFile(null);
    scrollToBottom();
  };

  const handleEmote = () => {
    if (!textInput.current) return;
    if (emojiKeyBoard) {
      textInput.current.focus();
      setEmojiKeyBoard(false);
    } else {
      textInput.current.blur();
      setEmojiKeyBoard(true);
    }
  };

  const handleStartAudioRecord = () => {
    setAudioRecording(true);
  };
  const handleEndAudio = () => {
    setAudioRecording(false);
  };

  useEffect(() => {
    if (files) return;
    const inputFocus = document.activeElement === textInput.current;
    if (textMessage !== "" || inputFocus) {
      setSendVisible(true);
    } else {
      setSendVisible(false);
    }
  }, [textMessage, textInput, changesInInpur, files]);

  return (
    <div>
      {src.length > 0 && <AttachPhotoUI src={src} setSrc={setSrc} sendMsg={sendMsg} setFile={setFile} />}
      <div className="h-[8%]">
        <div className="flex justify-between  w-screen px-4 gap-2">
          <div className="flex px-4 py-2 gap-3 bg-white rounded-3xl items-center justify-between w-[80%]">
            {audioRecording ? (
              <AudioInputUI />
            ) : (
              <>
                {/* emote  */}
                <button onClick={handleEmote}>
                  {!emojiKeyBoard ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.8284 12.8284C11.2663 14.3905 8.7337 14.3905 7.17157 12.8284M7 8H7.01M13 8H13.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#191919" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 5H16C18.8284 5 20.2426 5 21.1213 5.87868C22 6.75736 22 8.17157 22 11V13C22 15.8284 22 17.2426 21.1213 18.1213C20.2426 19 18.8284 19 16 19H8C5.17157 19 3.75736 19 2.87868 18.1213C2 17.2426 2 15.8284 2 13V11C2 8.17157 2 6.75736 2.87868 5.87868C3.75736 5 5.17157 5 8 5ZM6 10C6.55228 10 7 9.55228 7 9C7 8.44772 6.55228 8 6 8C5.44772 8 5 8.44772 5 9C5 9.55228 5.44772 10 6 10ZM6 13C6.55228 13 7 12.5523 7 12C7 11.4477 6.55228 11 6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13ZM9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13ZM9 10C9.55228 10 10 9.55228 10 9C10 8.44772 9.55228 8 9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10ZM12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10ZM12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13ZM15 10C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8C14.4477 8 14 8.44772 14 9C14 9.55228 14.4477 10 15 10ZM15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13ZM18 10C18.5523 10 19 9.55228 19 9C19 8.44772 18.5523 8 18 8C17.4477 8 17 8.44772 17 9C17 9.55228 17.4477 10 18 10ZM18 13C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13ZM17.75 16C17.75 16.4142 17.4142 16.75 17 16.75H7C6.58579 16.75 6.25 16.4142 6.25 16C6.25 15.5858 6.58579 15.25 7 15.25H17C17.4142 15.25 17.75 15.5858 17.75 16Z"
                        fill="#1C274C"
                      />
                    </svg>
                  )}
                </button>
                {/* input  */}
                <input
                  ref={textInput}
                  onBlur={() => {
                    setChanges(!changesInInpur);
                    clearTimer();
                  }}
                  onFocus={() => {
                    setChanges(!changesInInpur);
                    showInput();
                  }}
                  value={textMessage ? textMessage : ""}
                  onChange={(e) => setTextMessage(e.target.value)}
                  className="w-[70%] outline-none px-2 text-lg h-auto overflow-y-scroll"
                  accept="image/*"
                  id=""
                  name="text-input"
                />
                {/* attachment  */}
                <div>
                  <input id="dropzone-file" className="hidden" type="file" onChange={fileSelected} accept="image/*" multiple></input>
                  <label htmlFor="dropzone-file">
                    <svg width="14" height="20" viewBox="0 0 9 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.77163 4.7032L7.77163 13.3583C7.77163 15.0681 6.51999 16.5897 4.81841 16.7533C2.87141 16.9415 1.2271 15.4117 1.2271 13.4974L1.2271 3.38612C1.2271 2.31445 1.99608 1.34095 3.05957 1.2346C4.28667 1.11189 5.31743 2.06903 5.31743 3.27159L5.31743 11.8613C5.31743 12.3112 4.9493 12.6794 4.49937 12.6794C4.04943 12.6794 3.6813 12.3112 3.6813 11.8613L3.6813 4.7032C3.6813 4.36779 3.40316 4.08965 3.06775 4.08965C2.73234 4.08965 2.4542 4.36779 2.4542 4.7032L2.4542 11.7468C2.4542 12.8184 3.22318 13.7919 4.28667 13.8983C5.51377 14.021 6.54453 13.0638 6.54453 11.8613L6.54453 3.41066C6.54453 1.7009 5.29289 0.179295 3.59131 0.0156803C1.63613 -0.172474 0 1.35731 0 3.27159L0 13.3093C0 15.6571 1.71794 17.7595 4.05761 17.9804C6.74905 18.2258 8.99873 16.1316 8.99873 13.4974V4.7032C8.99873 4.36779 8.72059 4.08965 8.38518 4.08965C8.04978 4.08965 7.77163 4.36779 7.77163 4.7032Z"
                        fill="#191919"
                        fillOpacity="0.75"
                      />
                    </svg>
                  </label>
                </div>
                {/* camera  */}
                <div style={{ display: sendVisible ? "none" : "" }}>
                  <Link href={`/camera?room=${room}`}>
                    <svg width="24" height="20" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.8 17.2H17.2C18.1941 17.2 19 16.3941 19 15.4V6.04C19 5.04589 18.1941 4.24 17.2 4.24H14.5L12.25 1H7.75L5.5 4.24H2.8C1.80589 4.24 1 5.04589 1 6.04V15.4C1 16.3941 1.80589 17.2 2.8 17.2Z" stroke="#191919" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 13.5999C11.9882 13.5999 13.6 11.9881 13.6 9.9999C13.6 8.01168 11.9882 6.3999 10 6.3999C8.0118 6.3999 6.40002 8.01168 6.40002 9.9999C6.40002 11.9881 8.0118 13.5999 10 13.5999Z" stroke="#191919" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
          {/* audio  */}
          <div style={{ display: sendVisible ? "none" : "", background: audioRecording ? "green" : "" }} className="bg-weblue px-4 py-2 rounded-full">
            <button onTouchStart={handleStartAudioRecord} onTouchEnd={handleEndAudio}>
              <svg width="18" height="28" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 17.5C11.5609 17.5 13.6364 15.15 13.6364 12.25V5.25C13.6364 2.35 11.5609 0 9 0C6.43909 0 4.36364 2.35 4.36364 5.25V12.25C4.36364 15.15 6.43909 17.5 9 17.5ZM18 12.1875C18 12.05 17.9018 11.9375 17.7818 11.9375H16.1455C16.0255 11.9375 15.9273 12.05 15.9273 12.1875C15.9273 16.5719 12.8264 20.125 9 20.125C5.17364 20.125 2.07273 16.5719 2.07273 12.1875C2.07273 12.05 1.97455 11.9375 1.85455 11.9375H0.218182C0.0981818 11.9375 0 12.05 0 12.1875C0 17.4594 3.45273 21.8094 7.90909 22.425V25.625H3.94636C3.57273 25.625 3.27273 26.0719 3.27273 26.625V27.75C3.27273 27.8875 3.34909 28 3.44182 28H14.5582C14.6509 28 14.7273 27.8875 14.7273 27.75V26.625C14.7273 26.0719 14.4273 25.625 14.0536 25.625H9.98182V22.4406C14.49 21.8781 18 17.5031 18 12.1875Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          {/* send  */}
          <label htmlFor="text-input">
            <div style={{ display: sendVisible ? "" : "none" }} className="bg-weblue px-4 pt-[15px] pb-2 rounded-full">
              <button
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevents focus loss
                  sendMsg();
                }}
                onTouchStart={(e) => {
                  e.preventDefault(); // For mobile
                  sendMsg();
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
          </label>
        </div>
      </div>
    </div>
  );
}
