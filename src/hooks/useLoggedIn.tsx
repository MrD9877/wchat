import { getCookie } from "@/utility/getCookie";
import React, { useEffect, useState } from "react";

export default function useLoggedIn() {
  const [logedIn, setLogedIn] = useState(false);

  useEffect(() => {
    const cookie = getCookie("refreshToken");
    if (cookie) {
      setLogedIn(true);
    }
  }, []);
  return logedIn;
}
