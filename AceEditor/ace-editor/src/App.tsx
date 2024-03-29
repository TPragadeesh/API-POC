
import AceEditorComponent from "./Ace-editor.tsx";
function App() {


  return <AceEditorComponent onContentChange={(val)=>{console.log(val)}}/>
}

export default App
