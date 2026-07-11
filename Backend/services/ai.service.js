import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                            OpenRouter Configuration                         */
/* -------------------------------------------------------------------------- */

const MODEL = () =>
    process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";

export const isAIConfigured = () =>
    Boolean(process.env.OPENROUTER_API_KEY);

/* -------------------------------------------------------------------------- */
/*                          Generate Structured JSON                           */
/* -------------------------------------------------------------------------- */

const generateJSON = async (prompt) => {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new ApiError(
            503,
            "OPENROUTER_API_KEY is missing."
        );
    }

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: MODEL(),

                messages: [
                    {
                        role: "system",
                        content:
                            "You are a backend API. Always respond ONLY with valid JSON. Never include markdown, code fences, explanations, or additional text.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],

                temperature: 0.6,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer":
                        process.env.CLIENT_URL || "http://localhost:5173",
                    "X-Title": "SalesFlow AI CRM",
                },
            }
        );

        let content = response.data?.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("Empty AI response.");
        }

        content = content
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Extract JSON if the model accidentally adds text
        const jsonStart = content.indexOf("{");
        const jsonEnd = content.lastIndexOf("}");

        if (jsonStart !== -1 && jsonEnd !== -1) {
            content = content.slice(jsonStart, jsonEnd + 1);
        }

        return JSON.parse(content);
    } catch (err) {
        console.error(
            "OpenRouter JSON Error:",
            err.response?.status,
            err.response?.data || err.message
        );

        throw new ApiError(
            502,
            "AI request failed. Please try again."
        );
    }
};

/* -------------------------------------------------------------------------- */
/*                           Generate Plain Text                              */
/* -------------------------------------------------------------------------- */

const generateText = async (
    prompt,
    temperature = 0.7
) => {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new ApiError(
            503,
            "OPENROUTER_API_KEY is missing."
        );
    }

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: MODEL(),

                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],

                temperature,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer":
                        process.env.CLIENT_URL || "http://localhost:5173",
                    "X-Title": "SalesFlow AI CRM",
                },
            }
        );

        const content =
            response.data?.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error("Empty AI response.");
        }

        return content.trim();
    } catch (err) {
        console.error(
            "OpenRouter Text Error:",
            err.response?.status,
            err.response?.data || err.message
        );

        throw new ApiError(
            502,
            "AI request failed. Please try again."
        );
    }
};
/* -------------------------------------------------------------------------- */
/*                         AI Lead Summary Generator                           */
/* -------------------------------------------------------------------------- */

export const generateLeadSummary = async (lead) => {
    const prompt = `
You are an expert B2B sales consultant helping a sales team evaluate CRM leads.

Analyze the following lead carefully.

Lead Details:
----------------------------------------
Name: ${lead.name || "N/A"}
Company: ${lead.company || "N/A"}
Email: ${lead.email || "N/A"}
Phone: ${lead.phone || "N/A"}
Current Stage: ${lead.status || "New"}
Priority: ${lead.priority || "Medium"}
Lead Source: ${lead.source || "Unknown"}
Potential Deal Value: $${lead.value || 0}
Notes:
${lead.notes || "No notes provided."}
----------------------------------------

Evaluate this lead based on:

1. Buying intent
2. Deal value
3. Current pipeline stage
4. Available information
5. Possible risks

Return ONLY valid JSON.

Required format:

{
  "summary": "2-3 sentence executive summary.",
  "riskScore": 42,
  "suggestedPriority": "High",
  "nextBestAction": "Schedule a product demo within 48 hours."
}

Rules:

- riskScore must be an integer from 0 to 100.
- suggestedPriority must be exactly one of:
  "Low"
  "Medium"
  "High"

- nextBestAction must be a single actionable recommendation.

Do NOT include markdown.
Do NOT include explanations.
Do NOT wrap the response inside \`\`\`.
`;

    return generateJSON(prompt);
};

/* -------------------------------------------------------------------------- */
/*                          AI Email Generator                                */
/* -------------------------------------------------------------------------- */

export const generateEmail = async ({
    lead,
    purpose,
    tone,
    sender,
}) => {
    const prompt = `
You are a senior B2B sales executive writing personalized emails.

Your objective is to increase reply rates while sounding human, professional and trustworthy.

Sender Information
------------------
Name: ${sender?.name || "CRM Team"}
Company: ${sender?.company || "Our Company"}

Recipient Information
---------------------
Name: ${lead?.name || "there"}
Company: ${lead?.company || "their company"}
Email: ${lead?.email || "N/A"}

CRM Details
-----------
Pipeline Stage: ${lead?.status || "New"}
Lead Source: ${lead?.source || "Unknown"}
Priority: ${lead?.priority || "Medium"}
Deal Value: $${lead?.value || 0}

Additional Notes
----------------
${lead?.notes || "No additional notes."}

Email Purpose
-------------
${purpose || "Follow-up"}

Desired Tone
------------
${tone || "Professional and Friendly"}

Write a highly personalized sales email.

Requirements:

- Write a compelling subject line.
- Keep the email below 180 words.
- Make it conversational.
- Mention the company naturally.
- Avoid sounding robotic.
- Include one clear call-to-action.
- End with the sender's name.
- Use proper line breaks.

Return ONLY valid JSON.

Required format:

{
  "subject": "Your email subject",
  "body": "Complete email body"
}

Do NOT include markdown.
Do NOT explain anything.
Do NOT wrap the JSON inside \`\`\`.
`;

    return generateJSON(prompt);
};
/* -------------------------------------------------------------------------- */
/*                        AI Sales Insights Generator                          */
/* -------------------------------------------------------------------------- */

export const generateSalesInsights = async (pipelineStats) => {
    const prompt = `
You are a senior Revenue Operations (RevOps) consultant.

Your task is to analyze the following CRM pipeline and provide strategic business recommendations.

CRM Pipeline Statistics

${JSON.stringify(pipelineStats, null, 2)}

Analyze:

1. Pipeline health
2. Deal distribution
3. Pipeline risks
4. Revenue opportunities
5. Sales bottlenecks
6. Overall conversion quality

Return ONLY valid JSON.

Required format:

{
  "headline": "One concise summary of pipeline health.",
  "insights": [
    "...",
    "...",
    "..."
  ],
  "recommendations": [
    "...",
    "...",
    "..."
  ],
  "healthScore": 84
}

Rules:

- healthScore must be an integer between 0 and 100.
- insights should contain 3 to 5 observations.
- recommendations should contain 3 to 5 actionable items.
- Keep recommendations practical and prioritized.

Do NOT include markdown.
Do NOT wrap JSON in \`\`\`.
Do NOT explain anything.
`;

    return generateJSON(prompt);
};

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */

export { generateText };