export interface GitHubRepoTree {
    name: string;
    path: string;
    sha: string;
    type: string;
    url: string;
    items?: GitHubRepoTree[] | null;
  }
  