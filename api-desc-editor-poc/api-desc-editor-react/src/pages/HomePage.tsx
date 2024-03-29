import { Grid, GridItem } from "@chakra-ui/react";
import ActivityBar from "../components/ActivityBar";
import CodeDiff from "../components/CodeDiff";
import CommitFiles from "../components/CommitFiles";
import FileExplorer from "../components/FileExplorer";
import GitHubExplorer from "../components/GitHubExplorer";
import MonacoEditor from "../components/MonacoEditor";
import Preview from "../components/Preview";
import useProjectViewStore from "../store/useProjectViewStore";
import "../App.scss";

const HomePage = () => {
  const { view } = useProjectViewStore();

  return (
    <Grid
      templateAreas={{
        lg: view
          ? `"activityBar overview codeEditor preview"`
          : `"activityBar codeEditor preview"`,
      }}
      templateColumns={{
        lg: view ? "65px 200px 820px 820px" : "65px 920px 920px",
      }}
    >
      <GridItem borderRight="1px" borderColor="#3f444e" area="activityBar">
        <ActivityBar />
      </GridItem>

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

      {(view === "fs" || view === "vcs") && (
        <>
          <GridItem area="codeEditor" margin="10px">
            <MonacoEditor />
          </GridItem>
          <GridItem area="preview" margin="10px">
            <Preview />
          </GridItem>
        </>
      )}

      <GridItem area="codeEditor" margin="10px" width={1600}>
        {view === "commit" && (
          <div style={{ height: "940px", overflowY: "auto" }}>
            <CodeDiff />
          </div>
        )}
      </GridItem>
    </Grid>
  );
};

export default HomePage;
