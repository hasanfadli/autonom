import { Worker } from "bullmq";
import IORedis from "ioredis";
import { runTask } from "./tasks/taskRunner.js";

const connection = new IORedis(process.env.REDIS_URL);

new Worker("tasks", async job => {
  return await runTask(job.data);
},{connection});

console.log("Worker running...");
