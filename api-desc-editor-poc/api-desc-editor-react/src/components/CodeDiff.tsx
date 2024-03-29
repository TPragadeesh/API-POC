import DiffViewer from "react-diff-viewer";
import useCommitStore from "../store/useCommitStore";
import { getValueForKey } from "../indexedDB/getValueForKey";
import { useEffect, useState } from "react";
import { serviceBaseURL } from "../helpers/Constants";
import axios from "axios";
import { getStringFromCharArray } from "../utilities/getCharCodes";
import useDarkThemeStore from "../store/useDarkThemeStore";

const CodeDiff = () => {
  const { indexedDBKey } = useCommitStore();
  const { theme } = useDarkThemeStore();
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");

  let axiosClient = axios.create({
    baseURL: serviceBaseURL,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

  useEffect(() => {
    if (indexedDBKey) {
      getValueForKey(indexedDBKey).then((fileDetails) => {
        if (fileDetails) {
          axiosClient
            .get("/getFileContent?name=" + fileDetails.url)
            .then((response) => {
              setOldValue(atob(response.data));
              setNewValue(getStringFromCharArray(fileDetails.content));
            });
        }
      });
    }
  }, [indexedDBKey]);

  return (
    <>
      <DiffViewer
        oldValue={oldValue}
        newValue={newValue}
        useDarkTheme={theme}
        splitView={true}
      ></DiffViewer>
    </>
  );
};

export default CodeDiff;
