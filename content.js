/**
 * Chalamandra QuantumMind - Content Script
 * Actúa como puente entre la página web y el motor cuántico.
 */

console.log("🧬 Chalamandra Content Script: Escaneando realidad...");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Seguridad: solo aceptamos mensajes de nuestra propia extensión
  if (sender.id !== chrome.runtime.id) {
    console.warn("[Chalamandra] Mensaje rechazado: sender no autorizado");
    return false;
  }

  if (request.action === "PING") {
    sendResponse({ status: "ALIVE", version: "4.1", origin: window.location.hostname });
    return true;
  }

  if (request.action === "EXTRACT_CONTEXT") {
    const pageTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || "";
    const selectedText = window.getSelection()?.toString() || "";

    sendResponse({
      title: pageTitle,
      description: metaDescription,
      selection: selectedText,
      url: window.location.href
    });
    return true;
  }

  return false;
});
