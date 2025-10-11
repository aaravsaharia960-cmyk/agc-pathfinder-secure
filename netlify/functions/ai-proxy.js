const Groq = require("groq-sdk");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 1. Get the secret key from Netlify's settings
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // 2. Get the user's prompt
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return { statusCode: 400, body: "Prompt is required." };
    }

    // 3. Talk to the Groq AI (using a fast Llama 3 model)
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    const text = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't get a response.";

    // 4. Send the answer back to the website
    return {
      statusCode: 200,
      body: JSON.stringify({ text: text }),
    };

  } catch (error) {
    console.error("Error calling Groq AI:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from AI." }),
    };
  }
};