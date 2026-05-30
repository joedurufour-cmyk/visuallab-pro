const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ── ACTRESS DATABASE ──────────────────────────────────────────
const ACTRESSES = [
  'Anya Taylor-Joy','Tessa Thompson','Zoe Saldana','Gal Gadot','Lupita Nyongo',
  'Priyanka Chopra','Salma Hayek','Eva Green','Cate Blanchett','Charlize Theron',
  'Margot Robbie','Brie Larson','Scarlett Johansson','Jennifer Lawrence','Viola Davis',
  'Halle Berry','Naomi Scott','Michelle Rodriguez','Emilia Clarke','Daisy Ridley',
  'Pom Klementieff','Karen Gillan','Letitia Wright','Elizabeth Olsen','Florence Pugh',
  'Danai Gurira','Rebecca Ferguson','Tilda Swinton','Angela Bassett','Ana de Armas',
  'Alexandra Daddario','Kate Beckinsale','Milla Jovovich','Emily Blunt','Zendaya',
  'Mackenzie Davis','Lena Headey','Carrie-Anne Moss','Uma Thurman','Natalie Portman',
  'Keira Knightley','Anne Hathaway','Zoe Kravitz','Rachel Weisz','Marion Cotillard',
  'Penelope Cruz','Monica Bellucci','Sofia Boutella','Noomi Rapace','Florence Kasumba'
];

const ACTRESS_DESC = {
  'Anya Taylor-Joy': 'pale intense gaze, alien cheekbones, high contrast features',
  'Tessa Thompson': 'dark regal features, warrior energy, strong bone structure',
  'Zoe Saldana': 'lean dancer physique, strong jaw, luminous dark skin',
  'Gal Gadot': 'tall warrior, Mediterranean features, commanding presence',
  'Lupita Nyongo': 'luminous dark skin, expressive face, royal energy',
  'Priyanka Chopra': 'exotic power, dark intense eyes, sharp features',
  'Salma Hayek': 'Latin curves, black hair, fierce dark eyes',
  'Eva Green': 'dark mysterious, French elegance, haunting gaze',
  'Cate Blanchett': 'sharp elf-like precision, ice blonde, otherworldly',
  'Charlize Theron': 'Nordic warrior, hard jawline, ice blue eyes',
  'Margot Robbie': 'Australian blonde, expressive eyes, sharp cheekbones',
  'Brie Larson': 'athletic blonde, strong build, determined gaze',
  'Scarlett Johansson': 'red hair, grey-blue eyes, curves, smoky look',
  'Ana de Armas': 'Cuban-Spanish, doe-eyed intensity, warm skin',
  'Zendaya': 'tall elegant, modern royalty, sharp angular beauty'
};

// ── MJ PROMPT ENGINE ─────────────────────────────────────────
const SETTINGS = {
  void: 'void — pure black, no floor, no objects, single brutal studio key light',
  desert: 'dust storm, golden particles, harsh 90° sunlight, heat haze shimmer',
  rain: 'rain-soaked street, water droplets on skin, neon reflections, wet asphalt',
  rooftop: 'city rooftop at golden hour, bokeh skyline, cinematic depth, smoke haze',
  space: 'low Earth orbit, planet curvature, stars infinite field, zero gravity',
  gym: 'industrial gym, iron weights, chalk dust, fluorescent overhead, sweat mist',
  arctic: 'tundra, frozen wasteland, ice crystals, cold breath mist, grey overcast',
  jungle: 'dense tropical canopy, dappled light shafts, humidity haze, green deep'
};

const PHYS = {
  brutal: 'low-waist exposing full brutal 8-pack rectus abdominis with deep separations, serratus anterior fingers rising above iliac, oblique ridges razor-carved, vascular lower abdomens, pores hyper-visible, sweat beads, dry elite conditioning, skin texture maximum, zero smoothing',
  athletic: 'low-waist exposing defined rectus abdominis, serratus visible, athletic female build, functional muscle tone, real skin texture with natural grain',
  curves: 'low-waist, defined midsection with feminine curves, natural obliques, healthy skin grain, elegant proportions'
};

const LIGHT = {
  '45deg': 'hard 45° key light creating razor shadows across abs and face, no fill light, pure shadow side',
  side: 'dramatic split side lighting, hard shadow bisecting face and torso, neon rim accent',
  back: 'strong backlight, silhouette edges glowing, body halo, deep front shadow',
  golden: 'golden hour directional warmth, long shadows, rimlight from low sun, cinematic flare',
  studio: 'studio butterfly light, soft box overhead, clean shadows, fashion editorial quality',
  neon: 'cyberpunk neon uplighting, magenta and cyan split, rain-reflection bounce'
};

function detectSetting(text) {
  const l = text.toLowerCase();
  if (l.includes('void') || l.includes('negro') || l.includes('black')) return SETTINGS.void;
  if (l.includes('desert') || l.includes('desierto')) return SETTINGS.desert;
  if (l.includes('rain') || l.includes('lluvia') || l.includes('wet') || l.includes('mojad')) return SETTINGS.rain;
  if (l.includes('rooftop') || l.includes('azotea') || l.includes('city')) return SETTINGS.rooftop;
  if (l.includes('space') || l.includes('espacio')) return SETTINGS.space;
  if (l.includes('gym') || l.includes('gimnasio')) return SETTINGS.gym;
  if (l.includes('arctic') || l.includes('tundra') || l.includes('frio')) return SETTINGS.arctic;
  if (l.includes('jungle') || l.includes('selva')) return SETTINGS.jungle;
  return SETTINGS.void;
}

function detectLight(text) {
  const l = text.toLowerCase();
  if (l.includes('45') || l.includes('brutal')) return LIGHT['45deg'];
  if (l.includes('side') || l.includes('lateral')) return LIGHT.side;
  if (l.includes('back') || l.includes('silueta')) return LIGHT.back;
  if (l.includes('golden') || l.includes('dorado') || l.includes('sunset')) return LIGHT.golden;
  if (l.includes('studio') || l.includes('estudio')) return LIGHT.studio;
  if (l.includes('neon') || l.includes('cyber')) return LIGHT.neon;
  return LIGHT['45deg'];
}

function detectClothing(text) {
  const l = text.toLowerCase();
  if (l.includes('tactical') || l.includes('tactica')) return 'tactical armor bikini, cross-back straps under tension, metallic accents';
  if (l.includes('bikini')) return 'minimal tactical bikini, low-waist female form under tension';
  if (l.includes('wet') || l.includes('mojad') || l.includes('soaked')) return 'casual soaked clothing clinging to female form, wet fabric translucent, low-waist';
  if (l.includes('duster') || l.includes('gabardina')) return 'long leather tactical duster over bare female frame, open front';
  if (l.includes('armor') || l.includes('armadura')) return 'battle armor plate, anatomical fit, open core configuration, metallic finish';
  if (l.includes('bodysuit') || l.includes('body')) return 'skintight bodysuit, matte technical fabric, tension mapping over core';
  return 'minimal tactical gear, female form, skin exposure maximum';
}

function detectPhysique(text) {
  const l = text.toLowerCase();
  if (l.includes('brutal') || l.includes('extreme') || l.includes('hiper') || l.includes('shredded')) return PHYS.brutal;
  if (l.includes('curv') || l.includes('curvas')) return PHYS.curves;
  return PHYS.athletic;
}

function detectActress(text) {
  const l = text.toLowerCase().replace(/-/g, ' ');
  for (const name of ACTRESSES) {
    const full = name.toLowerCase().replace(/-/g, ' ');
    const first = full.split(' ')[0];
    if (l.includes(full) || l.includes(first)) return name;
  }
  return null;
}

function detectHeight(text) {
  const m = text.match(/(\d)'(\d{1,2})"/);
  return m ? m[0] : "6'2\"";
}

function detectRatio(text) {
  if (text.includes('65:35') || text.includes('65 35')) return '65:35';
  if (text.includes('75:25') || text.includes('75 25')) return '75:25';
  return '70:30';
}

function detectStylize(text) {
  const l = text.toLowerCase();
  if (l.includes('fantasy') || l.includes('epic')) return 400;
  if (l.includes('crudo') || l.includes('raw') || l.includes('docu')) return 240;
  return 250;
}

// ── CORE TRANSLATE FUNCTION ───────────────────────────────────
function kimify(text, options = {}) {
  const actress = detectActress(text);
  const desc = actress && ACTRESS_DESC[actress] ? ACTRESS_DESC[actress] : '';
  const height = detectHeight(text);
  const ratio = detectRatio(text);
  const physique = detectPhysique(text);
  const clothing = detectClothing(text);
  const setting = detectSetting(text);
  const light = detectLight(text);
  const stylize = options.stylize || detectStylize(text);
  const ar = options.ar || '9:20';
  const chaos = options.chaos || 15;

  // MJ hierarchy: Subject → Physique → Clothing → Setting → Light → Camera
  const parts = [];

  // Token 1-2: Subject anchor (MUST be first 10 tokens)
  if (actress) {
    parts.push(`Cinematic full-body portrait of ${actress}, female`);
    if (desc) parts.push(desc);
  } else {
    parts.push('Cinematic full-body portrait of female figure');
  }

  // Token 3-5: Stature (physique priority signal to MJ)
  parts.push(`${height} extreme torso elongation ${ratio}`);

  // Physique block — must precede clothing
  parts.push(physique);

  // Clothing
  parts.push(clothing);

  // Setting
  parts.push(setting);

  // Light
  parts.push(light);

  // Camera lock
  parts.push('Shot on ARRI Alexa 65 with Cooke S7i 50mm, f/2.8, photorealistic, desaturated, film grain');

  const prompt = parts.join(', ') + ` --ar ${ar} --raw --stylize ${stylize} --c ${chaos} --v 8.1`;

  const words = prompt.split(/\s+/);
  const physWords = ['abs','abdominis','torso','oblique','serratus','rectus','physique'];
  let physIndex = -1;
  for (let i = 0; i < Math.min(15, words.length); i++) {
    if (physWords.some(p => words[i].toLowerCase().includes(p))) { physIndex = i; break; }
  }

  return {
    prompt,
    tokens: words.length,
    physiqueFirst: physIndex > -1 && physIndex < 10,
    actress: actress || null,
    settings: { ar, stylize, chaos, height, ratio }
  };
}

// ── VARIATIONS ENGINE ─────────────────────────────────────────
function generateVariations(basePrompt, settings) {
  const variations = [];
  const { chaos, stylize } = settings;
  
  const paramRegex = /--[a-zA-Z0-9\-]+(?:\s+[\w:/.\-]+)?/g;
  const params = basePrompt.match(paramRegex) || [];
  const cleanBase = basePrompt.replace(paramRegex, '').trim();

  const lightMods = [
    { label: 'Hard 45° Kill', mod: 'single hard 45° key light, deep razor shadow, no fill, max contrast' },
    { label: 'Neon Split', mod: 'magenta neon left, cyan neon right, split color lighting, rain bounce' },
    { label: 'Golden Rim', mod: 'sunset rim backlight, warm golden halo, purple shadow fill' },
    { label: 'Void Cenital', mod: 'single overhead cenital spot, white cold, full body shadow below' }
  ];

  const stylizeMods = [
    { label: `s${stylize} Cinema`, value: stylize },
    { label: 's240 Raw', value: 240 },
    { label: 's280 Balanced', value: 280 },
    { label: 's400 Epic', value: 400 }
  ];

  const chaosMods = [
    { label: `c${chaos} Base`, value: chaos },
    { label: 'c5 Locked', value: 5 },
    { label: 'c20 Chaos', value: 20 },
    { label: 'c35 Wild', value: 35 }
  ];

  // Generate cross-product variations (light × stylize — 4 combos)
  for (let i = 0; i < 4; i++) {
    const lm = lightMods[i];
    const sm = stylizeMods[i];
    const cm = chaosMods[Math.min(i, chaosMods.length - 1)];
    
    const paramStr = params
      .map(p => {
        if (p.startsWith('--s') || p.startsWith('--stylize')) return `--stylize ${sm.value}`;
        if (p.startsWith('--c ') || p.startsWith('--chaos')) return `--c ${cm.value}`;
        return p;
      })
      .join(' ');

    // Replace lighting segment in clean base
    const lightRegex = /(hard \d+°.*?(?:,|$))|(dramatic.*?light.*?(?:,|$))|(golden.*?light.*?(?:,|$))|(neon.*?light.*?(?:,|$))|(backlight.*?(?:,|$))/i;
    let varBase = cleanBase.replace(lightRegex, lm.mod + ',') || cleanBase + ', ' + lm.mod;

    variations.push({
      id: i + 1,
      label: `${lm.label} · ${sm.label}`,
      prompt: `${varBase} ${paramStr || `--ar 9:20 --raw --stylize ${sm.value} --c ${cm.value} --v 8.1`}`.replace(/\s+/g, ' ').trim(),
      tags: { light: lm.label, stylize: sm.value, chaos: cm.value }
    });
  }

  return variations;
}

// ── ROUTES ────────────────────────────────────────────────────

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', engine: 'VisualLab PRO · PERA-v1 MJ' });
});

// Translate NL → MJ prompt
app.post('/api/translate', (req, res) => {
  const { text, ar, chaos, stylize } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text required' });
  try {
    const result = kimify(text.trim(), { ar, chaos, stylize });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Generate variations from base prompt
app.post('/api/variations', (req, res) => {
  const { prompt, count = 4, settings = {} } = req.body;
  if (!prompt || !prompt.trim()) return res.status(400).json({ error: 'prompt required' });
  
  const paramRegex = /--[a-zA-Z0-9\-]+(?:\s+[\w:/.\-]+)?/g;
  const params = {};
  (prompt.match(paramRegex) || []).forEach(p => {
    const parts = p.trim().split(/\s+/);
    const key = parts[0].replace(/^--/, '');
    params[key] = parts[1] || true;
  });

  const cfg = {
    chaos: parseInt(settings.chaos || params.c || params.chaos || 15),
    stylize: parseInt(settings.stylize || params.s || params.stylize || 250),
    ar: settings.ar || params.ar || '9:20'
  };

  try {
    const variations = generateVariations(prompt, cfg);
    res.json({ variations, base_params: cfg });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Actress list
app.get('/api/actresses', (req, res) => {
  const list = ACTRESSES.map(name => ({
    name,
    desc: ACTRESS_DESC[name] || ''
  }));
  res.json({ actresses: list, count: list.length });
});

// Build prompt from structured builder
app.post('/api/build', (req, res) => {
  const { subjects, clothing, environment, camera, physique } = req.body;
  if (!subjects || !subjects.length) return res.status(400).json({ error: 'subjects required' });

  const parts = [];
  const subjectStr = subjects.length === 1
    ? subjects[0].name
    : subjects.map(s => s.name).join(' and ');

  parts.push(`Cinematic full-body portrait of ${subjectStr}, female, ${subjects[0].height || "6'2\""} extreme torso elongation ${subjects[0].ratio || '70:30'}`);
  parts.push(PHYS[physique?.type || 'brutal'] || PHYS.brutal);
  
  if (clothing) {
    const clothStr = `${clothing.color || 'black'} ${clothing.state || 'sweat'} ${clothing.material || 'latex'} ${clothing.base || 'tactical bikini'}${clothing.emblem && clothing.emblem !== 'None' ? ` with ${clothing.emblem} emblem` : ''}`;
    parts.push(clothStr);
  }

  if (environment) {
    const envStr = `${environment.time || 'night'} ${environment.weather || 'clear'} ${environment.scene || 'void'}, ${LIGHT[environment.light] || LIGHT['45deg']}`;
    parts.push(envStr);
  }

  const lens = camera?.lens || '50mm';
  const aperture = camera?.aperture || 'f/2.8';
  const stylize = camera?.stylize || 250;
  parts.push(`Shot on ARRI Alexa 65 with Cooke S7i ${lens}, ${aperture}, photorealistic, film grain`);

  const prompt = parts.join(', ') + ` --ar 9:20 --raw --stylize ${stylize} --c 15 --v 8.1`;
  
  res.json({
    prompt,
    tokens: prompt.split(/\s+/).length,
    subjects: subjects.map(s => s.name)
  });
});

// Save to log (in-memory — use DB in prod)
const sessionLog = [];
app.post('/api/log', (req, res) => {
  const { prompt, status, meta } = req.body;
  if (!prompt || !status) return res.status(400).json({ error: 'prompt + status required' });
  const entry = {
    id: Date.now(),
    prompt,
    status,
    meta: meta || {},
    loggedAt: new Date().toISOString()
  };
  sessionLog.unshift(entry);
  if (sessionLog.length > 200) sessionLog.pop();
  res.json({ ok: true, entry });
});

app.get('/api/log', (req, res) => {
  res.json({ log: sessionLog, count: sessionLog.length });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VisualLab PRO · running on :${PORT}`));
