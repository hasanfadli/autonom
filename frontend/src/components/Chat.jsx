import { useState } from "react";

const API = "https://adaptable-vision-production.up.railway.app";

export default function Chat() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendPrompt() {
    try {
      setLoading(true);
      setStatus("Sending...");
      setResult("");

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

      if (!data.id) {
        throw new Error("Task ID tidak ditemukan");
      }

      setStatus("Processing...");

      // 🔁 polling status task
      const interval = setInterval(async () => {
        try {
          const r = await fetch(`${API}/task/${data.id}`);
          const task = await r.json();

          if (!task) return;

          if (task.status === "done") {
            setStatus("Done ✅");
            setResult(JSON.stringify(task.output, null, 2));
            clearInterval(interval);
            setLoading(false);
          }

          if (task.status === "failed") {
            setStatus("Failed ❌");
            setResult(JSON.stringify(task.output, null, 2));
            clearInterval(interval);
            setLoading(false);
          }
        } catch (err) {
          console.error("Polling error:", err);
          clearInterval(interval);
          setLoading(false);
        }
      }, 2000);

      setText("");

    } catch (err) {
      console.error(err);
      setStatus("Error ❌");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 10 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Contoh: buat fitur login"
        style={{ width: "100%", height: 100 }}
      />

      <button
        onClick={sendPrompt}
        disabled={loading}
        style={{ marginTop: 10 }}
      >
        {loading ? "Processing..." : "Run AI"}
      </button>

      <div style={{ marginTop: 10 }}>{status}</div>

      {result && (
        <pre
          style={{
            marginTop: 10,
            background: "#111",
            color: "#0f0",
            padding: 10,
            maxHeight: 300,
            overflow: "auto"
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
