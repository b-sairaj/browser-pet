// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = { speed: 1, bottomOnly: false, mode: 'random' };

// ─── Pure helpers (no DOM dependency) ────────────────────────────────────────
function normalizeConfig(config = {}) {
  return {
    speed: Math.min(Math.max(Number(config.speed) || DEFAULT_CONFIG.speed, 0.25), 3),
    bottomOnly: Boolean(config.bottomOnly),
    mode: config.mode === 'mouse' ? 'mouse' : 'random'
  };
}

function isProtectedPage(currentUrl) {
  if (!currentUrl) return true;
  const { protocol, hostname } = currentUrl;
  return (
    protocol === 'chrome:' || protocol === 'chrome-extension:' ||
    protocol === 'edge:'   || protocol === 'about:'            ||
    protocol === 'view-source:' || protocol === 'devtools:'    ||
    hostname === 'chromewebstore.google.com' ||
    hostname === 'chrome.google.com'
  );
}

function getBlockedReason(error) {
  const msg = String(error?.message || error || '').toLowerCase();
  if (!msg) return null;
  if (msg.includes('cannot access contents of url') ||
      msg.includes('the extensions gallery cannot be scripted'))
    return 'This page blocks extension injection.';
  if (msg.includes('cannot access a chrome') ||
      msg.includes('cannot access this page'))
    return 'Chrome protects this page from extensions.';
  if (msg.includes('receiving end does not exist'))
    return 'This page did not accept the crawler script. Refresh and try again.';
  return null;
}

// ─── DOM init ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  const statusEl        = document.getElementById('status');
  const domainEl        = document.getElementById('domain');
  const switchRow       = document.getElementById('switch-row');
  const toggleInput     = document.getElementById('toggle-input');
  const toggleState     = document.getElementById('toggle-state');
  const controlsEl      = document.getElementById('controls');
  const speedInput      = document.getElementById('speed-input');
  const speedValue      = document.getElementById('speed-value');
  const modeSelect      = document.getElementById('mode-select');
  const bottomOnlyInput = document.getElementById('bottom-only-input');

  let isEnabled      = false;
  let isRestrictedPage = false;
  let tab            = null;
  let domain         = '';

  // ── Sync UI helpers ────────────────────────────────────────────────────────

  function applyConfigToForm(config = DEFAULT_CONFIG) {
    const c = normalizeConfig(config);
    speedInput.value        = String(c.speed);
    speedValue.textContent  = `${c.speed}x`;
    modeSelect.value        = c.mode;
    bottomOnlyInput.checked = c.bottomOnly;
  }

  function setControlsDisabled(disabled) {
    controlsEl.classList.toggle('disabled', disabled);
    speedInput.disabled      = disabled;
    modeSelect.disabled      = disabled;
    bottomOnlyInput.disabled = disabled;
  }

  function showStatus(message, type = 'success') {
    statusEl.textContent = message;
    statusEl.className   = `status ${type}`;
    setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'status'; }, 4000);
  }

  function updateToggleUI() {
    toggleInput.checked     = isEnabled;
    toggleState.textContent = isEnabled ? 'On' : 'Off';
  }

  function setRestrictedState(message) {
    isRestrictedPage        = true;
    isEnabled               = false;
    toggleInput.checked     = false;
    toggleInput.disabled    = true;
    switchRow.classList.add('disabled');
    setControlsDisabled(true);
    toggleState.textContent = 'Blocked';
    showStatus(message, 'info');
  }

  // ── Async helpers ──────────────────────────────────────────────────────────

  function getCurrentConfig() {
    return normalizeConfig({
      speed:      speedInput.value,
      bottomOnly: bottomOnlyInput.checked,
      mode:       modeSelect.value
    });
  }

  async function ensureContentScriptLoaded() {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
    } catch {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files:  ['dist/content.js']
      });
    }
  }

  async function persistConfig() {
    if (!domain) return null;
    const config = getCurrentConfig();
    await chrome.storage.local.set({ [`${domain}:catConfig`]: config });
    return config;
  }

  async function syncConfigIfRunning() {
    if (!isEnabled || isRestrictedPage || !tab?.id || !domain) return;
    const config = await persistConfig();
    await ensureContentScriptLoaded();
    await chrome.tabs.sendMessage(tab.id, { action: 'updateCatConfig', config });
  }

  // ── Event listeners (wired synchronously — popup is immediately interactive) ──

  speedInput.addEventListener('input', () => {
    speedValue.textContent = `${Number(speedInput.value)}x`;
  });

  speedInput.addEventListener('change', async () => {
    try { await syncConfigIfRunning(); } catch (e) { console.error('Speed sync failed', e); }
  });

  modeSelect.addEventListener('change', async () => {
    try { await syncConfigIfRunning(); } catch (e) { console.error('Mode sync failed', e); }
  });

  bottomOnlyInput.addEventListener('change', async () => {
    try { await syncConfigIfRunning(); } catch (e) { console.error('BottomOnly sync failed', e); }
  });

  toggleInput.addEventListener('change', async () => {
    if (isRestrictedPage) { toggleInput.checked = false; return; }

    if (!tab?.id || !domain) {
      toggleInput.checked = isEnabled;
      showStatus('Cannot apply styles on this page.', 'error');
      return;
    }

    const wantEnabled = toggleInput.checked;

    // Respond to the user immediately — no waiting for async
    isEnabled = wantEnabled;
    updateToggleUI();

    try {
      await ensureContentScriptLoaded();
      const config = await persistConfig();

      if (wantEnabled) {
        await chrome.tabs.sendMessage(tab.id, { action: 'startCatWalker', config });
        await chrome.storage.local.set({ [`${domain}:catEnabled`]: true });
        showStatus('Cat released!', 'success');
      } else {
        await chrome.tabs.sendMessage(tab.id, { action: 'stopCatWalker' });
        await chrome.storage.local.set({ [`${domain}:catEnabled`]: false });
        showStatus('Cat removed.', 'success');
      }
    } catch (error) {
      // Roll back toggle on failure
      isEnabled           = !wantEnabled;
      toggleInput.checked = isEnabled;
      updateToggleUI();
      console.error('Browser Pet toggle failed', error);
      const blockedReason = getBlockedReason(error);
      if (blockedReason) { setRestrictedState(blockedReason); return; }
      showStatus('Failed. Try refreshing the page.', 'error');
    }
  });

  // ── Show popup immediately, then fill in saved data asynchronously ───────────
  applyConfigToForm(DEFAULT_CONFIG);  // instant render with safe defaults
  toggleInput.disabled = true;        // locked until data is ready

  setTimeout(async () => {
    try {
      [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = tab?.url ? new URL(tab.url) : null;
      domain = url?.hostname ?? '';
      domainEl.textContent = domain || 'Unknown site';

      if (isProtectedPage(url)) {
        const pageName =
          url?.hostname === 'chromewebstore.google.com' || url?.hostname === 'chrome.google.com'
            ? 'Chrome Web Store pages'
            : 'protected Chrome pages';
        setRestrictedState(`Browser Pet is unavailable on ${pageName}.`);
        return;
      }

      if (domain) {
        const stored = await chrome.storage.local.get([
          `${domain}:catEnabled`,
          `${domain}:catConfig`
        ]);
        isEnabled = !!stored[`${domain}:catEnabled`];
        applyConfigToForm(stored[`${domain}:catConfig`] || DEFAULT_CONFIG);
      }

      updateToggleUI();
      toggleInput.disabled = false;  // ready
    } catch (e) {
      domainEl.textContent = 'Error loading page info';
      console.error('Popup init failed', e);
    }
  }, 0);
});

