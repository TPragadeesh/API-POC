export interface ChangedFileDetails{
  contents: string;
  path: string;
}

export interface CommitPayload {
    changedFileDetails: ChangedFileDetails[]
    commitMessage: string;
    repoName: string;
    owner: string;
  }