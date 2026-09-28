import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// CoverAI Context-Aware Advice Endpoint
app.post('/api/gemini/cover-ai', async (req, res) => {
  try {
    const { messages, context } = req.body;
    const { phoneBrand, phoneModel, caseType, currentDesign, pricePKR } = context || {};

    const systemPrompt = `You are CoverAI, the luxury personalized custom phone case design consultant for "Aura Case Studio Pakistan" (a premier Pakistani phone accessory brand).
Current Customer Context:
- Phone: ${phoneBrand || 'Not selected'} ${phoneModel || ''}
- Case Type: ${caseType || 'Standard Custom'}
- Current Price: PKR ${pricePKR || '2,500'}
- Custom Design State: ${JSON.stringify(currentDesign || {})}

Your Persona & Tone:
- Sophisticated, polite, helpful, and knowledgeable about smartphone case ergonomics, camera cutouts, luxury materials (matte, glossy, MagSafe, 24k gold trim), and Pakistani design aesthetics (such as calligraphy, minimal typography, Lahore/Karachi city vibes, aesthetic Islamic geometric motifs, cyberpunk, marble luxury, family photo personalization).
- You can offer advice on image resolution, positioning around the camera cutout, color harmonies, font choices, and case durability.
- Never pretend to physically print or assemble the case yourself; you are an AI design consultant guiding the customer's creation.
- Keep responses concise, inspiring, formatted with clean bullet points or short paragraphs. Always use PKR for currency.
- Offer actionable creative suggestions. If relevant, you may propose concrete design parameters (e.g., recommend a specific font like "Cinzel", background color, or filter like "Noir" or "Warm Luxury").`;

    if (!apiKey) {
      return res.json({
        reply: `Welcome to Aura Case Studio Pakistan! For your ${phoneBrand || 'phone'} ${phoneModel || ''}, I recommend keeping your central photo below the camera cutout to avoid clipping. Pairing it with a subtle gold monogram in "Cinzel" font on a Matte or MagSafe case gives an exceptionally premium feel. How would you like to style your cover today?`,
        suggestedPreset: {
          font: 'Cinzel',
          filter: 'Warm Luxury',
          textColor: '#D4AF37',
        }
      });
    }

    const conversationHistory = (messages || []).map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Customer' : 'CoverAI'}: ${m.content}`).join('\n');

    const prompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nRespond as CoverAI:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const replyText = response.text || "I'm here to help elevate your phone cover design. Let me know what aesthetic you have in mind!";

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('CoverAI error:', error);
    res.json({
      reply: "Salam! For the best print quality on your case, ensure your focal elements sit comfortably within the safe print boundary, clear of the camera cutout. A rich contrast with subtle typography in gold or pure white will make your case truly stand out.",
    });
  }
});

// AI Design Concept Generator Endpoint
app.post('/api/gemini/generate-concept', async (req, res) => {
  try {
    const { promptText, phoneModel, styleCategory } = req.body;

    if (!apiKey) {
      return res.json({
        concept: {
          title: promptText ? `Luxury ${promptText}` : "Royal Emerald & Gold Marble",
          description: "Intricate Pakistani-inspired gold leaf veining on deep emerald marble, crafted to frame the camera housing elegantly.",
          palette: ["#064e3b", "#d4af37", "#171717", "#fafaf9"],
          recommendedFont: "Cinzel",
          recommendedCase: "MagSafe Compatible Case",
          suggestedText: "AURA 2026",
          gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #d4af37 100%)",
        }
      });
    }

    const prompt = `As a high-end smartphone case creative director for a luxury Pakistani brand, generate a detailed custom phone cover design concept based on the request: "${promptText}". Phone model: "${phoneModel || 'iPhone 17 Pro Max'}".
Return a valid JSON object with:
{
  "title": "short luxury name",
  "description": "1-2 sentence aesthetic description",
  "palette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "recommendedFont": "Cinzel" | "Playfair" | "Plus Jakarta" | "Space Grotesk",
  "recommendedCase": "Standard Custom" | "Glossy Impact" | "MagSafe Compatible" | "Luxury 24K Gold Trim",
  "suggestedText": "sample text",
  "gradient": "CSS linear or radial gradient string representing the mood"
}
Output only JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ concept: parsed });
  } catch (error: any) {
    console.error('Concept generation error:', error);
    res.json({
      concept: {
        title: "Pakistani Noir & Champagne Monogram",
        description: "Matte charcoal background with warm champagne typography and safe margins around the camera bezel.",
        palette: ["#1c1917", "#d4af37", "#f5f5f4", "#78716c"],
        recommendedFont: "Cinzel",
        recommendedCase: "Matte Hard Shell",
        suggestedText: "IQBAL",
        gradient: "linear-gradient(145deg, #18181b 0%, #27272a 60%, #a1a1aa 100%)"
      }
    });
  }
});

// Mount Vite middleware in development or serve static in production
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
