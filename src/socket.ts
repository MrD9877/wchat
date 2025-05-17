"use client";

import { io } from "socket.io-client";

// const URL = "https://wchatsocket-production.up.railway.app/";
const URL = "https://7wjmvm24-4000.inc1.devtunnels.ms/";

export const socket = io(URL);
