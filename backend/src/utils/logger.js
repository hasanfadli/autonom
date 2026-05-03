import { db } from "../db/db.js";

export async function log(agent, action, data = {}) {
  console.log(`[${agent}] ${action}`, data);
  try {
    await db.query(
      "INSERT INTO logs (agent, action, data) VALUES ($1,$2,$3)",
      [agent, action, data]
    );
  } catch {}
}
