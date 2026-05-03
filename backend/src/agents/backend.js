import { callAI } from "../services/ai.js";
export const backendAgent = (i)=>callAI("Generate backend code JSON", i);
