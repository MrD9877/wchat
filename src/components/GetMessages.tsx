"use client";
import React, { useState, useEffect, useActionState } from "react";
import { socket } from "@/socket"; // Import socket from the singleton
import { generateRandom } from "../app/(backend)/utility/random";
import { areDatesOnSameDay, getFriend } from "../utility/getFriend";
import { handleNewFriend } from "../utility/updateFriend";
import { onUpgrade } from "../utility/indexDbFunctions";

export default function GetMessages() {
  const handleIndexDb = (msg: string, userId: string, image?: Buffer, audio?: Buffer) => {
    const indexedDB = window.indexedDB;
    if (!indexedDB) {
      console.log("IndexedDB could not be found in this browser.");
    }
    // 2
    const request = indexedDB.open("wchat", 1);
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };

    request.onupgradeneeded = onUpgrade;
    request.onsuccess = function () {
      console.log("Database opened successfully");
      const db = request.result;
      // 1
      const transaction = db.transaction(["friends", "chats"], "readwrite");
      //2
      const friendStore = transaction.objectStore("friends");
      const chatStore = transaction.objectStore("chats");
      const findFriend = friendStore.get(userId);
      findFriend.onsuccess = function () {
        const date = new Date();
        const messageToSave = { date, message: msg, user: userId, image, audio };
        const friend = findFriend.result;
        const chatId = generateRandom(32);
        if (!friend) {
          const chat = { chatId: chatId, date: date };
          friendStore.put({ userId, chats: [{ ...chat }], lastMessage: { message: audio ? "audio" : msg, date } });
          handleNewFriend(userId);
          chatStore.put({ chatId, chats: [{ ...messageToSave }] });
        } else {
          const allChats = friend.chats;
          const lastChatDate = allChats[allChats.length - 1].date;
          const sameDay = areDatesOnSameDay(lastChatDate, date);
          if (sameDay) {
            const findChat = chatStore.get(allChats[allChats.length - 1].chatId);
            findChat.onsuccess = function () {
              const chats = findChat.result;
              const allChats = chats.chats;
              allChats.push({ ...messageToSave });
              findChat.result.chats = [...allChats];
              chatStore.put(findChat.result);
              findFriend.result.lastMessage = { message: msg, date };
              friendStore.put(findFriend.result);
            };
          } else {
            const chat = { chatId: chatId, date: date };
            friend.chats.push(chat);
            findFriend.result.chats = [...friend.chats];
            findFriend.result.lastMessage = { message: msg, date };
            friendStore.put(findFriend.result);
            chatStore.put({ chatId, chats: [{ ...messageToSave }] });
          }
        }
      };
      transaction.oncomplete = function () {
        console.log("Transaction completed successfully");
      };

      transaction.onerror = function () {
        console.error("Transaction failed", transaction.error);
      };
    };
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleNewMessage = ({ message, user, image, audio }: { message: string; user: string; image?: Buffer; audio?: Buffer }) => {
      handleIndexDb(message, user, image, audio);
    };
    socket.on("chat message", handleNewMessage);
    return () => {
      socket.off("chat message", handleNewMessage);
    };
  }, []);
  return [];
}
