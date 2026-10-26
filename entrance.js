// Run in the head, before page styles, so the first paint is intentional.
(() => {
  const key = 'zt-last-visit';
  const interval = 30 * 60 * 1000;
  const root = document.documentElement;
  let lastVisit = 0;
  let hiddenAt = 0;
  let running = false;
  try { lastVisit = Number(localStorage.getItem(key)) || 0; } catch {}
  function remember() {
    try { localStorage.setItem(key, String(Date.now())); } catch {}
  }
  const style = document.createElement('style');
  style.textContent = `
    html.entrance-active{overflow:hidden}
    html.entrance-active::before,html.entrance-active::after{content:'';position:fixed;pointer-events:auto;z-index:2147483646}
    html.entrance-active::before{inset:0;background:#fff;opacity:1}
    html.entrance-active::after{inset:0;z-index:2147483647;background:url('assets/zateemee-logo-ink.svg?v=2') center/ min(58vw,300px) auto no-repeat;opacity:0;transform:scale(.82);pointer-events:none}
    html.entrance-active dialog[open]{visibility:hidden}
    html.entrance-playing::before{animation:entrance-screen 1500ms ease-in-out both}
    html.entrance-playing::after{animation:entrance-logo 1500ms cubic-bezier(.22,.61,.36,1) both}
    @keyframes entrance-screen{0%,65%{opacity:1}100%{opacity:0;pointer-events:none}}
    @keyframes entrance-logo{0%{opacity:0;transform:scale(.82)}22%{opacity:1}65%{opacity:1;transform:scale(1.04)}100%{opacity:0;transform:scale(1.2)}}
    @media(prefers-reduced-motion:reduce){html.entrance-playing::after{animation-name:entrance-logo-still}@keyframes entrance-logo-still{0%,100%{opacity:0;transform:none}22%,65%{opacity:1;transform:none}}}
  `;
  document.head.append(style);
  function play() {
    if (running) return;
    running = true;
    root.classList.add('entrance-active');
    const logo = new Image();
    logo.src = 'assets/zateemee-logo-ink.svg?v=2';
    // Start immediately so the whole entrance, including cleanup, takes 1.5 seconds.
    root.classList.add('entrance-playing');
      setTimeout(() => {
        root.classList.remove('entrance-active', 'entrance-playing');
        running = false;
      }, 1500);
    remember();
  }
  const navigation = performance.getEntriesByType('navigation')[0];
  let internalNavigation = false;
  try { internalNavigation = new URL(document.referrer).origin === location.origin; } catch {}
  if (navigation?.type === 'reload' || !internalNavigation || !lastVisit || Date.now() - lastVisit >= interval) play();
  remember();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hiddenAt = Date.now(); remember(); }
    else { if (hiddenAt && Date.now() - hiddenAt >= interval) play(); hiddenAt = 0; remember(); }
  });
  setInterval(() => { if (!document.hidden) remember(); }, 60000);
  window.addEventListener('pagehide', () => { hiddenAt = Date.now(); remember(); });
  window.addEventListener('pageshow', event => {
    if (event.persisted && hiddenAt && Date.now() - hiddenAt >= interval) play();
    remember();
  });
})();
