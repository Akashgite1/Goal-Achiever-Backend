/**
 * grokservice.js
 * Simulated AI tutor helper functions
 * Integrates chat responses, practice problems, and summaries
 */

import fetch from "node-fetch"; // or axios if you prefer
import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateAIResponse = async (messages) => {
  const formattedMessages = messages.map(msg => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.message,
  }));

  const completion = await groq.chat.completions.create({
    messages: formattedMessages,
    model: "openai/gpt-oss-20b", // choose your model
  });

  return completion.choices[0]?.message?.content || "No response from AI";
};

export const generatePracticeProblemsFromAI = async (messages) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate 3 practice problems based on: ${messages.map(m => m.message).join(" ")}`,
      },
    ],
    model: "openai/gpt-oss-20b",
  });

  // Return array of problems
  return completion.choices[0]?.message?.content?.split("\n").filter(Boolean) || [];
};

export const summarizeChatSession = async (messages) => {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Summarize this chat session: ${messages.map(m => m.message).join("\n")}`,
      },
    ],
    model: "openai/gpt-oss-20b",
  });

  return completion.choices[0]?.message?.content || "No summary generated";
};
