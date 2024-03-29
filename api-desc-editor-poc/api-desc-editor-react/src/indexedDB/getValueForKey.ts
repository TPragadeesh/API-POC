import { indexDBReadWriteMode, indexDBStoreName } from "../helpers/Constants";
import { openConn } from "./openConn";

export const getValueForKey = (key: string) => {
    return new Promise<any>((resolve, reject) => {
      openConn().then((db)=>{
        const transaction = db.transaction([indexDBStoreName],indexDBReadWriteMode);
        const objectStore = transaction.objectStore(indexDBStoreName);
        
        const getFileDetails = objectStore.get(key);
  
        getFileDetails.onsuccess = () => {
            resolve(getFileDetails.result);
        };
  
        getFileDetails.onerror = () => {
            reject("Unable to retrieve data with key: ");
        };
      });
    });
  };