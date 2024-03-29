import { Button, Text, Textarea, Tooltip, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { openConn } from "../indexedDB/openConn";
import {
  indexDBStoreName,
  indexDBReadWriteMode,
  indexDBKey,
  serviceBaseURL,
} from "../helpers/Constants";
import { getFileNameFromPath } from "../utilities/getGitHubRepoName";
import useRepoStore from "../store/useRepoStore";
import { ChangedFiles } from "../model/ChangedFiles";
import { ChangedFileDetails, CommitPayload } from "../model/CommitPayload";
import { getValueForKey } from "../indexedDB/getValueForKey";
import axios from "axios";
import { getStringFromCharArray } from "../utilities/getCharCodes";
import IndexedDBService from "../services/IndexedDBService";
import useCommitStore from "../store/useCommitStore";

const CommitFiles = () => {
  const { currentRepo } = useRepoStore();
  const { setIndexedDBKey } = useCommitStore();
  const [changedFiles, setChangedFiles] = useState<ChangedFiles[]>([]);
  const [value, setValue] = useState("");

  let axiosClient = axios.create({
    baseURL: serviceBaseURL,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

  useEffect(() => {
    openConn().then((db) => {
      const transaction = db.transaction(
        [indexDBStoreName],
        indexDBReadWriteMode
      );
      const objectStore = transaction.objectStore(indexDBStoreName);

      const getAllKeysRequest = objectStore.getAllKeys();

      getAllKeysRequest.onsuccess = () => {
        let fileNameList: string[] = [];
        let changedFilesArray: ChangedFiles[] = [];
        for (const path of getAllKeysRequest.result) {
          let filePath = path.toString();
          if (filePath.startsWith(indexDBKey + currentRepo)) {
            changedFilesArray.push({
              fileName: getFileNameFromPath(filePath),
              filePath: filePath.replace(indexDBKey + currentRepo + "/", ""),
              fullPath: filePath,
            });
            fileNameList.push(getFileNameFromPath(path.toString()));
          }
        }
        setChangedFiles(changedFilesArray);
      };

      getAllKeysRequest.onerror = (event) => {
        console.log(event);
        console.error("Error fetching data from database");
      };
    });
  }, []);

  const commitAndPush = async () => {
    if (value) {
      let changedFileDetails: ChangedFileDetails[] = [];

      for (let file of changedFiles) {
        await getValueForKey(file.fullPath).then((fileDetails) => {
          changedFileDetails.push({
            contents: btoa(getStringFromCharArray(fileDetails.content)),
            path: fileDetails.path,
          });
        });
      }

      if (changedFileDetails.length > 0) {
        let commitPayload: CommitPayload = {
          repoName: currentRepo.split("/")[1],
          owner: currentRepo.split("/")[0],
          commitMessage: value,
          changedFileDetails: changedFileDetails,
        };

        axiosClient
          .post(serviceBaseURL + "/pushChanges", commitPayload)
          .then((res) => {
            if (res.data) {
              setValue("");
              let indexedDBService = new IndexedDBService();

              for (let file of changedFiles) {
                indexedDBService.deleteEntryFromDB(file.fullPath);
              }
              setChangedFiles([]);
            }
          })
          .catch((error) => {
            console.log(error);
            window.alert("Unable to commit changes.");
          });
      }
    } else {
      window.alert("Kindly enter commit message");
    }
  };

  return (
    <VStack padding={5} alignItems="start">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Message..."
      ></Textarea>
      <Button
        colorScheme="blue"
        size="md"
        width="100%"
        height={30}
        fontSize={14}
        onClick={commitAndPush}
      >
        Commit & Push
      </Button>
      <Text color="teal" fontSize={14}>
        Changes
      </Text>
      {changedFiles.length > 0 &&
        changedFiles.map((file, index) => (
          <Tooltip label={file.filePath} key={index}>
            <Text
              key={index}
              fontSize={14}
              cursor={"pointer"}
              onClick={() => setIndexedDBKey(file.fullPath)}
            >
              {file.fileName}
            </Text>
          </Tooltip>
        ))}
    </VStack>
  );
};

export default CommitFiles;
