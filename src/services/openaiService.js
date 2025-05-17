import OpenAI from "openai";
import config from "../config/mainConfig.js";

const openai = new OpenAI({
  apiKey: config.openAiApiKey,
  baseURL: "https://api.deepseek.com",
});

const generateSummary = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat", // Use a valid xAI model (e.g., grok-3-mini-beta or grok-3)
      messages: [
        {
          role: "system",
          content:
            "You are a professional Chartered Accountant specializing in handling tax notices and drafting official replies. You write in a formal, clear, and polite tone. All responses must be in plain text with no special characters or formatting.",
        },
        {
          role: "user",
          content: `You are given a financial or tax-related notice. Your task is to:

      1. Identify and explain the purpose of the notice (e.g., delay in GSTR-3B filing, mismatch in ITR, etc.).
      2. Extract and mention any important deadlines or dates.
      3. Generate a professional, neatly worded reply that can be used to respond to the tax department.
      4. Ensure the language is formal and appropriate for communication from a Chartered Accountant.
      5. Do not use any special characters, markdowns, bullet points, or bold/italic formatting — only plain text.
      6. Don't add analysis or key notes; give me a ready-to-send reply.

      Here is the notice content:

      ${text}`,
        },
      ],

      //       messages: [
      //         {
      //           role: "system",
      //           content:
      //             "You are a professional Chartered Accountant. You draft formal, clear, and concise replies to tax notices such as notices under Section 133(6), GSTR-3B late filings, or ITR mismatches. Your reply must be appropriate for official communication and include only the professional response — no explanation, no analysis, no formatting like asterisks or bold text. All text should be in plain paragraph form, exactly as it would be sent to the income tax department.",
      //         },
      //         {
      //           role: "user",
      //           content: `Draft a professional reply letter for the following tax notice. Include all relevant facts and dates from the notice and maintain a formal tone. Only output the final reply letter — do not include any summary, analysis, instructions, or formatting. Use plain text only.

      // Notice content:
      // ${text}`,
      //         },
      //       ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating summary:", error.message);
    throw new Error("Failed to generate summary");
  }
};

// (async () => {
//   const sampleText = "The quick brown fox jumps over the lazy dog. This is a classic pangram used to test typewriters and keyboards. It contains every letter of the English alphabet.";
//   try {
//     console.log("Testing generateSummary...");
//     const summary = await generateSummary(sampleText);
//     console.log("Summary:", summary);
//   } catch (error) {
//     console.error("Test failed:", error.message);
//   }
// })();

// const generateSummary = async (text) => {
//   // Temporary mock summary
//   return "This is a dummy summary for development purposes.";
// };

export { generateSummary };
