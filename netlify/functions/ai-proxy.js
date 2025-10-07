// The Google AI SDK for the backend
const { GoogleGenerativeAI } = require("@google/generative-ai");

// This is the main function that Netlify will run
exports.handler = async function (event, context) {
  // We only want to handle POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 1. Get the secret API key from Netlify's secure settings
    const API_KEY = process.env.GOOGLE_API_KEY;
    if (!API_KEY) {
      throw new Error("API key is not set.");
    }

    // 2. Get the user's prompt from the message our website sent
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return { statusCode: 400, body: "Prompt is required." };
    }
    
    // 3. Talk to the Google AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Send the AI's answer back to our website
    return {
      statusCode: 200,
      body: JSON.stringify({ text: text }),
    };
  } catch (error) { // <-- THIS IS THE CORRECTED LINE
    // If anything goes wrong, send back an error message
    console.error("Error calling Google AI:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from AI." }),
    };
  }
};