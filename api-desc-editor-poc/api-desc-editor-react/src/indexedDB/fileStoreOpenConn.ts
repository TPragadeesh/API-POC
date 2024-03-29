import { indexDBName, indexDBFileStoreName } from "../helpers/Constants";

export const fileStoreOpenConn = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(indexDBName, 1);
  
        request.onerror = (event: Event) => {
          console.log(event);
          reject("Error opening database");
        };
  
        request.onsuccess = (event: Event) => {
          const db = (event.target as IDBRequest).result as IDBDatabase;
          resolve(db);
        };
  
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBRequest).result as IDBDatabase;
          db.createObjectStore(indexDBFileStoreName);
        };
      });
}