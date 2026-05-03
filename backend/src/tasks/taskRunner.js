import { pmAgent } from "../agents/pm.js";
import { architectAgent } from "../agents/architect.js";
import { backendAgent } from "../agents/backend.js";
import { reviewerAgent } from "../agents/reviewer.js";
import { fixerAgent } from "../agents/fixer.js";
import { deployAgent } from "../agents/deploy.js";
import { log } from "../utils/logger.js";

export async function runTask(task) {
  await log("system","START",task);

  let result;
  switch(task.type){
    case "plan": result=await pmAgent(task.input); break;
    case "design": result=await architectAgent(task.input); break;
    case "build": result=await backendAgent(task.input); break;
    case "review": result=await reviewerAgent(task.input); break;
    case "fix": result=await fixerAgent(task.input); break;
    case "deploy": result=await deployAgent(); break;
  }

  await log("system","END",result);
  return result;
}
