import { GridItem } from "@chakra-ui/react";
import FileExplorer from "./FileExplorer";
import GitHubExplorer from "./GitHubExplorer";
import useProjectViewStore from "../store/useProjectViewStore";
import CommitFiles from "./CommitFiles";

const ProjectOverview = () => {
  const { view } = useProjectViewStore();

  return (
    <>
      {view === "fs" && (
        <GridItem borderRight="1px" borderColor="#3f444e" area="overview">
          <FileExplorer />
        </GridItem>
      )}
      {view === "vcs" && (
        <GridItem borderRight="1px" borderColor="#3f444e" area="overview">
          <GitHubExplorer />
        </GridItem>
      )}
      {view === "commit" && (
        <GridItem borderRight="1px" borderColor="#3f444e" area="overview">
          <CommitFiles />
        </GridItem>
      )}
    </>
  );
};

export default ProjectOverview;
