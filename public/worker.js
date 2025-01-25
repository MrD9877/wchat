// public/service-worker.js
self.addEventListener("push", function (event) {
  const options = {
    body: event.data ? event.data.text() : "No message available",
    icon: "/icons/icon-192.png",
  };

  event.waitUntil(self.registration.showNotification("New Notification", options));
});
