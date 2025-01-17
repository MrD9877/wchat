"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { handleNewFriend } from "../utility/updateFriend";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { getDisplayTime } from "../utility/convertTime";

export default function Chatlog() {
  const [friends, setFriends] = useState([]);
  const [newMessage, setNewMessages] = useState({});
  const [lastMessage, setLastMessage] = useState({});
  const router = useRouter();
  const handleIndexDb = () => {
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    if (!indexedDB) {
      console.log("IndexedDB could not be found in this browser.");
    }
    // 2
    const request = indexedDB.open("wchat", 1);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };

    request.onupgradeneeded = function () {
      const db = request.result;
      const friends = db.createObjectStore("friends", { keyPath: "userId" });
      const chats = db.createObjectStore("chats", { keyPath: "chatId" });
    };

    request.onsuccess = function () {
      console.log("Database opened successfully");
      const db = request.result;
      // 1
      const transaction = db.transaction(["friends", "chats"], "readwrite");
      //2
      const friendStore = transaction.objectStore("friends");
      const chatStore = transaction.objectStore("chats");
      //3
      //   store.put({ id: 1, colour: "Red", make: "Toyota" });
      //4
      const findFriend = friendStore.getAll();

      // 5
      findFriend.onsuccess = function () {
        const friends = findFriend.result;
        setFriends([...structuredClone(friends)]);
        friends.forEach((friend) => {
          setNewMessages((pre) => {
            const temp = { ...pre };
            temp[friend.userId] = friend.newMessages;
            return temp;
          });
        });
      };
      transaction.oncomplete = function () {
        console.log("Transaction completed successfully");
      };

      transaction.onerror = function () {
        console.error("Transaction failed", transaction.error);
      };
    };
  };
  useEffect(() => {
    handleIndexDb();
    function handleNewMessage(msg) {
      setLastMessage((pre) => {
        const temp = { ...pre };
        temp[msg.user] = { message: msg.message, date: new Date() };
        return temp;
      });
      setNewMessages((pre) => {
        const temp = { ...pre };
        if (temp[msg.user]) {
          temp[msg.user] += 1;
        } else {
          temp[msg.user] = 1;
        }
        return temp;
      });
    }
    socket.on("chat message", handleNewMessage);
  }, []);

  return (
    <div className="overflow-scroll">
      <div className="py-3 px-5">
        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
        {/* <!-- Chat list --> */}
        <div className="divide-y divide-gray-200">
          {/* <!-- User --> */}
          {friends &&
            friends.length > 0 &&
            friends.map((friend) => {
              console.log(friend);
              if (!friend.name || !friend.profilePic) {
                handleNewFriend(friend.userId).then(() => {
                  console.log("done");
                });
              }

              return (
                <button key={friend.userId} onClick={() => router.push(`chatpage/${friend.userId}`)} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                  <div className="flex items-center">
                    <Image className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-01_pfck4u.jpg" width="32" height="32" alt="Marie Zulfikar" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{friend.name}</h4>
                      <div className="text-[13px]">
                        {lastMessage[friend.userId] ? (
                          <>
                            <span className="opacity-70">{lastMessage[friend.userId].message} </span>
                            <span className="text-weblue">&middot;{getDisplayTime(lastMessage[friend.userId].date)}</span>
                          </>
                        ) : (
                          friend.lastMessage && (
                            <>
                              <span className="opacity-70">{friend.lastMessage.message} </span>
                              <span className="text-weblue">&middot;{getDisplayTime(friend.lastMessage.date)}</span>
                            </>
                          )
                        )}
                      </div>
                    </div>
                    `{newMessage && newMessage[friend.userId] && <div className="absolute right-10 bg-weblue px-2 text-[12px] text-white py-0.5 rounded-full">{newMessage[friend.userId]}</div>}
                  </div>
                </button>
              );
            })}
          {/* <!-- User --> */}
          <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
            <div className="flex items-center">
              <Image className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-02_vll8uv.jpg" width="32" height="32" alt="Nhu Cassel" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Nhu Cassel</h4>
                <div className="text-[13px]">Hello Lauren 👋, · 24 Mar</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
