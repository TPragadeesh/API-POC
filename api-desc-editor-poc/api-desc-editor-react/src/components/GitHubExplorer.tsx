import { VStack, Button, List, Text, Icon, HStack } from "@chakra-ui/react";
import Directory from "./Directory";
import { useEffect, useState } from "react";
import { GitHubRepoTree } from "../model/GitHubRepoTree";
import axios from "axios";
import { GitHubFile } from "../model/GitHubFile";
import { GitHubFileContent } from "../model/GitHubFileContent";
import {
  serviceBaseURL,
  gitHubDefaultMessage,
  openRemoteRepo,
  selectRepository,
  repositories,
  gitHubClientID,
} from "../helpers/Constants";
import { getGitHubRepoName } from "../utilities/getGitHubRepoName";
import { FaArrowLeft } from "react-icons/fa";
import useFileStore from "../store/useFileStore";
import useRepoStore from "../store/useRepoStore";

const GitHubExplorer = () => {
  const { setFileContent, setFileDetails } = useFileStore();
  const { setCurrentRepo } = useRepoStore();
  const [isAuthorized, setAuthorized] = useState(false);
  const [repos, setRepos] = useState<string[]>([]);
  const [explorer, setExplorer] = useState<GitHubRepoTree>({
    name: "",
    path: "",
    sha: "",
    type: "",
    url: "",
  });
  let count = 0;

  let axiosClient = axios.create({
    baseURL: "https://api.rawg.io/api",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });

  function loginWithGithub() {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${gitHubClientID}&scope=user repo`
    );
  }

  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const codeParam = urlParams.get("code");

      if (codeParam) {
        axios
          .get(serviceBaseURL + "/getAccessToken?code=" + codeParam)
          .then((response) => {
            const data = response.data;
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setAuthorized(true);
            }
          });
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("accessToken") !== null) {
      setAuthorized(true);
      axiosClient.get(serviceBaseURL + "/getRepos").then((response) => {
        setRepos(response.data);
      });
    }
  }, [isAuthorized]);

  const getRepoFiles = (repoName: string) => {
    setCurrentRepo(repoName);

    axiosClient
      .get(serviceBaseURL + "/getFiles?name=" + repoName)
      .then((response) => {
        setExplorer({
          name: repoName,
          type: "tree",
          items: displayBetter("", response.data),
          path: "",
          sha: "",
          url: "",
        });
      });

    count = 0;
  };

  const displayBetter = (
    prefixString: string,
    data: GitHubFile[]
  ): GitHubRepoTree[] | null => {
    //display
    let result: GitHubRepoTree[] = [];
    if (prefixString === "folder_level_1_1") console.log("hellowow");
    while (count < data.length) {
      const current = data[count];

      if (current.name.startsWith(prefixString)) {
        if (current.type === "tree") {
          if (prefixString === "folder_level_1_1") console.log("hellowow file");
          let val: GitHubRepoTree = {
            name: current.name.slice(prefixString.length),
            path: current.name,
            sha: current.sha,
            type: current.type,
            url: current.url,
          };
          count++;
          val.items = displayBetter(current.name, data);
          result.push(val);
        } else {
          if (prefixString === "folder_level_1_1")
            console.log("hellowow chekc");
          let val: GitHubRepoTree = {
            name: current.name.slice(prefixString.length),
            path: current.name,
            sha: current.sha,
            type: current.type,
            url: current.url,
          };
          count++;
          result.push(val);
        }
      } else {
        return result;
      }
    }
    return result;
  };

  const getFileContent = (fileDetails: GitHubFileContent) => {
    axiosClient
      .get(serviceBaseURL + "/getFileContent?name=" + fileDetails.url)
      .then((response) => {
        setFileContent(atob(response.data));
        setFileDetails(fileDetails.name, fileDetails.url, fileDetails.path);
      });
  };

  const showRepos = () => {
    setAuthorized(localStorage.getItem("accessToken") !== null);
    setExplorer({
      name: "",
      path: "",
      sha: "",
      type: "",
      url: "",
    });
  };

  return (
    <>
      {!isAuthorized && (
        <VStack>
          <Text fontSize={14} padding={5}>
            {gitHubDefaultMessage}
          </Text>
          <Button
            padding={2}
            colorScheme="blue"
            size="md"
            fontSize={14}
            onClick={loginWithGithub}
          >
            {openRemoteRepo}
          </Button>
        </VStack>
      )}
      {isAuthorized && !explorer.name && (
        <VStack alignItems="start" padding={5}>
          <Text as="b" color="teal">
            {selectRepository}
          </Text>
          {repos.map((repo, index) => (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => getRepoFiles(repo)}
              key={index}
            >
              {getGitHubRepoName(repo)}
            </Button>
          ))}
        </VStack>
      )}

      {explorer.name && (
        <>
          <HStack padding={1} onClick={showRepos} cursor="pointer">
            <Icon color="teal" as={FaArrowLeft} />
            <Text color="teal">{repositories}</Text>
          </HStack>
          <List marginTop={5}>
            <Directory file={explorer} onFileSelect={getFileContent} />
          </List>
        </>
      )}
    </>
  );
};

export default GitHubExplorer;
