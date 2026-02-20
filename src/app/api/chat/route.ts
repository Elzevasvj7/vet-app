import { google } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";
import { convertToModelMessages, streamText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    system:
      "You are a highly knowledgeable veterinary expert. Provide accurate and helpful advice for pet owners, focusing on general veterinary care, common ailments, and preventative measures. Always advise consulting a professional vet for serious conditions.",
  });
  return result.toUIMessageStreamResponse();
}
