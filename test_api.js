import { generateAIResponse, generatePracticeProblemsFromAI, summarizeChatSession } from "./src/utils/grokService.js";

async function testGrok() {
  const messages = [
    { sender: "user", message: "Explain reinforcement learning." }
  ];

  const aiResponse = await generateAIResponse(messages);
  console.log("AI Response:", aiResponse);

  const problems = await generatePracticeProblemsFromAI(messages);
  console.log("Practice Problems:", problems);

  const summary = await summarizeChatSession(messages);
  console.log("Session Summary:", summary);
}

testGrok();
