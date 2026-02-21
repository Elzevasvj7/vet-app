"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const generateQuery = async (input: string) => {
  try {
    console.log(input)
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Genera la respuesta o consulta solicitada. Respeta el idioma del usuario; si no está claro, responde en español. Entrada: ${input}`,
      system:
        "You are an expert Dungeon Master specialized in Dungeons & Dragons 5e (Player's Handbook and SRD). Provide concise, rules-accurate guidance on character creation, combat, spells, conditions, and rulings. Note when something requires DM approval or is non-standard. Prefer official rules over speculation and avoid homebrew unless explicitly requested. Mirror the user's language; default to Spanish when uncertain. Be brief and actionable.",
    });
    return result.text;
  } catch (error) {
    console.error(error);
    throw new Error("Error al generar la consulta");
  }
};
