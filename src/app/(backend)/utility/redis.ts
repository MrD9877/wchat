"use server";

import { createClient } from "redis";

export async function connectRedis() {
  const client = createClient({
    username: process.env.REDIS_USER_NAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });
  return client;
}
