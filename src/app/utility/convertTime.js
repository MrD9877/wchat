export function convertTime(string) {
  // Get hours and minutes
  const now = new Date(string);
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Adjust 0 hour to 12

  // Add leading zero for minutes if necessary
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  // Format as hh:mm AM/PM
  const formattedTime = `${hours}:${minutes} ${period}`;
  return formattedTime;
}

export function getDate(string) {
  const now = new Date(string);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();

  // Format as hh:mm AM/PM
  const formattedTime = `${date} ${month} ${year}`;
  return formattedTime;
}
