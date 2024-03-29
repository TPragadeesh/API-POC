import { indexDBStoreName, indexDBReadWriteMode, indexDBKey, indexDBFileStoreName } from "../helpers/Constants";
import { fileStoreOpenConn } from "../indexedDB/fileStoreOpenConn";
import { openConn } from "../indexedDB/openConn";
import { getCharCodes } from "../utilities/getCharCodes";

class IndexedDBService{

    updateFileHandlesStore(key:string, directoryHandle: FileSystemDirectoryHandle){
      fileStoreOpenConn().then((db) => {
        const transaction = db.transaction(
          [indexDBFileStoreName],
          indexDBReadWriteMode
        );
        const objectStore = transaction.objectStore(indexDBFileStoreName);

        const request = objectStore.put(directoryHandle, key);

        request.onsuccess = () => {
          console.log("Data added to database successfully.");
        };

        request.onerror = () => {
          console.error("Error adding data to database.");
        };
      });
    }

    updateFileContent(content:string, repoName: string, name: string, path: string, url: string){
      if(repoName && name && path && url){
        openConn().then((db) => {
          const transaction = db.transaction(
            [indexDBStoreName],
            indexDBReadWriteMode
          );
          const objectStore = transaction.objectStore(indexDBStoreName);

          let fileDetails = {
              name: name,
              path: path,
              url: url,
              content: getCharCodes(content)
          }
  
          const request = objectStore.put(fileDetails, indexDBKey + repoName + "/" + path);
  
          request.onsuccess = () => {
            console.log("Data added to database successfully.");
          };
  
          request.onerror = () => {
            console.error("Error adding data to database.");
          };
        });
      }
    }

    deleteFile(repoName: string, path: string){
        this.deleteEntryFromDB(indexDBKey + repoName + "/" + path);
    }

    deleteEntryFromDB(key: string){
      openConn().then((db) => {
        const transaction = db.transaction(
          [indexDBStoreName],
          indexDBReadWriteMode
        );
        const objectStore = transaction.objectStore(indexDBStoreName);

        const request = objectStore.delete(key);

        request.onsuccess = (event) => {
          console.log(event);
          console.log("Deleted successfully.");
        };

        request.onerror = (event) => {
          console.log(event);
          console.error("Error while deleting entry from database.");
        };
      });
    }

    getAllKeys(){
      openConn().then((db) => {
        const transaction = db.transaction(
          [indexDBStoreName],
          indexDBReadWriteMode
        );
        const objectStore = transaction.objectStore(indexDBStoreName);
  
        const getAllKeysRequest = objectStore.getAllKeys();
  
        getAllKeysRequest.onsuccess = () => {
          return getAllKeysRequest.result;
        };
  
        getAllKeysRequest.onerror = (event) => {
          console.log(event);
          console.error("Error fetching data from database");
        };
      });
    }

    getAllFileHandlesKeys(){
      return new Promise<IDBValidKey[]>((resolve, reject)=>{
        fileStoreOpenConn().then((db) => {
          const transaction = db.transaction(
            [indexDBFileStoreName],
            indexDBReadWriteMode
          );
          const objectStore = transaction.objectStore(indexDBFileStoreName);
    
          const getAllKeysRequest = objectStore.getAllKeys();
    
          getAllKeysRequest.onsuccess = () => {
            resolve(getAllKeysRequest.result);
          };
    
          getAllKeysRequest.onerror = (event) => {
            reject("Error fetching keys for File Handle");
            console.log(event);
            console.error("Error fetching data from database");
          };
        });
      })
    }
}

export default IndexedDBService;