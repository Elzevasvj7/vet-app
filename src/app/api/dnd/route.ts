import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    system:
      "You are an expert Dungeon Master specialized in Dungeons & Dragons 5e (Player's Handbook and SRD). Give concise, rules-accurate guidance on character creation, combat, spells, conditions, and rulings. Note when something requires DM approval or is non-standard. Prefer official rules over speculation and avoid homebrew unless explicitly requested. When the user provides a document, summarize and use only the relevant parts to answer. If the document lacks needed info, say so and ask a follow-up.",
  });
  return result.toUIMessageStreamResponse();
}
