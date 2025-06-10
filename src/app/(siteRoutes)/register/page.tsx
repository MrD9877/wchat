"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircleUserRound, House } from "lucide-react";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/Slice";
import { handleOauhSignIn } from "@/utility/logout";
import { getCookie } from "@/utility/getCookie";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState(false);

  useEffect(() => {
    const token = getCookie("refreshToken");
    if (token) setToken(true);
  }, []);

  const [error, submitAction, isPending] = useActionState(async (previousState: unknown, formData: FormData) => {
    const data = Object.fromEntries(formData);
    let name = (data.name as string).trim().toLowerCase();
    let email = (data.email as string).trim().toLowerCase();
    try {
      const res = await fetch("/api/register", { method: "POST", credentials: "include", body: JSON.stringify({ name, email }) });
      if (res.status === 201) {
        router.push(`/verify?email=${email}`);
      } else if (res.status === 400) {
        const data = await res.json();
        toast(data.msg);
      } else if (res.status === 500) {
        toast("Internal server Error");
      } else {
        toast(`Error ${res.statusText}`);
      }
    } catch {
      toast("Server not responding");
    } finally {
      dispatch(setLoading(false));
      return null;
    }
  }, null);

  useEffect(() => {
    if (isPending) dispatch(setLoading(isPending));
  }, [isPending, dispatch]);
  return (
    <>
      <div className="h-[100svh] w-screen flex justify-center items-center text-black bg-weblue px-4">
        <form className="form" action={submitAction}>
          <div className="flex-column">
            <label>Username </label>
          </div>
          <div className="inputForm">
            <CircleUserRound height={20} width={20} />

            <input type="text" className="input" name="name" id="name" placeholder="Enter your Name" />
          </div>
          <div className="flex-column">
            <label>Email </label>
          </div>
          <div className="inputForm">
            <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
              <g id="Layer_3" data-name="Layer 3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
              </g>
            </svg>
            <input type="text" className="input" name="email" id="email" placeholder="Enter your Email" />
          </div>
          <button className="button-submit">Register</button>
          <p className="p">
            Already have an account{" "}
            <Link className="span " href={"/login"}>
              Login
            </Link>
          </p>
          <p className="p line">Or With</p>

          <div className="flex-row">
            <button className="btn google" type="button" onClick={async () => await handleOauhSignIn("google")}>
              <svg version="1.1" width="20" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" enableBackground={"new 0 0 512 512"}>
                <path
                  style={{ fill: "#FBBB00" }}
                  d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
      c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
      C103.821,274.792,107.225,292.797,113.47,309.408z"
                ></path>
                <path
                  style={{ fill: "#518EF8" }}
                  d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
      c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
      c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                ></path>
                <path
                  style={{ fill: "#28B446" }}
                  d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
      c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
      c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                ></path>
                <path
                  style={{ fill: "#F14336" }}
                  d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
      c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
      C318.115,0,375.068,22.126,419.404,58.936z"
                ></path>
              </svg>
              Google
            </button>
            {token && (
              <button className="btn google" type="button" onClick={() => router.push("/")}>
                <House />
                Home
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
