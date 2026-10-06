/**
 * Chalamandra QuantumMind - Content Script
 * Actúa como puente entre la página web y el motor cuántico.
 */

console.log("🧬 Chalamandra Content Script: Escaneando realidad...");

// Escuchar mensajes desde el popup o el background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    sendResponse({ status: "ALIVE", version: "4.1", origin: window.location.hostname });
  }

  if (request.action === "EXTRACT_CONTEXT") {
    // Ejemplo de ingeniería inversa: extraer contexto de la página para alimentar la IA
    const pageTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.content || "";
    const selectedText = window.getSelection().toString();

    sendResponse({
      title: pageTitle,
      description: metaDescription,
      selection: selectedText,
      url: window.location.href
    });
  }
});
