(() => {
  'use strict';
  if (window.corssenUpdatesStarted) return;
  window.corssenUpdatesStarted = true;
  const queueKey = (user, release) => 'corssen_updates_pending_' + encodeURIComponent(user) + '_' + encodeURIComponent(release);
  const queued = key => { try { return localStorage.getItem(key) === '1'; } catch { return false; } };
  const queue = (key, value) => { try { if (value) localStorage.setItem(key, '1'); else localStorage.removeItem(key); } catch {} };
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  async function acknowledge(releaseId) {
    const response = await fetch('/api/updates/read', {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ releaseId })
    });
    if (!response.ok) throw new Error('No se pudo guardar la lectura');
    const data = await response.json();
    if (!data.ok || data.releaseId !== releaseId) throw new Error('Confirmación inválida');
  }
  function retryNotice(releaseId, key) {
    if (document.querySelector('.corssen-updates-retry')) return;
    const notice = element('div', 'corssen-updates-retry');
    notice.setAttribute('role', 'status');
    notice.append(element('span', '', 'Aviso cerrado. Falta sincronizar su lectura con tu cuenta.'));
    const retry = element('button', '', 'Reintentar sincronización');
    retry.type = 'button';
    retry.addEventListener('click', async () => {
      retry.disabled = true;
      try { await acknowledge(releaseId); queue(key, false); notice.remove(); }
      catch { retry.disabled = false; retry.textContent = 'Sin conexión. Reintentar'; }
    });
    notice.append(retry);
    document.body.append(notice);
  }
  function showRelease(release, user) {
    if (document.getElementById('corssen-system-updates')) return;
    const previousFocus = document.activeElement;
    const modal = element('dialog'); modal.id = 'corssen-system-updates';
    modal.setAttribute('aria-labelledby', 'corssen-news-title');
    modal.setAttribute('aria-describedby', 'corssen-news-description');
    const content = element('div', 'nw-dialog');
    const head = element('header', 'nw-head');
    const brand = element('div', 'nw-brand');
    const logo = element('img'); logo.src = '/logo_isotipo.svg'; logo.alt = 'Corssen Logística';
    const brandText = element('div');
    brandText.append(element('strong', '', 'CORSSEN LOGÍSTICA'), element('span', '', 'Control de Flota y Maquinaria'));
    brand.append(logo, brandText);
    const close = element('button', 'nw-close', '×'); close.type = 'button'; close.setAttribute('aria-label', 'Cerrar novedades');
    const title = element('h2', '', release.title); title.id = 'corssen-news-title';
    const description = element('p', 'nw-intro', release.description); description.id = 'corssen-news-description';
    head.append(brand, close, title, description);
    const body = element('div', 'nw-body');
    for (const group of release.sections || []) {
      const section = element('section', 'nw-group'), heading = element('div', 'nw-heading');
      heading.append(element('h3', '', group.title), element('span', 'nw-tag', group.tag));
      const items = element('ul');
      for (const text of group.items || []) items.append(element('li', '', text));
      section.append(heading, items); body.append(section);
    }
    const footer = element('footer', 'nw-footer');
    const actions = element('div', 'nw-actions'), ok = element('button', 'nw-ok', 'Entendido, continuar'); ok.type = 'button';
    actions.append(element('span', '', 'Novedades del sistema · ServiTec Pro'), ok);
    footer.append(element('p', 'nw-dismiss-note', 'Al cerrar este aviso, no volverá a aparecer en tu cuenta hasta que haya nuevas novedades.'), actions);
    content.append(head, body, footer); modal.append(content); document.body.append(modal);
    let dismissed = false;
    const dismiss = async () => {
      if (dismissed) return;
      dismissed = true;
      const key = queueKey(user, release.id);
      queue(key, true);
      modal.close(); modal.remove();
      if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') previousFocus.focus();
      try { await acknowledge(release.id); queue(key, false); }
      catch { retryNotice(release.id, key); }
    };
    close.addEventListener('click', dismiss); ok.addEventListener('click', dismiss);
    modal.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
    modal.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      if (event.shiftKey && document.activeElement === close) { event.preventDefault(); ok.focus(); }
      else if (!event.shiftKey && document.activeElement === ok) { event.preventDefault(); close.focus(); }
    });
    modal.showModal(); close.focus();
  }
  async function initialize() {
    try {
      const response = await fetch('/api/updates', { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      if (!data.pending || !data.usuario || !data.release?.id || data.release.id !== data.releaseId) return;
      const key = queueKey(data.usuario, data.release.id);
      if (queued(key)) {
        try { await acknowledge(data.release.id); queue(key, false); }
        catch { retryNotice(data.release.id, key); }
        return;
      }
      // Let the authenticated entry animation finish before showing the notes.
      setTimeout(() => showRelease(data.release, data.usuario), 650);
    } catch { /* A network failure must never prevent use of the system. */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
