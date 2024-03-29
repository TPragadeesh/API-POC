export const getGitHubRepoName = (fullRepoName: string): string => {
  if(fullRepoName.includes("/")){
    return fullRepoName.split("/")[1];
  }
  return fullRepoName;
  };

  export const getFileNameFromPath = (filePath: string): string => {
    if(filePath.includes("/")){
      let filePathParts = filePath.split("/");
      return filePathParts[filePathParts.length-1];
    }
    return filePath;
  }
