import { GoogleGenAI } from "@google/genai";
import { DialecticalState, DialecticStyle, CapabilityStatus } from "../types";

const PERSONAS = {
  chola: {
    role: "BARRIO-ROOT",
    desc: "Directa, cruda, basada en la realidad urbana, auténtica.",
    model: "gemini-2.5-flash"
  },
  malandra: {
    role: "ESTRATEGIA-SURVIVAL",
    desc: "Astuta, crítica, adaptativa, desafiante y táctica.",
    model: "gemini-2.5-flash"
  },
  fresa: {
    role: "TECH-REFINED",
    desc: "Sofisticada, académica, tecnológica, estética y aspiracional.",
    model: "gemini-2.5-flash"
  },
  salamandra: {
    role: "SALAMANDRA MAGISTRAL",
    desc: "Visionaria, integradora, decodificadora cuántica universal 369.",
    model: "gemini-2.5-pro"
  }
};

// Lee la API key desde chrome.storage.local (producción)
// o desde env (dev en navegador normal, no extensión)
async function getApiKey(): Promise<string | null> {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['gemini_api_key'], (data) => {
        resolve((data.gemini_api_key as string) || null);
      });
    });
  }
  return null;
}

let _ai: GoogleGenAI | null = null;
let _aiKeyUsed: string | null = null;

async function getAI(): Promise<GoogleGenAI | null> {
  const key = await getApiKey();
  if (!key) return null;
  if (!_ai || _aiKeyUsed !== key) {
    _ai = new GoogleGenAI({ apiKey: key });
    _aiKeyUsed = key;
  }
  return _ai;
}

export class ChalamandraEngine {
  /** ¿Hay API key configurada? */
  async hasApiKey(): Promise<boolean> {
    return (await getApiKey()) !== null;
  }

  /** Guarda la API key del usuario en chrome.storage.local */
  async saveApiKey(key: string): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ gemini_api_key: key.trim() }, () => resolve());
      });
    }
  }

  /** Borra la API key */
  async clearApiKey(): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.remove(['gemini_api_key'], () => resolve());
      });
    }
  }

  async checkCapabilities(): Promise<CapabilityStatus> {
    return { languageModel: 'cloud', summarizer: 'cloud' };
  }

  async runDialectic(
    input: string,
    thesisStyle: DialecticStyle,
    antithesisStyle: DialecticStyle,
    onProgress?: (msg: string) => void
  ): Promise<DialecticalState> {
    const ai = await getAI();
    if (!ai) throw new Error("API Key no configurada. Ábrela en Configuración.");

    // 1. TESIS
    onProgress?.(`Sincronizando Tesis ${thesisStyle.toUpperCase()}...`);
    const thesisRes = await ai.models.generateContent({
      model: PERSONAS[thesisStyle].model,
      contents: `Actúa como ${PERSONAS[thesisStyle].role}. ${PERSONAS[thesisStyle].desc} Proporciona una TESIS fundamentada sobre: "${input}".`
    });
    const thesisText = thesisRes.text || "Error en Tesis.";

    // 2. ANTÍTESIS
    onProgress?.(`Desafiando con Antítesis ${antithesisStyle.toUpperCase()}...`);
    const antithesisRes = await ai.models.generateContent({
      model: PERSONAS[antithesisStyle].model,
      contents: `Actúa como ${PERSONAS[antithesisStyle].role}. ${PERSONAS[antithesisStyle].desc} Desafía críticamente esta tesis: "${thesisText}" respecto al concepto original: "${input}".`
    });
    const antithesisText = antithesisRes.text || "Error en Antítesis.";

    // 3. SÍNTESIS
    onProgress?.("Decodificando Síntesis Salamandra...");
    const synthesisRes = await ai.models.generateContent({
      model: PERSONAS.salamandra.model,
      contents: `Como ${PERSONAS.salamandra.role}, fusiona la Tesis ("${thesisText}") y la Antítesis ("${antithesisText}") en una resolución magistral y visionaria para: "${input}".`
    });
    const synthesisText = synthesisRes.text || "Error en Síntesis.";

    return {
      thesis: thesisText,
      antithesis: antithesisText,
      synthesis: synthesisText,
      energySignature: `${thesisStyle.slice(0,2)}-${antithesisStyle.slice(0,2)}-369-CLOUD`
    };
  }

  async generateDisruption(input: string): Promise<string> {
    const ai = await getAI();
    if (!ai) throw new Error("API Key no configurada.");
    const res = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Aplica MECÁNICA INVERSA y DISRUPCIÓN NIVEL 9 a: "${input}". Rompe los paradigmas establecidos y ofrece una visión radical.`
    });
    return res.text || "Disrupción fallida.";
  }
}

export const chalamandra = new ChalamandraEngine();
