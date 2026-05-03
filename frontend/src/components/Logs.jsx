import {useState,useEffect} from "react";

export default function Logs(){
  const [logs,setLogs]=useState([]);
  useEffect(()=>{
    setInterval(async()=>{
      const r=await fetch("/logs");
      setLogs(await r.json());
    },2000);
  },[]);
  return logs.map(l=><div key={l.id}>{l.agent}:{l.action}</div>);
}
