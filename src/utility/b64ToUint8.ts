export function urlB64ToUint8Array(base64String: string) {
  // Add padding if necessary (base64 URL encoding doesn't include padding characters '=')
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  // Replace URL-safe characters to standard base64 characters
  const base64 = (base64String + padding)
    .replace(/\-/g, "+") // Replace "-" with "+"
    .replace(/_/g, "/"); // Replace "_" with "/"

  // Decode the base64 string into raw binary data
  const rawData = window.atob(base64);

  // Create a Uint8Array to hold the binary data
  const outputArray = new Uint8Array(rawData.length);

  // Populate the Uint8Array with the decoded data
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
