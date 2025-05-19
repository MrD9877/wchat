import { clearToast, setToast } from "@/redux/Slice";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";

export default function useToast() {
  const dispatch = useDispatch();
  const timer = useRef<NodeJS.Timeout>(null);

  const goToast = (msg: string) => {
    // if (timer.current) {
    //   clearTimeout(timer.current);
    // }
    dispatch(setToast({ message: msg }));
    // timer.current = setTimeout(deleteToast, 5000);
  };
  const deleteToast = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    dispatch(clearToast({}));
  };

  return [goToast, deleteToast] as const;
}
