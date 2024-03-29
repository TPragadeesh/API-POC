import { indexDBFileStoreName, indexDBReadWriteMode } from "../helpers/Constants";
import { fileStoreOpenConn } from "./fileStoreOpenConn";


export const getDirectoryHandle = (key: string) => {
    return new Promise<any>((resolve, reject) => {
      fileStoreOpenConn().then((db)=>{
        const transaction = db.transaction([indexDBFileStoreName],indexDBReadWriteMode);
        const objectStore = transaction.objectStore(indexDBFileStoreName);
        
        const directoryHandle = objectStore.get(key);
  
        directoryHandle.onsuccess = () => {
            resolve(directoryHandle.result);
        };
  
        directoryHandle.onerror = () => {
            reject("Unable to retrieve data with key: ");
        };
      });
    });
  };