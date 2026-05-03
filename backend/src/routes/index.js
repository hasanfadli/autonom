import express from "express";
import { taskQueue } from "../queue.js";
import { db } from "../db/db.js";

const r = express.Router();

// ✅ CREATE TASK
r.post("/task", async (req, res) => {
  try {
    const { type, input } = req.body;

    if (!type || !input) {
      return res.status(400).json({ error: "type dan input wajib diisi" });
    }

    // 🔹 buat job di queue
    const job = await taskQueue.add("task", { type, input });

    // 🔹 simpan ke DB (FIX JSONB)
    await db.query(
      "INSERT INTO tasks (id, type, status, input) VALUES ($1,$2,$3,$4)",
      [
        job.id,
        type,
        "pending",
        JSON.stringify({ prompt: input }) // ✅ FIX DI SINI
      ]
    );

    res.json({ id: job.id });

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET TASK STATUS
r.get("/task/:id", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE id=$1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Task tidak ditemukan" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("GET TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ HEALTH CHECK (penting untuk Railway)
r.get("/", (req, res) => {
  res.send("API OK");
});

export default r;
