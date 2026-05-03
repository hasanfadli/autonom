import OpenAI from "openai";
import { retry } from "../utils/retry.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callAI(instructions, input) {
  return await retry(async () => {
    const res = await client.responses.create({
      model: "gpt-5.3",
      instructions,
      input,
      temperature: 0.2
    });
    return res.output_text;
  });
}
