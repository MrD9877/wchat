import { ReceiptEuro } from "lucide-react";
import { connectIndexDb, IndexStores } from "./IndexDbConnect";
import { EmojiData } from "@/components/EmoteKeyBoard";

export const updateEmotes = async (group: string, array: EmojiData[]) => {
  let stores: IndexStores | null = null;
  let transaction: IDBTransaction | null = null;

  const data = await connectIndexDb();

  if (data) {
    stores = data.stores;
    transaction = data.transaction;
  }

  if (!stores || !transaction) return;

  stores.emoteStore.put({ groupName: group, emotesArray: array });

  transaction.oncomplete = function () {
    console.log("Transaction completed successfully");
  };

  transaction.onerror = function () {
    console.error("Transaction failed", transaction.error);
  };
};

// export const getEmoteByGroup = async (group: string):Promise<string[]|null> => {
//   let stores: IndexStores | null = null;
//   let transaction: IDBTransaction | null = null;

//   const data = await connectIndexDb();

//   if (data) {
//     stores = data.stores;
//     transaction = data.transaction;
//   }

//   if (!stores || !transaction) return null;

//   const findGroup = stores.emoteStore.get(group);
//   let returnData: string;

//   findGroup.onsuccess = function () {
//     const emotes = findGroup.result;
//     if (emotes) {
//       returnData = structuredClone(emotes.emotesArray);
//     }
//   };

//   transaction.oncomplete = function () {
//     console.log("Transaction completed successfully");
//     return returnData;
//   };

//   transaction.onerror = function () {
//     console.error("Transaction failed", transaction.error);
//     return null;
//   };
// };
export const getEmoteByGroup = async (group: string): Promise<EmojiData[] | null> => {
  const data = await connectIndexDb();
  if (!data) return null;

  const { stores } = data;
  const request = stores.emoteStore.get(group);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const result = request.result;
      if (result?.emotesArray) {
        resolve(structuredClone(result.emotesArray));
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      console.error("Failed to fetch emotes group:", request.error);
      reject(null);
    };
  });
};
