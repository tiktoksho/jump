// ─── Cadastro Page ────────────────────────────────────────────────────────────
function renderCadastro(el) {
  const refCode =
    (typeof window.captureReferralFromUrl === 'function' ? window.captureReferralFromUrl() : '') ||
    sessionStorage.getItem('ref_code') ||
    (() => {
      const fromSearch = new URLSearchParams(window.location.search).get('ref');
      if (fromSearch) return fromSearch;
      const rawHash = window.location.hash || '';
      const qPos = rawHash.indexOf('?');
      if (qPos >= 0) return new URLSearchParams(rawHash.slice(qPos + 1)).get('ref') || '';
      return '';
    })() ||
    '';

  el.innerHTML = `
    <style>
      #page-cadastro.active {
        display: flex; align-items: center; justify-content: center;
        min-height: 100vh; width: 100%; overflow-x: hidden;
        padding: 24px 16px;
        background:
          radial-gradient(1200px 500px at 10% -5%, rgba(37,99,235,0.18), transparent 60%),
          radial-gradient(900px 480px at 100% 0%, rgba(59,130,246,0.14), transparent 58%),
          linear-gradient(180deg, #edf4ff 0%, #f7faff 100%);
      }
      .reg-wrap {
        width: 100%; max-width: 420px; box-sizing: border-box;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(37,99,235,0.16);
        border-radius: 20px; padding: 40px 32px;
        box-shadow: 0 22px 60px rgba(15,23,42,0.12), 0 4px 18px rgba(37,99,235,0.08);
        animation: popIn 0.35s ease both;
      }
      .reg-logo {
        display: flex; align-items: center; justify-content: center; gap: 10px;
        font-size: 20px; font-weight: 800; color: #2563eb; margin-bottom: 8px;
      }
      .reg-title {
        font-size: 22px; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 6px;
      }
      .reg-sub {
        font-size: 14px; color: rgba(15,23,42,0.50); text-align: center; margin-bottom: 28px;
      }
      .reg-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
      .reg-label {
        font-size: 13px; font-weight: 600; color: rgba(15,23,42,0.65); letter-spacing: 0.2px;
      }
      .reg-input-wrap { position: relative; }
      .reg-input {
        width: 100%; padding: 12px 16px; border-radius: 8px;
        background: #f8faff; border: 1.5px solid rgba(37,99,235,0.15);
        color: #0f172a; font-size: 15px; font-family: inherit;
        outline: none; transition: border-color 0.2s, background 0.2s;
      }
      .reg-input::placeholder { color: rgba(15,23,42,0.30); }
      .reg-input:focus { border-color: #2563eb; background: #eff4ff; }
      .reg-input.error { border-color: #ef4444; }
      .reg-input.valid { border-color: #22c55e; }
      .reg-eye {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        cursor: pointer; color: rgba(15,23,42,0.35); display: flex; align-items: center;
        transition: color 0.2s;
      }
      .reg-eye:hover { color: rgba(15,23,42,0.65); }
      .reg-input.has-icon { padding-right: 44px; }
      .reg-error { font-size: 12px; color: #ef4444; font-weight: 600; display: none; }

      /* Password strength */
      .reg-strength { margin-top: 8px; display: none; }
      .reg-strength-row {
        display: flex; justify-content: space-between;
        font-size: 12px; color: rgba(15,23,42,0.45); margin-bottom: 5px;
      }
      .reg-strength-bar {
        height: 4px; background: rgba(15,23,42,0.10); border-radius: 50px; overflow: hidden;
      }
      .reg-strength-fill { height: 100%; border-radius: 50px; width: 0; transition: 0.35s ease; }

      /* Terms box */
      .reg-terms {
        background: rgba(37,99,235,0.04);
        border: 1px solid rgba(37,99,235,0.12);
        border-radius: 8px; padding: 12px 14px;
        font-size: 13px; color: rgba(15,23,42,0.50); margin-bottom: 20px; line-height: 1.5;
      }
      .reg-terms strong { color: #2563eb; }

      /* Submit */
      .reg-btn {
        width: 100%; padding: 14px; border-radius: 8px; border: none; cursor: pointer;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #3b82f6 100%);
        color: #fff; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;
        display: flex; align-items: center; justify-content: center; gap: 10px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 10px 28px rgba(37,99,235,0.35);
      }
      .reg-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(37,99,235,0.50); }
      .reg-btn:active { transform: scale(0.98); }
      .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

      /* Footer links */
      .reg-footer {
        text-align: center; margin-top: 20px;
        font-size: 14px; color: rgba(15,23,42,0.45);
      }
      .reg-footer a {
        color: #2563eb; font-weight: 700; cursor: pointer; text-decoration: none;
        transition: opacity 0.2s;
      }
      .reg-footer a:hover { opacity: 0.75; }
      .reg-back {
        display: flex; align-items: center; justify-content: center; gap: 6px;
        margin-top: 12px; font-size: 13px; color: rgba(15,23,42,0.35);
        cursor: pointer; background: none; border: none; transition: color 0.2s;
      }
      .reg-back:hover { color: rgba(15,23,42,0.60); }
    </style>

    <div class="reg-wrap">
      <!-- Logo -->
      <div class="reg-logo brand-logo-wrap">
        <img class="brand-logo-img" src="" alt="logo" style="display:none;height:36px;object-fit:contain"/>
        <svg class="brand-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <span class="brand-name">HelixWin</span>
      </div>
      <h2 class="reg-title">Criar conta grátis</h2>
      <p class="reg-sub">Preencha os dados e comece a ganhar agora</p>

      <form id="cad-form" novalidate>

        <!-- Telefone -->
        <div class="reg-group">
          <label class="reg-label">Telefone (WhatsApp)</label>
          <input id="c-tel" class="reg-input" type="tel" placeholder="(11) 99999-0000" autocomplete="tel" inputmode="numeric" />
          <span class="reg-error" id="c-tel-err"></span>
        </div>

        <!-- Senha -->
        <div class="reg-group">
          <label class="reg-label">Senha</label>
          <div class="reg-input-wrap">
            <input id="c-senha" class="reg-input has-icon" type="password" placeholder="Mínimo 6 caracteres" autocomplete="new-password" />
            <span class="reg-eye" id="c-toggle1" title="Mostrar/ocultar senha">
              <svg id="c-eye1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
          </div>
          <div class="reg-strength" id="c-strength-bar">
            <div class="reg-strength-row">
              <span>Força da senha</span>
              <span id="c-strength-text"></span>
            </div>
            <div class="reg-strength-bar">
              <div class="reg-strength-fill" id="c-strength-fill"></div>
            </div>
          </div>
          <span class="reg-error" id="c-senha-err"></span>
        </div>

        <!-- Código de indicação salvo em segundo plano (sem aviso visual) -->
        <input id="c-ref" type="hidden" value="${refCode}" />

        <!-- Termos -->
        <div class="reg-terms">
          Ao criar conta você concorda com os <strong>Termos de Uso</strong>
          e confirma ter mais de 18 anos.
        </div>

        <button type="submit" class="reg-btn" id="c-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          CRIAR CONTA GRÁTIS
        </button>
      </form>

      <div class="reg-footer">
        Já tem conta? <a onclick="navigate('#login')">Fazer login</a>
      </div>
      <div style="text-align:center;margin-top:12px">
        <button class="reg-back" onclick="navigate('#landing')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar ao início
        </button>
      </div>
    </div>
  `;

  const form    = document.getElementById('cad-form');
  const telEl   = document.getElementById('c-tel');
  const senhaEl = document.getElementById('c-senha');
  const refEl   = document.getElementById('c-ref');
  const btn     = document.getElementById('c-btn');

  // ── Verificar se registro está aberto ────────────────────────────────────
  fetch('/api/public/config?_=' + Date.now())
    .then(r => r.json())
    .catch(() => ({}))
    .then(cfg => {
      if (cfg.registro_aberto === false) {
        // Desabilita o form e mostra mensagem
        btn.disabled = true;
        btn.textContent = 'Cadastro temporariamente fechado';
        btn.style.opacity = '0.5';
        const warn = document.createElement('div');
        warn.style.cssText = 'background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.20);border-radius:8px;padding:12px 14px;font-size:13px;color:#b91c1c;text-align:center;margin-top:12px';
        warn.textContent = '⚠️ O cadastro de novos usuários está temporariamente suspenso.';
        btn.parentElement.appendChild(warn);
      }
    });

  // ── Toggle visibilidade de senha ──────────────────────────────────────────
  const eyeSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeOffSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  document.getElementById('c-toggle1').addEventListener('click', () => {
    const show = senhaEl.type === 'password';
    senhaEl.type = show ? 'text' : 'password';
    document.getElementById('c-toggle1').innerHTML = show ? eyeOffSVG : eyeSVG;
  });

  // ── Força da senha ────────────────────────────────────────────────────────
  senhaEl.addEventListener('input', () => {
    const v   = senhaEl.value;
    const bar = document.getElementById('c-strength-bar');
    bar.style.display = v ? 'block' : 'none';
    let score = 0;
    if (v.length >= 6)          score++;
    if (v.length >= 10)         score++;
    if (/[A-Z]/.test(v))        score++;
    if (/[0-9]/.test(v))        score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const steps = [
      { w: '20%', color: '#ff4d6d', t: 'Muito fraca' },
      { w: '40%', color: '#ff8c42', t: 'Fraca' },
      { w: '60%', color: '#ffb800', t: 'Média' },
      { w: '80%', color: '#4d9eff', t: 'Forte' },
      { w: '100%',color: '#00c97a', t: 'Muito forte' },
    ];
    const s = steps[Math.min(score, 4)];
    const fill = document.getElementById('c-strength-fill');
    const text = document.getElementById('c-strength-text');
    fill.style.width      = s.w;
    fill.style.background = s.color;
    text.textContent      = s.t;
    text.style.color      = s.color;
    _regClearErr(senhaEl, 'c-senha-err');
  });

  // ── Máscara de telefone ───────────────────────────────────────────────────
  telEl.addEventListener('input', () => {
    let v = telEl.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    telEl.value = v;
    _regClearErr(telEl, 'c-tel-err');
  });

  // ── Submit ────────────────────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const telRaw = telEl.value.replace(/\D/g, '');
    const senha  = senhaEl.value;
    const ref    = refEl.value.trim();

    if (!telRaw || telRaw.length < 10) {
      _regSetErr(telEl, 'c-tel-err', 'Informe um telefone válido com DDD.'); valid = false;
    }
    if (!senha || senha.length < 6) {
      _regSetErr(senhaEl, 'c-senha-err', 'Senha deve ter pelo menos 6 caracteres.'); valid = false;
    }
    if (!valid) return;

    btn.disabled = true;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" style="animation:spin .7s linear infinite"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.06-8.5"/></svg> Criando conta...`;

    try {
      const payload = { telefone: telRaw, senha };
      if (ref) payload.codigo_indicacao = ref;

      await API.register(payload);
      sessionStorage.removeItem('ref_code');
      showToast('Conta criada com sucesso! Bem-vindo!', 'success');
      setTimeout(() => navigate('#painel'), 600);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> CRIAR CONTA GRÁTIS`;
    }
  });
}

// ── Helpers de validação ──────────────────────────────────────────────────────
function _regSetErr(inputEl, errId, msg) {
  inputEl.classList.add('error');
  const el = document.getElementById(errId);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function _regClearErr(inputEl, errId) {
  inputEl.classList.remove('error');
  const el = document.getElementById(errId);
  if (el) el.style.display = 'none';
}
