/**
 * Chalamandra QuantumMind - Background Service Worker
 * Gestiona el ciclo de vida de la extensión y eventos de sistema.
 */

chrome.runtime.onInstalled.addListener(() => {
  // Crear el menú contextual para decodificación instantánea
  chrome.contextMenus.create({
    id: "chalamandra-decode-selection",
    title: "Chalamandra: Decodificar '%s'",
    contexts: ["selection"]
  });
  
  console.log("🚀 Kernel Chalamandra 4.1: Sincronización Cuántica Activada");
});

// Manejador de clics en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "chalamandra-decode-selection" && info.selectionText) {
    // Guardamos la selección en el storage local para que el App.tsx lo lea al abrirse
    chrome.storage.local.set({ 'lastSelectedText': info.selectionText }, () => {
      console.log("📥 Texto capturado por el Kernel:", info.selectionText.substring(0, 30) + "...");
      
      // Notificación visual en el badge
      chrome.action.setBadgeText({ text: "369" });
      chrome.action.setBadgeBackgroundColor({ color: "#9D4EDD" }); // hybrida color
    });
  }
});

// Escuchar mensajes globales
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_CAPABILITIES') {
    // Podríamos centralizar el chequeo de capacidades aquí si fuera necesario
    sendResponse({ status: 'ready' });
  }
  return true;
});

// Limpiar insignia al abrir el popup
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup" || port.name === "chmadex") {
    chrome.action.setBadgeText({ text: "" });
  }
});
