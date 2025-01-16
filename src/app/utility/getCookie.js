export function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  console.log(document.cookie);
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null; // Return null if cookie is not found
}
