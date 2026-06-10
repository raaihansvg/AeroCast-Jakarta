'use strict';

const API_BASE = () => 'http://localhost:5001';

const today = new Date();

const CLASS_INFO = {
  0: {
    label: 'BAIK',
    hex: '#10b981',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.2)',
    note: 'Udara segar dan bersih. Waktu terbaik untuk aktivitas luar ruangan.',
    advice: [
      'Kondisi udara sangat baik — aman untuk semua kalangan termasuk anak-anak dan lansia.',
      'Manfaatkan untuk olahraga pagi, jogging, atau bersepeda.',
      'Buka jendela rumah untuk sirkulasi udara segar yang optimal.',
    ],
  },
  1: {
    label: 'SEDANG',
    hex: '#f59e0b',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.2)',
    note: 'Kualitas udara dapat diterima. Kelompok sensitif perlu waspada.',
    advice: [
      'Dapat beraktivitas di luar ruangan secara normal bagi orang sehat.',
      'Kelompok sensitif (asma, lansia, anak-anak) disarankan memantau gejala.',
      'Pantau ISPU berkala jika berencana olahraga berat durasi panjang.',
    ],
  },
  2: {
    label: 'TIDAK SEHAT',
    hex: '#ef4444',
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
    note: 'Berpotensi merugikan kesehatan. Kurangi aktivitas di luar ruangan.',
    advice: [
      'Batasi aktivitas luar ruangan yang berat — kondisi berpotensi merugikan.',
      'Gunakan masker N95 jika terpaksa beraktivitas di luar ruangan.',
      'Ganti olahraga outdoor dengan aktivitas indoor.',
      'Aktifkan air purifier dan tutup jendela rumah.',
    ],
  },
  3: {
    label: 'SANGAT TIDAK SEHAT',
    hex: '#8b5cf6',
    bg: 'rgba(139,92,246,0.06)',
    border: 'rgba(139,92,246,0.2)',
    note: 'Kondisi kritis. Hindari semua aktivitas di luar ruangan.',
    advice: [
      'Kualitas udara kritis — efek kesehatan serius berpotensi terjadi pada semua kalangan.',
      'Hindari semua aktivitas fisik di luar ruangan tanpa terkecuali.',
      'Tetap di dalam ruangan dengan sirkulasi udara bersih dan air purifier aktif.',
      'Hubungi fasilitas kesehatan jika sesak napas atau iritasi parah.',
    ],
  },
};

const PROB_LABELS = ['Baik', 'Sedang', 'Tidak Sehat', 'Sangat Tidak Sehat'];
const PROB_HEX    = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function switchTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.stab, .npill').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');

  document.querySelectorAll(
    `.stab[id="stab-${name}"], .npill[data-tab="${name}"]`
  ).forEach(b => b.classList.add('active'));

  scrollToApp();
}

function scrollToApp() {
  const el = document.getElementById('appSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function animateCounters() {
  document.querySelectorAll('.hs-val[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}
setTimeout(animateCounters, 900);

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

(function initRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R = W * 0.35;
  const N = 6;

  const dataSets = [
    { vals: [0.4, 0.6, 0.3, 0.5, 0.7, 0.4], color: '#1f8fed', alpha: 0.12 },
    { vals: [0.6, 0.8, 0.5, 0.3, 0.55, 0.65], color: '#10b981', alpha: 0.08 },
  ];

  function angle(i) { return (i / N) * Math.PI * 2 - Math.PI / 2; }
  function point(r, i) {
    const a = angle(i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const p = point(R * r / 4, i);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(31,143,237,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (let i = 0; i < N; i++) {
      const p = point(R, i);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = 'rgba(31,143,237,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const t = Date.now() * 0.001;
    dataSets.forEach((ds, di) => {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const wave = 1 + 0.08 * Math.sin(t * 0.7 + i * 1.2 + di * 2.1);
        const r = R * ds.vals[i] * wave;
        const p = point(r, i);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = ds.color;
      ctx.globalAlpha = ds.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = ds.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    for (let i = 0; i < N; i++) {
      const wave = 1 + 0.08 * Math.sin(t * 0.7 + i * 1.2);
      const r = R * dataSets[0].vals[i] * wave;
      const p = point(r, i);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#1f8fed';
      ctx.globalAlpha = 0.65;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

const SLIDER_CONFIGS = {
  pm10:         { label: 'PM10',          unit: 'µg/m³', min: 0,  max: 350, step: 1,   def: 48   },
  pm25:         { label: 'PM2.5',         unit: 'µg/m³', min: 0,  max: 300, step: 1,   def: 32   },
  so2:          { label: 'SO₂',           unit: 'µg/m³', min: 0,  max: 200, step: 1,   def: 18   },
  co:           { label: 'CO',            unit: 'µg/m³', min: 0,  max: 100, step: 1,   def: 10   },
  o3:           { label: 'O₃',            unit: 'µg/m³', min: 0,  max: 250, step: 1,   def: 42   },
  no2:          { label: 'NO₂',           unit: 'µg/m³', min: 0,  max: 150, step: 1,   def: 16   },
  temp:         { label: 'Suhu',          unit: '°C',    min: 15, max: 42,  step: 0.1, def: 28.2 },
  humidity:     { label: 'Kelembaban',    unit: '%',     min: 20, max: 100, step: 1,   def: 75   },
  wind:         { label: 'Kec. Angin',    unit: 'm/s',   min: 0,  max: 15,  step: 0.1, def: 2.2  },
  precip_sum:   { label: 'Curah Hujan',   unit: 'mm',    min: 0,  max: 120, step: 0.1, def: 0.5  },
  precip_hours: { label: 'Durasi Hujan',  unit: 'jam',   min: 0,  max: 24,  step: 0.5, def: 0.2  },
  radiation:    { label: 'Radiasi Surya', unit: 'MJ/m²', min: 0,  max: 32,  step: 0.1, def: 15   },
};

function buildSlider(key, cfg) {
  const el = document.getElementById('f_' + key);
  if (!el) return;
  const decimals = cfg.step < 1 ? 1 : 0;
  const pct = ((cfg.def - cfg.min) / (cfg.max - cfg.min)) * 100;
  el.innerHTML = `
    <div class="field-label-top">
      <span class="fl-name">${cfg.label} <span class="fl-unit">${cfg.unit}</span></span>
      <span class="fl-val" id="val_${key}">${Number(cfg.def).toFixed(decimals)}</span>
    </div>
    <input type="range"
      id="sl_${key}"
      min="${cfg.min}" max="${cfg.max}" step="${cfg.step}" value="${cfg.def}"
      oninput="updateSlider('${key}', this, ${decimals})"
      style="background: linear-gradient(to right, var(--primary) ${pct}%, var(--border) ${pct}%)"
    />
  `;
}

function updateSlider(key, input, decimals) {
  const val = parseFloat(input.value);
  document.getElementById('val_' + key).textContent = val.toFixed(decimals);
  const pct = ((val - parseFloat(input.min)) / (parseFloat(input.max) - parseFloat(input.min))) * 100;
  input.style.background = `linear-gradient(to right, var(--primary) ${pct}%, var(--border) ${pct}%)`;
}

Object.entries(SLIDER_CONFIGS).forEach(([k, v]) => buildSlider(k, v));

function sliderVal(key) {
  return parseFloat(document.getElementById('sl_' + key).value);
}
function setSlider(key, val) {
  const el = document.getElementById('sl_' + key);
  if (!el) return;
  el.value = val;
  const cfg = SLIDER_CONFIGS[key];
  const decimals = cfg.step < 1 ? 1 : 0;
  updateSlider(key, el, decimals);
}

window._selectedStation = 'DKI1';

function selectStation(code, card) {
  window._selectedStation = code;
  document.querySelectorAll('.scard').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  const radio = card.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
}

document.addEventListener('DOMContentLoaded', () => {
  const first = document.querySelector('.scard');
  if (first) first.classList.add('selected');
});

const PRESETS = {
  clean: {
    pm10: 22, pm25: 12, so2: 10, co: 6, o3: 25, no2: 8,
    temp: 26.5, precip_sum: 15, precip_hours: 3, wind: 4.5, radiation: 8, humidity: 88,
    stasiun: 'DKI1', weekend: false, holiday: false,
  },
  moderate: {
    pm10: 58, pm25: 38, so2: 24, co: 12, o3: 48, no2: 22,
    temp: 28.5, precip_sum: 0, precip_hours: 0, wind: 2.2, radiation: 16.5, humidity: 73,
    stasiun: 'DKI3', weekend: false, holiday: false,
  },
  dry: {
    pm10: 115, pm25: 85, so2: 42, co: 22, o3: 95, no2: 38,
    temp: 32, precip_sum: 0, precip_hours: 0, wind: 1.2, radiation: 24, humidity: 52,
    stasiun: 'DKI2', weekend: false, holiday: false,
  },
  extreme: {
    pm10: 210, pm25: 165, so2: 85, co: 38, o3: 170, no2: 65,
    temp: 33.5, precip_sum: 0, precip_hours: 0, wind: 0.6, radiation: 28, humidity: 45,
    stasiun: 'DKI4', weekend: false, holiday: false,
  },
};

function loadPreset(key) {
  const p = PRESETS[key];
  ['pm10','pm25','so2','co','o3','no2','temp','humidity','wind','precip_sum','precip_hours','radiation']
    .forEach(k => setSlider(k, p[k]));
  document.getElementById('sim_stasiun').value = p.stasiun;
  document.getElementById('sim_weekend').checked = p.weekend;
  document.getElementById('sim_holiday').checked = p.holiday;
}

function buildSimInputs() {
  return {
    is_holiday_nasional: document.getElementById('sim_holiday').checked ? 1 : 0,
    is_weekend:          document.getElementById('sim_weekend').checked ? 1 : 0,
    is_off_day:          document.getElementById('sim_weekend').checked ? 1 : 0,
    jumlah_penduduk:     10562088,
    pm10:                sliderVal('pm10'),
    pm25:                sliderVal('pm25'),
    so2:                 sliderVal('so2'),
    co:                  sliderVal('co'),
    o3:                  sliderVal('o3'),
    no2:                 sliderVal('no2'),
    stasiun:             document.getElementById('sim_stasiun').value,
    tahun:               today.getFullYear(),
    bulan:               today.getMonth() + 1,
    hari:                today.getDate(),
    pm25_avail:          sliderVal('pm25') > 0 ? 1 : 0,
    temp_mean:           sliderVal('temp'),
    precip_sum:          sliderVal('precip_sum'),
    precip_hours:        sliderVal('precip_hours'),
    wind_speed_mean:     sliderVal('wind'),
    radiation_sum:       sliderVal('radiation'),
    humidity_mean:       sliderVal('humidity'),
  };
}

function renderResult(predicted_class, probabilities, container) {
  const info = CLASS_INFO[predicted_class];

  const adviceHTML = info.advice.map(a => `<li>${a}</li>`).join('');

  const probBars = probabilities.map((p, i) => `
    <div class="prob-row">
      <div class="prob-header">
        <span class="prob-name">${PROB_LABELS[i]}</span>
        <span class="prob-pct">${(p * 100).toFixed(1)}%</span>
      </div>
      <div class="prob-track">
        <div class="prob-fill" style="width:0;background:${PROB_HEX[i]};" data-w="${p * 100}"></div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="result-card" style="--rc-color:${info.hex};--rc-bg:${info.bg};--rc-border:${info.border};">
      <div class="result-eyebrow">Hasil Prediksi ISPU</div>
      <div class="result-class">${info.label}</div>
      <div class="result-note">${info.note}</div>
    </div>

    <div class="card" style="margin-bottom:14px;">
      <div class="card-eyebrow">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2v2.5l1.8 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
        Distribusi Keyakinan Model
      </div>
      <div class="prob-section">${probBars}</div>
    </div>

    <div class="card">
      <div class="card-eyebrow">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Rekomendasi Kesehatan
      </div>
      <ul class="advice-list">${adviceHTML}</ul>
    </div>
  `;

  requestAnimationFrame(() => {
    setTimeout(() => {
      container.querySelectorAll('.prob-fill').forEach(el => {
        el.style.width = el.dataset.w + '%';
      });
    }, 80);
  });
}


async function callPredict(inputs) {
  const res = await fetch(API_BASE() + '/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function checkHealth() {
  const dot = document.getElementById('apiStatus');
  dot.className = 'api-dot ping';
  try {
    const res = await fetch(API_BASE() + '/api/health', {
      signal: AbortSignal.timeout(4500),
    });
    const d = await res.json();
    dot.className = 'api-dot ' + (d.model_loaded ? 'ok' : 'err');
  } catch {
    dot.className = 'api-dot err';
  }
}

async function fetchRealtime() {
  const btn    = document.getElementById('btnRealtime');
  const spin   = document.getElementById('rtSpinner');
  const status = document.getElementById('rtStatus');
  const stasiun = window._selectedStation || 'DKI1';

  btn.disabled = true;
  spin.style.display = 'block';
  status.innerHTML = '';

  try {
    const res = await fetch(API_BASE() + '/api/realtime?stasiun=' + stasiun);
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error || `HTTP ${res.status}`);
    }
    const rtData = await res.json();
    const inputs = { ...rtData.inputs };

    status.innerHTML = `
      <div class="status-msg success">
        <span class="stn-badge">📍 ${rtData.station_name}</span>
        <span class="rt-timestamp">Data: ${rtData.time || '—'}</span>
      </div>
    `;

    const PARAMS = [
      ['PM2.5',      inputs.pm25,            'µg/m³'],
      ['PM10',       inputs.pm10,            'µg/m³'],
      ['SO₂',        inputs.so2,             'µg/m³'],
      ['CO',         inputs.co,              'µg/m³'],
      ['O₃',         inputs.o3,              'µg/m³'],
      ['NO₂',        inputs.no2,             'µg/m³'],
      ['Suhu',       inputs.temp_mean,       '°C'],
      ['Kelembaban', inputs.humidity_mean,   '%'],
      ['Kec. Angin', inputs.wind_speed_mean, 'm/s'],
      ['Hujan',      inputs.precip_sum,      'mm'],
    ];

    document.getElementById('rtParamsGrid').innerHTML = PARAMS.map(([name, val, unit]) => `
      <div class="param-item">
        <div class="param-name">${name}</div>
        <div class="param-val">${typeof val === 'number' ? val.toFixed(1) : val}<span class="param-unit"> ${unit}</span></div>
      </div>
    `).join('');
    document.getElementById('rtParamsCard').style.display = 'block';

    const pred = await callPredict(inputs);
    renderResult(pred.predicted_class, pred.probabilities,
      document.getElementById('rtResultCol'));

  } catch (err) {
    status.innerHTML = `
      <div class="status-msg error">
        ⚠ ${err.message}
        <br/><small style="opacity:0.7;display:block;margin-top:4px;">Pastikan backend Python sudah berjalan dan URL sudah benar.</small>
      </div>
    `;
  } finally {
    btn.disabled = false;
    spin.style.display = 'none';
  }
}

async function runSimulation() {
  const btn    = document.getElementById('btnSimulate');
  const spin   = document.getElementById('simSpinner');
  const status = document.getElementById('simStatus');

  btn.disabled = true;
  spin.style.display = 'block';
  status.innerHTML = '';

  try {
    const inputs = buildSimInputs();
    const pred   = await callPredict(inputs);
    renderResult(pred.predicted_class, pred.probabilities,
      document.getElementById('simResultCol'));
  } catch (err) {
    status.innerHTML = `
      <div class="status-msg error">
        ⚠ ${err.message}
        <br/><small style="opacity:0.7;display:block;margin-top:4px;">Pastikan backend Python sudah berjalan.</small>
      </div>
    `;
  } finally {
    btn.disabled = false;
    spin.style.display = 'none';
  }
}


checkHealth();