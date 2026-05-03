import { callAI } from "../services/ai.js";
export const reviewerAgent = (i)=>callAI("Review code JSON", i);
