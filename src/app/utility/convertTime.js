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

export function timeDifference(string1, string2) {
  const date1 = new Date(string1);
  const date2 = new Date(string2);

  const hours1 = date1.getHours();
  const hours2 = date2.getHours();

  const hoursDifference = hours2 - hours1;
  console.log(hoursDifference);

  if (hoursDifference > 0) return `${hoursDifference}hrs ago`;

  const min1 = date1.getMinutes();
  const min2 = date2.getMinutes();

  const minutesDifference = min2 - min1;
  console.log(minutesDifference);
  if (minutesDifference > 0) {
    return `${minutesDifference}min ago`;
  } else {
    return "now";
  }
}

export function getDisplayTime(string) {
  const today = getDate(new Date());
  const msgDate = getDate(string);
  if (msgDate === today) {
    return timeDifference(string, new Date());
  } else {
    const day = new Date(string);
    const options = { month: "short" };
    let date = day.getDate();
    const month = day.toLocaleString("en-US", options).toLowerCase();
    return `${date} ${month}`;
  }
}
