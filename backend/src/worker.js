import { Worker } from "bullmq";
import IORedis from "ioredis";
import { runTask } from "./tasks/taskRunner.js";
import { db } from "./db/db.js";

const connection = new IORedis(process.env.REDIS_URL);

new Worker(
  "tasks",
  async (job) => {
    try {
      console.log("Processing job:", job.id);

      // 🔹 update status → processing
      await db.query(
        "UPDATE tasks SET status=$1 WHERE id=$2",
        ["processing", job.id]
      );

      // 🔹 jalankan agent
      const result = await runTask(job.data);

      // 🔹 simpan hasil
      await db.query(
        "UPDATE tasks SET status=$1, output=$2 WHERE id=$3",
        ["done", result, job.id]
      );

      console.log("Job done:", job.id);

      return result;

    } catch (err) {
      console.error("Job error:", err);

      // 🔹 simpan error
      await db.query(
        "UPDATE tasks SET status=$1, output=$2 WHERE id=$3",
        ["failed", JSON.stringify({ error: err.message }), job.id]
      );

      throw err;
    }
  },
  { connection }
);

console.log("Worker running...");
