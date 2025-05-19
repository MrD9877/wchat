"use client";

import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();

// const URL = "https://wchatsocket-production.up.railway.app/";
const URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

export const socket = io(URL);
