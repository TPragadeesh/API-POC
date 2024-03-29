import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import ActivityBar from "./components/ActivityBar";
import MonacoEditor from "./components/MonacoEditor";
import Preview from "./components/Preview";
import "./App.scss";
import FileExplorer from "./components/FileExplorer";
import GitHubExplorer from "./components/GitHubExplorer";
import CommitFiles from "./components/CommitFiles";
import useProjectViewStore from "./store/useProjectViewStore";
import CodeDiff from "./components/CodeDiff";

function App() {
  const { view } = useProjectViewStore();

  return (
    <Grid
      templateAreas={{
        lg: view
          ? `"nav nav nav nav" "activityBar overview codeEditor preview"`
          : `"nav nav nav" "activityBar codeEditor preview"`,
      }}
      templateColumns={{
        lg: view ? "65px 200px 800px 1fr" : "65px 1000px 1fr",
      }}
    >
      <GridItem h="fit-content" area="nav">
        <NavBar />
        <hr />
      </GridItem>
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
      <GridItem area="codeEditor" margin="10px">
        {false && <MonacoEditor />}
      </GridItem>
      <GridItem area="preview" margin="10px">
        {false && <Preview />}
      </GridItem>

      {view === "commit" && (
        <GridItem borderRight="1px" borderColor="#3f444e" area="overview">
          <CommitFiles />
        </GridItem>
      )}
      <GridItem area="codeEditor" margin="10px" width={1500}>
        <CodeDiff />
      </GridItem>
    </Grid>
  );
}

export default App;
