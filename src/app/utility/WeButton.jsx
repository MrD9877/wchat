"use client";
export default function WeButton({ handler = () => {}, btnText, btnDisable = false, type = "button" }) {
  return (
    <div className="mx-auto flex justify-center ">
      <button type={type} disabled={btnDisable} onClick={handler} className="bg-weblue text-white py-4 rounded-3xl px-36 disabled:opacity-35">
        {btnText}
      </button>
    </div>
  );
}
