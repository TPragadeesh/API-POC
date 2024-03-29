import Editor from "./Editor.tsx";
import './App.css'

function App() {
  return<Editor onContentChange={(val)=>{console.log(val)}}/>
}

export default App
