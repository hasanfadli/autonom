import Editor from "./components/Editor";
import Chat from "./components/Chat";
import Logs from "./components/Logs";
import Tasks from "./components/Tasks";

export default function App(){
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px"}}>
      <Editor/>
      <div>
        <Chat/>
        <Tasks/>
        <Logs/>
      </div>
    </div>
  )
}
