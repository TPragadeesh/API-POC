import { Button } from "@chakra-ui/react";
import { indexDBReadWriteMode, indexDBStoreName } from "../helpers/Constants";
import { getCharCodes } from "../utilities/getCharCodes";
import { openConn } from "../indexedDB/openConn";

interface Props {
  fileContent: string;
  fileName: string;
}

const IndexedDBTest = ({ fileContent, fileName }: Props) => {
  const handleAddToDatabase = () => {
    openConn().then((db) => {
      const transaction = db.transaction(
        [indexDBStoreName],
        indexDBReadWriteMode
      );
      const objectStore = transaction.objectStore(indexDBStoreName);

      const request = objectStore.put(getCharCodes(fileContent), fileName);

      request.onsuccess = (event) => {
        console.log(event);
        console.log("Data added to database successfully");
      };

      request.onerror = (event) => {
        console.log(event);
        console.error("Error adding data to database");
      };
    });
  };

  return (
    <div>
      <Button onClick={handleAddToDatabase}>Add to IndexedDB</Button>
    </div>
  );
};

export default IndexedDBTest;
