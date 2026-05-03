import { useState } from "react";

const API = "https://autonom-production.up.railway.app/"; // GANTI

export default function Chat() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  async function sendPrompt() {
    setStatus("Sending...");

    const res = await fetch(`${API}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "plan",
        input: text
      })
    });

    const data = await res.json();

    setStatus(`Task created: ${data.id}`);
    setText("");
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Contoh: buat fitur login"
      />
      <button onClick={sendPrompt}>Run AI</button>

      <div>{status}</div>
    </div>
  );
}
