export function logoutfn() {
  "use client";
  document.cookie = `accessToken=; Max-Age=0; path=/;`;
  document.cookie = `refreshToken=; Max-Age=0; path=/;`;
}
