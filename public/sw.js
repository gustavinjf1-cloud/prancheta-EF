// Service worker da Prancheta EF.
//
// Objetivo único: deixar o app instalável (Android/Chrome exige um service
// worker registrado pra oferecer "Instalar app") e cachear só os arquivos
// estáticos pesados -- ilustrações das atividades, ícones e o build do
// Next -- pra abrir mais rápido depois da primeira visita.
//
// De propósito NÃO cacheia páginas HTML nem nada de login/sessão/dados:
// isso é sempre buscado direto na rede, sem cache. Assim ninguém corre o
// risco de ver uma tela desatualizada, um plano de aula antigo, ou (pior)
// conteúdo de outra conta que ficou salvo no aparelho.

const CACHE_NAME = "prancheta-ef-static-v1";

// Só essas pastas são cacheadas: ilustrações das atividades (por
// faixa/pasta), ícones do manifest e os assets gerados pelo build do
// Next. Note que /atividades (sem nada depois) e /atividades/<slug> são
// PÁGINAS, não imagens -- por isso o regex exige uma das pastas de
// verdade logo em seguida.
const STATIC_PATTERNS = [
  /^\/atividades\/(infantil|1ano|2ano|3ano)\//,
  /^\/icons\//,
  /^\/_next\/static\//,
];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isStatic = STATIC_PATTERNS.some((pattern) => pattern.test(url.pathname));
  if (!isStatic) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const response = await fetch(event.request);
      if (response.ok) cache.put(event.request, response.clone());
      return response;
    }),
  );
});
