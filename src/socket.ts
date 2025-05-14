"use client";

import { io } from "socket.io-client";

// const URL = "https://wchatsocket-production.up.railway.app/";
const URL = "http://localhost:4000";

export const socket = io(URL);
