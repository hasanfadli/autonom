import express from "express";
import { taskQueue } from "../queue.js";
import { db } from "../db/db.js";

const r = express.Router();

// ✅ CREATE TASK
r.post("/task", async (req, res) => {
  try {
    const { type, input } = req.body;

    const job = await taskQueue.add("task", { type, input });

    await db.query(
      "INSERT INTO tasks (id, type, status, input) VALUES ($1,$2,$3,$4)",
      [job.id, type, "pending", input]
    );

    res.json({ id: job.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET TASK STATUS
r.get("/task/:id", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM tasks WHERE id=$1",
    [req.params.id]
  );

  res.json(result.rows[0]);
});

export default r;
