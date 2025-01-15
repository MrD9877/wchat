import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function FriendPageMain({ page }) {
  const [request, setRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isPending, setPending] = useState([]);
  const router = useRouter();
  const popTost = (msg, success) => {
    let emote = "❌";
    if (success) emote = "✅";
    toast(`${msg}`, {
      icon: `${emote}`,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };
  const getData = async () => {
    try {
      const res = await fetch("/api/auth/userFriends", { method: "GET" });
      if (res.status === 200) {
        const { requests, friends } = await res.json();
        console.log(friends);
        setRequest(requests);
        setFriends(friends);
      }
    } catch {}
  };
  const handleSendRequest = async (email, index) => {
    console.log(index);
    setPending((pre) => ({ ...pre, [email]: true }));
    try {
      const res = await fetch("/api/auth/acceptfriendrequest", { method: "POST", body: JSON.stringify({ email }) });
      if (res.status === 200) {
        setRequest((pre) => {
          let temp = [...pre];
          console.log(temp);
          temp.splice(index, 1);
          return temp;
        });
      } else if (res.status === 404) {
        popTost(404);
      } else {
        const { msg } = await res.json();
        popTost(msg);
      }
      setPending((pre) => ({ ...pre, [email]: undefined }));
    } catch {
      setPending((pre) => ({ ...pre, [email]: undefined }));
    }
  };
  const handleFriend = (userId) => {
    router.push(`/chatpage/${userId}`);
  };
  useEffect(() => {
    getData();
  }, [page]);
  if (page === "friends") {
    return (
      <div className="px-4 py-2 max-h-[75vh] overflow-scroll">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="divide-y divide-gray-200 ">
          {friends.length > 0 ? (
            friends.map((friend, index) => {
              return (
                <button onClick={() => handleFriend(friend.userId)} key={index} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                  <div className="flex items-center">
                    <Image className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-01_pfck4u.jpg" width="32" height="32" alt="Marie Zulfikar" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{friend.name}</h4>
                      <div className="text-[13px]">The video chat ended · 2hrs</div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="w-fit mx-auto my-6">No Friends Fround</div>
          )}
        </div>
      </div>
    );
  }
  if (page === "request") {
    return (
      <div>
        <Toaster position="top-center" reverseOrder={false} />
        <div>
          {request.length > 0 ? (
            <div className=" sm:w-auto  max-w-md p-2 px-2 mx-2 bg-white max-h-[70vh] overflow-scroll my-6">
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 ">
                  {request.map((user, index) => {
                    const userEmail = user.email;
                    return (
                      <li key={index} className="p-3 sm:p-4 ">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <img className="w-8 h-8 rounded-full" src={"/getStarted.png"} alt="Neil image" />
                          </div>
                          <div className="flex-1 min-w-0 ms-4 max-w-[60%] overflow-x-scroll">
                            <p className="text-sm font-medium text-black truncate ">Email: {user.email}</p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">Name: {user.name}</p>
                          </div>
                          <div className="flex flex-col ml-3">
                            {isPending[userEmail] === undefined ? (
                              <button style={{ width: "75px" }} onClick={() => handleSendRequest(userEmail, index)} className="weButton ">
                                Accept
                              </button>
                            ) : (
                              <button disabled type="button" className="weButton ">
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4  text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="#1C64F2"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <div className="w-fit mx-auto my-10">No friends Request</div>
          )}
        </div>
      </div>
    );
  }
}
