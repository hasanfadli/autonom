import express from "express";
import { taskQueue } from "../queue.js";
import { db } from "../db/db.js";

const r = express.Router();

r.post("/task", async (req,res)=>{
  const job = await taskQueue.add("task", req.body);
  res.json({id:job.id});
});

r.get("/logs", async (req,res)=>{
  const l = await db.query("SELECT * FROM logs ORDER BY id DESC LIMIT 100");
  res.json(l.rows);
});

export default r;
