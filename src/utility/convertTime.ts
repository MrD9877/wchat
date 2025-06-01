const monthsString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function convertTime(string: number) {
  // Get hours and minutes
  const now = new Date(string);
  let hours = now.getHours();
  let minutes: string | number = now.getMinutes();

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

export function getDate(string: number) {
  const now = new Date(string);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();

  // Format as hh:mm AM/PM
  const formattedTime = `${date} ${monthsString[month]} ${year}`;
  return formattedTime;
}

export function timeDifference(string1: number, string2: number) {
  const date1 = new Date(string1);
  const date2 = new Date(string2);

  const hours1 = date1.getHours();
  const hours2 = date2.getHours();

  const hoursDifference = hours2 - hours1;

  if (hoursDifference > 0) return `${hoursDifference}hrs ago`;

  const min1 = date1.getMinutes();
  const min2 = date2.getMinutes();

  const minutesDifference = min2 - min1;
  if (minutesDifference > 0) {
    return `${minutesDifference}min ago`;
  } else {
    return "now";
  }
}

export function getDisplayTime(string: number) {
  const today = getDate(Date.now());
  const msgDate = getDate(string);
  if (msgDate === today) {
    return timeDifference(string, Date.now());
  } else {
    const day = new Date(string);
    let date = day.getDate();
    const month = day.toLocaleString("en-US", { month: "short" }).toLowerCase();
    return `${date} ${month}`;
  }
}
