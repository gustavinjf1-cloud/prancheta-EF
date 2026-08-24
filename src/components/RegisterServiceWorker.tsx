"use client";

import { useEffect } from "react";

// Registra o service worker (public/sw.js) assim que o app carrega no
// navegador. É esse registro que faz o Chrome/Android considerar o site
// "instalável" e oferecer o botão de instalar.
export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falha silenciosa: sem service worker o app continua funcionando
        // normalmente, só não fica instalável.
      });
    }
  }, []);

  return null;
}
