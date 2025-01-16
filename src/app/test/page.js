"use client";

import { useEffect, useRef } from "react";

export default function TestPage() {
  // Function to get a cookie by name
  function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    console.log(document.cookie);
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null; // Return null if cookie is not found
  }

  const scrollPage = useRef();
  useEffect(() => {
    let session = getCookie("session");
    console.log(session);
  }, []);
  return (
    <div className="h-[80vh] overflow-scroll" ref={scrollPage}>
      <div className="h-[300vh]"></div>
      <div>bottom</div>
    </div>
  );
}
