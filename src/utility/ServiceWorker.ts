const ServiceWorkerClass: {
  deferredInstall: null | Event;
  SW: ServiceWorker | null;
  isOnline: boolean;
  init: () => void;
  handleMessage: (ev: MessageEvent<unknown>) => void;
  sendMessage: (ev: string) => void;
  checkOnline: () => void;
  unregister: () => void;
  clearCache: (req: string) => void;
} = {
  SW: null,
  isOnline: typeof navigator !== "undefined" ? "onLine" in navigator && navigator.onLine : false,
  deferredInstall: null,
  async init() {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          type: "module",
        });
        // Wait for the service worker to be active
        ServiceWorkerClass.SW = registration.active || registration.waiting;

        // Make sure to claim the service worker after activation
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (installingWorker.state === "activated") {
                // Service worker is active
                ServiceWorkerClass.SW = installingWorker;
              }
            });
          }
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
      navigator.serviceWorker.addEventListener("message", ServiceWorkerClass.handleMessage);
      navigator.serviceWorker.addEventListener("controllerchange", async () => {
        ServiceWorkerClass.SW = navigator.serviceWorker.controller;
      });
    }
    if ("standalone" in navigator && navigator.standalone) {
    } else if (matchMedia("(display-mode: standalone)").matches) {
    } else {
    }

    window.addEventListener("beforeinstallprompt", (ev) => {
      ev.preventDefault();
      ServiceWorkerClass.deferredInstall = ev;
    });
  },
  unregister: () => {
    if ("serviceWorker" in navigator) {
      // 4. remove/unregister service workers
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          reg.unregister().then((isUnreg) => console.log(isUnreg));
        }
      });
    }
  },

  checkOnline() {
    if ("onLine" in navigator && navigator.onLine) {
      ServiceWorkerClass.sendMessage("confirmOnline");
    } else {
    }
  },

  handleMessage(ev: MessageEvent<unknown>) {
    if (typeof ev.data === "object" && ev.data && "confirmOnline" in ev.data) {
    } else if (typeof ev.data === "string" && ev.data === "not-found") {
    }
  },
  clearCache(url: string) {
    navigator.serviceWorker.controller?.postMessage({ msg: "clearCache", url });
  },
  sendMessage(msg: string) {
    navigator.serviceWorker.controller?.postMessage(msg);
  },
};

export default ServiceWorkerClass;
