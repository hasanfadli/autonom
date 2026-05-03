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
r.get("/task/:id", async (req, res) => {

  const result = await db.query(

    "SELECT * FROM tasks WHERE id=$1",

    [req.params.id]

  );

  res.json(result.rows[0]);

});

export default r;
