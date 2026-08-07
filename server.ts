import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client safe initialization
let geminiClient: any = null;

function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        geminiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        console.log("Google GenAI client successfully instantiated.");
      } catch (e) {
        console.error("Failed to instantiate Google GenAI:", e);
      }
    } else {
      console.warn("GEMINI_API_KEY is missing or generic. Fallback simulated responder mode active.");
    }
  }
  return geminiClient;
}

// API endpoint for Tactical Command AI Advisor
app.post("/api/advisor", async (req: express.Request, res: express.Response) => {
  const { prompt, context } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "Missing prompt query parameter." });
    return;
  }

  const client = getGeminiClient();

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Context: ${context || 'General tactical response'}. Prompt: ${prompt}`,
        config: {
          systemInstruction:
            "You are the Tactical Guardian HQ command operations advisor. Summarize risk profiles with maximum tactical brevity (max 80 words, 3 short bullet points). Focus on actionable routing safety, elevation requirements, and water indices in the Philippines. Do not use flowery or dramatic words.",
          temperature: 0.7,
        },
      });

      res.json({
        advice: response.text || "No advice generated. Main channel clear.",
        engine: "Gemini 3.5 Active Uplink",
      });
      return;
    } catch (err: any) {
      console.error("Gemini invocation error:", err);
      // Fall through to simulated rescue advisor
    }
  }

  // Graceful simulated offline fallback:
  let fallbackText = "Tactical Advisor (Cached Safety Guidelines):\n";
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes("flood") || promptLower.includes("rain") || promptLower.includes("water")) {
    fallbackText += "• EVACUATE immediately to local covered basketball courts or elevated barangay plazas.\n• Avoid all Marikina/Pinatubo river margins due to 18.2m flash warnings.\n• Monitor satellite secondary VHF Channel 4 (143.20 MHz).";
  } else if (promptLower.includes("supply") || promptLower.includes("inventory") || promptLower.includes("food")) {
    fallbackText += "• Deploy cargo priority manifests to San Pedro and Biñan centers.\n• Safe-route logistics trucks via South Expressway bypassed corridors.\n• Mandate ID checking for target households.";
  } else {
    fallbackText += "• Sector 4 state limits: Landslide advisories remain active on mountain passes.\n• Establish radio check with Capt. Reyes and Sgt. Santos on 15m loops.\n• Keep GPS broadcast toggled to sustain survivor locate scans.";
  }

  res.json({
    advice: fallbackText,
    engine: "Local Resilient Telemetry Engine (No API Key)",
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tactical Guardian operational command running at http://localhost:${PORT}`);
  });
}

startServer();
