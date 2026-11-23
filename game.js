{
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const hud = document.getElementById('hud'), msg = document.getElementById('msg'), sndBtn = document.getElementById('snd');
let W, H;
const resize = () => {
  const dpr = devicePixelRatio || 1;
  W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
addEventListener('resize', resize); resize();

let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;   // карта — всегда одинаковая
const rr = (a, b) => a + Math.random() * (b - a);                          // враги — каждый раз по-новому
const dist = (a, b, c, d) => Math.hypot(a - c, b - d);

// ================= ЯЗЫК =================
const T = {
  ru: {
    title: 'Дорога домой',
    story: 'Зимний вечер, около десяти часов. Нужно пешком добраться из Верхнеусинского в Нижнеусинское — через три моста. Твой дом — с зелёной крышей и двумя светящимися окнами, в дальнем северо-восточном углу села. Вокруг темнота и мороз, и лучше, чтобы по дороге тебя никто не заметил. По пути спрятаны пять секретов.',
    resume: 'Продолжить', restart: 'Начать заново',
    nickLabel: 'Имя для доски почёта', nickPh: 'Игрок', diffLabel: 'Сложность', start: 'Начать',
    keys: 'WASD или стрелки — идти · Shift — бежать · M — звук · Esc — пауза',
    hint: 'WASD — идти · Shift — бежать (шумно) · M — звук · Esc — пауза · или зажми мышь там, куда идти',
    board: 'Доска почёта', shared: 'Общая доска', local: 'Рекорды на этом устройстве', empty: 'Пока никто не дошёл. Будь первым.',
    sndOn: 'Звук: вкл', sndOff: 'Звук: выкл',
    bridges: 'Мосты', run: 'бег', warm: 'Тепло', cold: 'Холодно!', woof: 'гав!',
    intro: 'Верхнеусинское, около 22:00.<br>Дойди до дома в Нижнеусинском: зелёная крыша, два светящихся окна, северо-восточный угол села.<br><small>Иди по дороге на северо-запад. Тепло уходит — греться у окон и на мостах.</small>',
    b1: 'Мост 1 — протока', b2: 'Мост 2 — через Ус', b3: 'Мост 3 — протока у Нижнеусинского',
    b3note: 'Последний мост. Дом — на самой дальней улице, справа: зелёная крыша, два окна.',
    warmed: 'Согрелся. Сохранено.',
    lose: 'Проигрыш', back: 'Возврат к последнему мосту…',
    drowned: 'Утонул.', foundItem: 'Найдено', secrets: 'Секреты',
    mitten: 'варежка', sled: 'санки', cone: 'кедровая шишка', coin: 'монетка', whistle: 'свисток',
    froze: 'Замёрз.', dogs: 'Собаки догнали.', wolves: 'Волки.', seen: 'Тебя заметили взрослые.',
    win: 'Победа!', winText: 'Ты дома. Внутри тепло.', time: 'Время', tries: 'попыток', record: 'Новый личный рекорд!',
    player: 'Игрок',
    easy: ['Лёгкий', 'Тепла больше, свет шире, враги медленнее'],
    normal: ['Нормальный', 'Как задумано'],
    hard: ['Сложный', 'Мороз сильнее, свет уже, враги чутче'],
  },
  en: {
    title: 'Return Home',
    story: 'A winter evening, around ten o\'clock. You need to walk from Verkhneusinskoye to Nizhneusinskoye, across three bridges. Your home has a green roof and two lit windows, in the far north-east corner of the village. It is dark and freezing, and it is best if nobody sees you on the way. Five secrets are hidden along the route.',
    resume: 'Continue', restart: 'Restart',
    nickLabel: 'Name for the leaderboard', nickPh: 'Player', diffLabel: 'Difficulty', start: 'Start',
    keys: 'WASD or arrows — walk · Shift — run · M — sound · Esc — pause',
    hint: 'WASD — walk · Shift — run (noisy) · M — sound · Esc — pause · or hold the mouse where you want to go',
    board: 'Leaderboard', shared: 'Shared board', local: 'Records on this device', empty: 'Nobody has made it yet. Be the first.',
    sndOn: 'Sound: on', sndOff: 'Sound: off',
    bridges: 'Bridges', run: 'running', warm: 'Warmth', cold: 'Freezing!', woof: 'woof!',
    intro: 'Verkhneusinskoye, about 10 pm.<br>Get home to Nizhneusinskoye: green roof, two lit windows, north-east corner of the village.<br><small>Follow the road north-west. You are losing warmth — warm up by lit windows and on bridges.</small>',
    b1: 'Bridge 1 — the side channel', b2: 'Bridge 2 — over the Us', b3: 'Bridge 3 — the channel by Nizhneusinskoye',
    b3note: 'The last bridge. Home is on the farthest street, to the right: green roof, two windows.',
    warmed: 'Warmed up. Saved.',
    lose: 'Game over', back: 'Back to the last bridge…',
    drowned: 'You drowned.', foundItem: 'Found', secrets: 'Secrets',
    mitten: 'a mitten', sled: 'a sled', cone: 'a cedar cone', coin: 'a coin', whistle: 'a whistle',
    froze: 'You froze.', dogs: 'The dogs caught you.', wolves: 'Wolves.', seen: 'A grown-up spotted you.',
    win: 'You made it!', winText: 'You are home. It\'s warm inside.', time: 'Time', tries: 'attempts', record: 'New personal best!',
    player: 'Player',
    easy: ['Easy', 'More warmth, wider light, slower enemies'],
    normal: ['Normal', 'As intended'],
    hard: ['Hard', 'Harsher frost, narrower light, sharper enemies'],
  },
};
let lang = 'ru';
try { lang = localStorage.getItem('tma_lang') || (/^ru|^uk|^be|^kk/i.test(navigator.language || '') ? 'ru' : 'en'); } catch (e) {}
if (!T[lang]) lang = 'ru';
const t = k => T[lang][k];

// ================= ГЕОМЕТРИЯ =================
// Сглаживание ломаной (Catmull-Rom), чтобы дороги и реки были плавными
const smooth = (pts, n = 10) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const segDist = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
};
const polyDist = (pts, x, y) => {
  let m = 1e9;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const d = segDist(x, y, a[0], a[1], b[0], b[1]);
    if (d < m) m = d;
  }
  return m;
};
const inter = (a, b, c, d) => {
  const r0 = b[0] - a[0], r1 = b[1] - a[1], s0 = d[0] - c[0], s1 = d[1] - c[1], den = r0 * s1 - r1 * s0;
  if (!den) return null;
  const t = ((c[0] - a[0]) * s1 - (c[1] - a[1]) * s0) / den, u = ((c[0] - a[0]) * r1 - (c[1] - a[1]) * r0) / den;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [a[0] + t * r0, a[1] + t * r1] : null;
};

// ================= КАРТА по Google Maps: старт на юго-востоке, путь на северо-запад и север =================
const WW = 2400, WH = 5600;
// Дорога: Верхнеусинское (ул. Ленина на северо-запад) → протока → пойма → Ус → лес на север → протока → Нижнеусинское
const ROAD = smooth([
  [1900, 5250], [1700, 5050], [1500, 4850], [1380, 4700], [1250, 4520], [1100, 4300], [980, 4080],
  [930, 4010], [850, 3900], [770, 3790], [650, 3740], [600, 3500], [620, 3000], [560, 2500], [640, 2000], [780, 1580],
  [900, 1350], [950, 1150], [960, 900],
]);
// Улицы сёл
const STREETS = [
  smooth([[1400, 5200], [1800, 5120], [2350, 5000]]),
  smooth([[1650, 5450], [2000, 5380], [2350, 5300]]),
  smooth([[2100, 5450], [1900, 5250]]),
  smooth([[380, 900], [960, 900], [1450, 870]]),
  smooth([[960, 900], [985, 600], [1000, 300]]),
  smooth([[420, 620], [985, 600], [1500, 590]]),
  smooth([[450, 330], [1000, 300], [1500, 290]]),
  smooth([[420, 900], [420, 330]]),
];
const ALLROADS = [ROAD, ...STREETS];
const roadDist = (x, y) => Math.min(...ALLROADS.map(p => polyDist(p, x, y)));

// Реки: протока у Верхнеусинского, Ус (с северо-востока на юго-запад), протока вокруг Нижнеусинского
const rivers = [
  {pts: smooth([[2400, 4380], [1900, 4560], [1380, 4700], [900, 4950], [300, 5300], [0, 5450]]), w: 35, key: 'b1'},
  {pts: smooth([[2400, 3000], [1700, 3400], [1200, 3700], [850, 3900], [500, 4150], [0, 4500]]), w: 80, key: 'b2'},
  {pts: smooth([[0, 1500], [500, 1450], [900, 1350], [1300, 1250], [1700, 1000], [2000, 600], [2100, 0]]), w: 40, key: 'b3'},
];
// Мост там, где дорога пересекает реку; повёрнут вдоль дороги
for (const r of rivers) {
  r.bw = 60;
  outer: for (let i = 0; i < ROAD.length - 1; i++) for (let j = 0; j < r.pts.length - 1; j++) {
    const hit = inter(ROAD[i], ROAD[i + 1], r.pts[j], r.pts[j + 1]);
    if (!hit) continue;
    const A = ROAD[Math.max(0, i - 3)], B = ROAD[Math.min(ROAD.length - 1, i + 4)];   // направление дороги через реку
    const ux = B[0] - A[0], uy = B[1] - A[1], ul = Math.hypot(ux, uy);
    const vx = r.pts[j + 1][0] - r.pts[j][0], vy = r.pts[j + 1][1] - r.pts[j][1], vl = Math.hypot(vx, vy);
    const sin = Math.abs(ux * vy - uy * vx) / ul / vl;
    r.cx = hit[0]; r.cy = hit[1]; r.ux = ux / ul; r.uy = uy / ul;
    r.len = Math.min(2 * r.w / Math.max(sin, .4) + 34, 4 * r.w + 40);
    break outer;
  }
  r.check = {x: r.cx + r.ux * (r.len / 2 + 30), y: r.cy + r.uy * (r.len / 2 + 30)};
  r.minX = Math.min(...r.pts.map(q => q[0])) - r.w; r.maxX = Math.max(...r.pts.map(q => q[0])) + r.w;
  r.minY = Math.min(...r.pts.map(q => q[1])) - r.w; r.maxY = Math.max(...r.pts.map(q => q[1])) + r.w;
}
const bridgeLocal = (r, x, y) => {             // координаты точки в системе моста: t — вдоль, q — поперёк
  const dx = x - r.cx, dy = y - r.cy;
  return {t: dx * r.ux + dy * r.uy, q: -dx * r.uy + dy * r.ux};
};
const inRiver = (x, y, pad = 0) => rivers.find(r => x > r.minX - pad && x < r.maxX + pad && y > r.minY - pad && y < r.maxY + pad && polyDist(r.pts, x, y) < r.w + pad);
const onBridge = (r, x, y) => { const b = bridgeLocal(r, x, y); return Math.abs(b.t) < r.len / 2 && Math.abs(b.q) < r.bw / 2 - 8; };

// Дом героя — финиш: четырёхскатная зелёная крыша, северная сторона улицы в Нижнеусинском
const home = {x: 1330, y: 140, w: 84, h: 52, lit: true, goal: true};   // северо-восточный угол села, дальняя улица
const fenceOf = h => ({x: h.x - 14, y: h.y - 14, w: h.w + 28, h: h.h + 54});
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

// Дома: вдоль улиц внутри двух сёл
const VILLAGES = [{x0: 1300, x1: 2400, y0: 4920, y1: 5560}, {x0: 300, x1: 1600, y0: 100, y1: 1180}];
const houses = [home];
for (const v of VILLAGES) for (let y = v.y0; y < v.y1; y += 18) for (let x = v.x0; x < v.x1; x += 18) {
  if (rnd() > .35) continue;
  const h = {x: x - 35, y: y - 40, w: 70, h: 44, lit: rnd() < .4};
  const d = roadDist(x, y);
  if (d < 85 || d > 170) continue;
  if (h.x < 20 || h.x + h.w > WW - 20 || h.y < 20 || h.y + h.h + 40 > WH - 10) continue;
  const f = fenceOf(h);
  if (inRiver(x, y, 70) || roadDist(f.x + f.w / 2, f.y + f.h) < 30) continue;
  if (houses.some(o => overlap(fenceOf(o), f))) continue;
  houses.push(h);
}
const inHouse = (x, y) => houses.some(h => x > h.x - 9 && x < h.x + h.w + 9 && y > h.y - 9 && y < h.y + h.h + 29);

// Деревья: густой лес между Усом и Нижнеусинским, в пойме — ивняк и редкие ели, в сёлах — мало
const zoneOf = y => y < 1180 ? 'nizh' : y < 3700 ? 'forest' : y < 4700 ? 'flood' : 'verh';
const trees = [];
for (let i = 0; i < 3400; i++) {
  const x = rnd() * WW, y = rnd() * WH, z = zoneOf(y);
  const keep = {forest: .95, flood: .55, nizh: .1, verh: .1}[z];
  if (rnd() > keep) continue;
  if (roadDist(x, y) < 55 || inRiver(x, y, 18) || inHouse(x, y) || houses.some(h => overlap(fenceOf(h), {x: x - 12, y: y - 12, w: 24, h: 24}))) continue;
  const bush = z === 'flood' && rnd() < .65;
  trees.push({x, y, bush, r: bush ? 9 + rnd() * 8 : 13 + rnd() * 17, a: rnd() * 6.3, j: Array.from({length: 7}, () => .8 + rnd() * .4)});
}
// быстрый поиск деревьев рядом: сетка 80×80
const TG = 80, tgrid = new Map();
for (const t of trees) { const k = Math.floor(t.x / TG) + ',' + Math.floor(t.y / TG); if (!tgrid.has(k)) tgrid.set(k, []); tgrid.get(k).push(t); }
const inTree = (x, y) => {
  const gx = Math.floor(x / TG), gy = Math.floor(y / TG);
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
    const c = tgrid.get((gx + i) + ',' + (gy + j));
    if (c) for (const t of c) if (dist(x, y, t.x, t.y) < t.r * .5 + 8) return true;
  }
  return false;
};
const landBlocked = (x, y) => x < 0 || y < 0 || x > WW || y > WH || inHouse(x, y) || inTree(x, y);
const blocked = (x, y) => {                    // для зверей: вода непроходима
  const r = inRiver(x, y);
  return (r && !onBridge(r, x, y)) || landBlocked(x, y);
};
// для игрока: в воду зайти можно (и утонуть), но с моста не шагнёшь — перила
const pBlocked = (x, y) => {
  if (landBlocked(x, y)) return true;
  const here = inRiver(p.x, p.y);
  if (here && onBridge(here, p.x, p.y)) { const r = inRiver(x, y); return !!r && !onBridge(r, x, y); }
  return false;
};

// ================= СЕКРЕТЫ: 5 разных вещей, спрятаны в стороне от дороги =================
const ITEM_KINDS = ['mitten', 'sled', 'cone', 'coin', 'whistle'];
const ITEM_ZONES = [[4980, 5500, 1300, 2400], [3980, 4600, 0, 2400], [2700, 3500, 0, 2400], [1500, 2400, 0, 2400], [130, 1150, 300, 1600]];
const items = ITEM_KINDS.map((kind, i) => {
  const [y0, y1, x0, x1] = ITEM_ZONES[i];
  for (let k = 0; k < 4000; k++) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), d = roadDist(x, y);
    if (d < 150 || d > 420 || blocked(x, y) || inRiver(x, y, 40) || houses.some(h => overlap(fenceOf(h), {x: x - 20, y: y - 20, w: 40, h: 40}))) continue;
    if ([{x: 1900, y: 5250}].some(s => dist(x, y, s.x, s.y) < 250)) continue;
    return {kind, x, y, found: false};
  }
  return {kind, x: 0, y: 0, found: true};
});

// ================= ВРАГИ: каждый заход расставляются случайно =================
const START = {x: 1900, y: 5250};
const SAFE = [START, ...rivers.map(r => r.check)];
const farFromSafe = (x, y, d) => SAFE.every(s => dist(x, y, s.x, s.y) > d);
let dogs = [], wolves = [], people = [];
const wolfSpot = (y0, y1) => {                 // случайное место для волка: не у дороги и не у точек возврата
  for (let i = 0; i < 400; i++) {
    const x = rr(60, WW - 60), y = rr(y0, y1);
    if (roadDist(x, y) >= 140 && !blocked(x, y) && farFromSafe(x, y, 380)) return {x, y};
  }
  return null;
};
const spawnEnemies = () => {
  // собаки во дворах случайных домов
  dogs = houses.filter(h => !h.goal && farFromSafe(h.x + h.w / 2, h.y + h.h, 260))
    .sort(() => Math.random() - .5).slice(0, 11)
    .map(h => { const hx = h.x + h.w / 2, hy = h.y + h.h + 38; return {hx, hy, x: hx, y: hy, state: 'idle', bark: 0, show: 0, dir: rr(0, 6.3), lose: 0}; });
  // волки: 5 в лесу, 2 в пойме между мостами 1 и 2
  wolves = [];
  const place = (y0, y1, n) => {
    for (let tries = 0; wolves.length < n && tries < 2000; tries++) {
      const s = wolfSpot(y0, y1);
      if (s) wolves.push({x: s.x, y: s.y, tx: s.x, ty: s.y, y0, y1, state: 'wander', dir: rr(0, 6.3), blink: rr(0, 5), pause: rr(0, 2), lose: 0});
    }
  };
  place(1350, 3650, 5); place(3950, 4600, 7);
  // люди с фонарём: по одному-два в каждом селе, на случайном куске улицы
  people = [];
  const segs = [];
  for (const pl of ALLROADS) for (let i = 0; i + 8 < pl.length; i += 4) {
    const a = pl[i], b = pl[i + 8];
    if (!VILLAGES.some(v => a[0] > v.x0 && a[0] < v.x1 && a[1] > v.y0 && a[1] < v.y1 && b[0] > v.x0 && b[0] < v.x1 && b[1] > v.y0 && b[1] < v.y1)) continue;
    if (dist(a[0], a[1], b[0], b[1]) < 150) continue;
    if (!farFromSafe(a[0], a[1], 340) || !farFromSafe(b[0], b[1], 340)) continue;
    segs.push([a, b]);
  }
  segs.sort(() => Math.random() - .5);
  for (const [a, b] of segs) {
    if (people.length >= 4) break;
    if (people.some(m => dist(m.ax, m.ay, a[0], a[1]) < 300)) continue;
    const v = Math.random() < .5 ? 1 : -1, ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    people.push({ax: a[0], ay: a[1], bx: b[0], by: b[1], s: rr(0, 1), v, x: a[0], y: a[1], dir: v > 0 ? ang : ang + Math.PI, av: 0, step: 0, wait: 0});
  }
};

// ================= ЗВУК (генерируется в браузере, без файлов) =================
let riverG = null;
let ac = null, master = null, gameG = null, noiseBuf = null, padI = 0, muted = true;
const pad = () => {
  if (!ac) return;
  const chords = [[220, 261.63, 329.63], [196, 246.94, 293.66], [174.61, 220, 261.63], [164.81, 207.65, 246.94]];
  const t = ac.currentTime;
  for (const f of chords[padI++ % 4]) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.04, t + 2.5); g.gain.linearRampToValueAtTime(0, t + 7);
    o.connect(g); g.connect(gameG); o.start(t); o.stop(t + 7.2);
  }
};
let chaseG = null, chaseTimer = 0, nextT = 0, stepI = 0, lastDanger = -99;
const BASS = [55, 55, 65.41, 55, 82.41, 55, 73.42, 61.74];
const chaseTick = () => {
  const now = ac.currentTime;
  if (danger && state === 'play') lastDanger = now;
  const on = now - lastDanger < .5;
  chaseG.gain.setTargetAtTime(on ? .55 : 0, now, on ? .25 : .5);
  if (now - lastDanger > 2.5) { nextT = now; return; }
  while (nextT < now + .2) {
    const t = Math.max(nextT, now), i = stepI++;
    const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = 'sawtooth'; o.frequency.value = BASS[i % 8];
    f.type = 'lowpass'; f.frequency.value = 520;
    g.gain.setValueAtTime(.22, t); g.gain.exponentialRampToValueAtTime(.001, t + .19);
    o.connect(f); f.connect(g); g.connect(chaseG); o.start(t); o.stop(t + .2);
    if (i % 4 === 0) {
      const k = ac.createOscillator(), kg = ac.createGain();
      k.frequency.setValueAtTime(110, t); k.frequency.exponentialRampToValueAtTime(40, t + .15);
      kg.gain.setValueAtTime(.7, t); kg.gain.exponentialRampToValueAtTime(.001, t + .18);
      k.connect(kg); kg.connect(chaseG); k.start(t); k.stop(t + .2);
    }
    if (i % 2) {
      const s = ac.createBufferSource(), hf = ac.createBiquadFilter(), hg = ac.createGain();
      s.buffer = noiseBuf; hf.type = 'highpass'; hf.frequency.value = 6000;
      hg.gain.setValueAtTime(.06, t); hg.gain.exponentialRampToValueAtTime(.001, t + .04);
      s.connect(hf); hf.connect(hg); hg.connect(chaseG); s.start(t); s.stop(t + .05);
    }
    nextT = Math.max(nextT, now) + 60 / 150 / 2;
  }
};
const startAudio = () => {
  if (ac) return;
  try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  master = ac.createGain(); master.gain.value = muted ? 0 : 0.7; master.connect(ac.destination);
  gameG = ac.createGain(); gameG.gain.value = state === 'menu' ? 0 : 1; gameG.connect(master);   // все звуки игры — в меню молчат
  const len = ac.sampleRate * 2;
  noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const n = ac.createBufferSource(); n.buffer = noiseBuf; n.loop = true;            // шум реки — громкость по расстоянию до воды
  const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = .6;
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
  const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = .35; lg.gain.value = 180;   // журчание
  lfo.connect(lg); lg.connect(bp.frequency);
  riverG = ac.createGain(); riverG.gain.value = 0;
  n.connect(bp); bp.connect(lp); lp.connect(riverG); riverG.connect(gameG); n.start(); lfo.start();
  for (const f of [55, 82.41]) {                                                    // низкий гул
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = f; g.gain.value = .045; o.connect(g); g.connect(gameG); o.start();
  }
  pad(); setInterval(pad, 7000);
  menuG = ac.createGain(); menuG.gain.value = state === 'menu' ? 1 : 0; menuG.connect(master);
  setInterval(menuPhrase, 400);
  chaseG = ac.createGain(); chaseG.gain.value = 0; chaseG.connect(gameG);
  if (!chaseTimer) chaseTimer = setInterval(chaseTick, 50);
};
const chime = () => {                         // чекпоинт: тихий низкий выдох — две минорные ноты
  if (!ac) return;
  const t = ac.currentTime;
  [[220, 0], [261.63, .35]].forEach(([f, d]) => {
    const o = ac.createOscillator(), lp = ac.createBiquadFilter(), g = ac.createGain(), s0 = t + d;
    o.type = 'triangle'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = 900;
    g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(.07, s0 + .15); g.gain.exponentialRampToValueAtTime(.001, s0 + 2.4);
    o.connect(lp); lp.connect(g); g.connect(gameG); o.start(s0); o.stop(s0 + 2.5);
  });
};
const melody = (notes, vol = .09) => {
  if (!ac) return;
  const t = ac.currentTime;
  for (const [f, st, du] of notes) {
    const o = ac.createOscillator(), lp = ac.createBiquadFilter(), g = ac.createGain(), s0 = t + st;
    o.type = 'triangle'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = 1400;
    g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(vol, s0 + .06);
    g.gain.setValueAtTime(vol, s0 + du * .6); g.gain.exponentialRampToValueAtTime(.001, s0 + du);
    o.connect(lp); lp.connect(g); g.connect(master); o.start(s0); o.stop(s0 + du + .05);
  }
};
const loseTune = () => melody([[329.63, 0, .6], [293.66, .5, .6], [261.63, 1, .6], [246.94, 1.5, .7], [220, 2, 1.6], [164.81, 2, 1.6]]);
const winTune = () => melody([[220, 0, .5], [261.63, .4, .5], [329.63, .8, .5], [392, 1.2, .6],
  [261.63, 1.7, 2.4], [329.63, 1.7, 2.4], [392, 1.7, 2.4], [523.25, 1.7, 2.4]], .07);
let menuG = null, menuI = 0, menuNext = 0;
const MENU_TUNE = [
  [[440, 0], [523.25, .4], [659.25, .8], [587.33, 1.6], [523.25, 2], [493.88, 2.4], [440, 3.2], [329.63, 4.4], [392, 4.8], [440, 5.6], [493.88, 6.4], [523.25, 7.2], [440, 8]],
  [[440, 0], [523.25, .4], [659.25, .8], [698.46, 1.6], [659.25, 2], [587.33, 2.4], [523.25, 3.2], [493.88, 4.4], [440, 4.8], [392, 5.6], [440, 6.4], [329.63, 7.2], [440, 8]],
];
const menuPhrase = () => {
  if (!ac || state !== 'menu' || ac.currentTime < menuNext) return;   // фраза никогда не наслаивается на предыдущую
  const t0m = ac.currentTime + .05;
  menuNext = t0m + 9.6;
  for (const [f, st] of MENU_TUNE[menuI++ % 2]) {
    const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), s0 = t0m + st;
    o.type = 'sine'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 2;  // звон шкатулки
    g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(.07, s0 + .01); g.gain.exponentialRampToValueAtTime(.001, s0 + 1.6);
    const g2 = ac.createGain(); g2.gain.value = .25;
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(menuG);
    o.start(s0); o2.start(s0); o.stop(s0 + 1.7); o2.stop(s0 + 1.7);
  }
};
const menuMusic = on => {
  if (!ac || !menuG) return;
  menuG.gain.setTargetAtTime(on ? 1 : 0, ac.currentTime, on ? .8 : .3);
  gameG.gain.setTargetAtTime(on ? 0 : 1, ac.currentTime, on ? .15 : .6);   // меню — только своя музыка
};
// Шаг: хруст снега — три коротких щелчка высокого шума; на мосту — глухой стук доски
const footstep = (run, wood) => {
  if (!ac) return;
  const t = ac.currentTime, v = run ? .09 : .055;
  const bursts = wood ? [[0, 260, 2]] : [[0, 2600, 1.2], [.018, 3400, 1.5], [.04, 2200, 1.2]];
  for (const [d, f, q] of bursts) {
    const s = ac.createBufferSource(), bf = ac.createBiquadFilter(), g = ac.createGain(), s0 = t + d;
    s.buffer = noiseBuf; bf.type = wood ? 'lowpass' : 'bandpass'; bf.frequency.value = f * (.85 + Math.random() * .3); bf.Q.value = q;
    g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(wood ? v * 3 : v, s0 + .004); g.gain.exponentialRampToValueAtTime(.001, s0 + (wood ? .09 : .045));
    s.connect(bf); bf.connect(g); g.connect(gameG); s.start(s0, Math.random()); s.stop(s0 + .1);
  }
};
const pickup = () => {                          // нашёл секрет: два высоких колокольчика
  if (!ac) return;
  const t = ac.currentTime;
  [[1046.5, 0], [1568, .1]].forEach(([f, d]) => {
    const o = ac.createOscillator(), g = ac.createGain(), s0 = t + d;
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(.08, s0 + .01); g.gain.exponentialRampToValueAtTime(.001, s0 + .9);
    o.connect(g); g.connect(gameG); o.start(s0); o.stop(s0 + 1);
  });
};
let howlBusy = 0, barkBusy = 0;
// Лай: «голос» собаки — пульсирующий тон 450–600 Гц, пропущенный через три форманты пасти,
// плюс шумовой «выдох» через те же форманты. Тон быстро взлетает и падает, громкость — резкий удар и спад
const barkTo = (c, out, buf, s0, vol, p) => {
  const mix = c.createGain(); mix.gain.value = 1;
  const forms = [[650, 2.5, 1], [1500, 4, 1.1], [2700, 5, .7]].map(([f, q, gn]) => {
    const bp = c.createBiquadFilter(), fg = c.createGain();
    bp.type = 'bandpass'; bp.frequency.value = f * p; bp.Q.value = q; fg.gain.value = gn;
    bp.frequency.setValueAtTime(f * p * .85, s0); bp.frequency.linearRampToValueAtTime(f * p * 1.1, s0 + .03);   // пасть открывается
    bp.frequency.linearRampToValueAtTime(f * p * .9, s0 + .14);
    bp.connect(fg); fg.connect(mix); return bp;
  });
  const o = c.createOscillator(); o.type = 'sawtooth';
  o.frequency.setValueAtTime(430 * p, s0); o.frequency.linearRampToValueAtTime(600 * p, s0 + .025);
  o.frequency.exponentialRampToValueAtTime(330 * p, s0 + .15);
  const jit = c.createOscillator(), jg = c.createGain(); jit.frequency.value = 37; jg.gain.value = 18 * p;   // хрип: дрожание тона
  jit.connect(jg); jg.connect(o.frequency);
  const og = c.createGain(); og.gain.value = .9;
  o.connect(og); for (const f of forms) og.connect(f);
  const ns = c.createBufferSource(), ng = c.createGain(); ns.buffer = buf; ng.gain.value = .8;
  ns.connect(ng); for (const f of forms) ng.connect(f);
  const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 220;
  const env = c.createGain();
  env.gain.setValueAtTime(0, s0); env.gain.linearRampToValueAtTime(.3 * vol, s0 + .008);
  env.gain.setValueAtTime(.3 * vol, s0 + .04); env.gain.exponentialRampToValueAtTime(.001, s0 + .17);
  mix.connect(hp); hp.connect(env); env.connect(out);
  o.start(s0); jit.start(s0); ns.start(s0, Math.random()); o.stop(s0 + .18); jit.stop(s0 + .18); ns.stop(s0 + .18);
};
const bark = (vol, pitch = 1) => {
  if (!ac || vol <= 0.02 || ac.currentTime < barkBusy) return;
  const n = Math.random() < .5 ? 2 : 3;
  barkBusy = ac.currentTime + .32 * n + .3;
  for (let k = 0; k < n; k++) barkTo(ac, gameG, noiseBuf, ac.currentTime + k * (.26 + Math.random() * .08), vol, pitch * (1 + (Math.random() - .5) * .1));
};
const howl = vol => {
  if (!ac || ac.currentTime < howlBusy) return;
  howlBusy = ac.currentTime + 4;
  const t = ac.currentTime, o = ac.createOscillator(), v = ac.createOscillator(), vg = ac.createGain(), g = ac.createGain();
  o.frequency.setValueAtTime(320, t); o.frequency.linearRampToValueAtTime(520, t + .8);
  o.frequency.linearRampToValueAtTime(470, t + 2); o.frequency.linearRampToValueAtTime(290, t + 2.8);
  v.frequency.value = 5; vg.gain.value = 7; v.connect(vg); vg.connect(o.frequency);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09 * vol, t + .6); g.gain.linearRampToValueAtTime(0, t + 2.9);
  o.connect(g); g.connect(gameG); o.start(t); v.start(t); o.stop(t + 3); v.stop(t + 3);
};
const setMute = m => {
  muted = m; startAudio();
  if (master) master.gain.value = muted ? 0 : .7;
  sndBtn.textContent = muted ? t('sndOff') : t('sndOn');
};
sndBtn.addEventListener('click', () => setMute(!muted));

// ================= ИГРОК И УПРАВЛЕНИЕ =================
const p = {x: START.x, y: START.y, dir: -Math.PI / 2, step: 0, warm: 100, run: false, grace: 0};
let checkpoint = {...START};
const keys = {};
const KEYMAP = {KeyW: 'w', KeyA: 'a', KeyS: 's', KeyD: 'd', ArrowUp: 'w', ArrowDown: 's', ArrowLeft: 'a', ArrowRight: 'd', ShiftLeft: 'run', ShiftRight: 'run'};
let firstInput = true;
const wake = () => { if (firstInput) { firstInput = false; setMute(false); } };
addEventListener('keydown', e => {
  if (e.target && e.target.tagName === 'INPUT') { if (e.key === 'Enter') startGame(); return; }
  wake();
  if (e.code === 'Escape') { if (state === 'menu') { if (pausedFrom) resumeGame(); } else if (state !== 'won') openMenu(true); }
  if (e.code === 'KeyM') setMute(!muted);
  if (KEYMAP[e.code]) { keys[KEYMAP[e.code]] = true; e.preventDefault(); }
});
addEventListener('keyup', e => { if (KEYMAP[e.code]) keys[KEYMAP[e.code]] = false; });
// окно потеряло фокус — отпускаем клавиши (иначе персонаж «залипает» и идёт сам)
addEventListener('blur', () => { for (const k in keys) keys[k] = false; touch = null; });
// вкладку свернули посреди игры — ставим на паузу, чтобы не замёрзнуть и не тратить время
document.addEventListener('visibilitychange', () => { if (document.hidden && (state === 'play' || state === 'dead')) openMenu(true); });
let touch = null;
cv.addEventListener('pointerdown', e => { wake(); touch = {x: e.clientX, y: e.clientY}; });
cv.addEventListener('pointermove', e => { if (touch) touch = {x: e.clientX, y: e.clientY}; });
addEventListener('pointerup', () => touch = null);

const flakes = Array.from({length: 220}, () => ({x: rnd() * 2000, y: rnd() * 2000, s: .5 + rnd() * 1.5}));

let msgTimer = 0;
const say = (text, sec) => { msg.innerHTML = text; msg.style.opacity = 1; msgTimer = sec; };

const DIFFS = {
  easy:   {cold: .7,  light: 210, sp: .85, det: .8,  cone: 180},
  normal: {cold: 1,   light: 180, sp: 1,   det: 1,   cone: 210},
  hard:   {cold: 1.4, light: 150, sp: 1.1, det: 1.25, cone: 240},
};
let diff = 'normal', D = DIFFS.normal, attempts = 1;
let state = 'menu', deadT = 0, howlT = 12, barkT = 6, windy = false, danger = false;
const die = text => { attempts++; state = 'dead'; deadT = 3.6; loseTune(); say(`<b>${t('lose')}</b>${t(text)}<br><small>${t('back')}</small>`, 3.6); };
const calmEnemies = () => {
  for (const d of dogs) { d.x = d.hx; d.y = d.hy; d.state = 'idle'; d.lose = 0; }
  for (const w of wolves) {                       // волки у точки возврата уходят в другое место леса
    w.state = 'wander'; w.lose = 0;
    if (dist(w.x, w.y, p.x, p.y) < 420) { const s = wolfSpot(w.y0, w.y1); if (s) { w.x = w.tx = s.x; w.y = w.ty = s.y; } w.pause = 2; }
  }
  for (const m of people) {                      // кто смотрел на точку возврата — отворачивается
    const a = Math.atan2(p.y - m.y, p.x - m.x);
    let da = a - m.dir; da = Math.atan2(Math.sin(da), Math.cos(da));
    if (Math.abs(da) < 1.2) { m.v *= -1; m.dir += Math.PI; m.av = 0; }
  }
};
const respawn = () => {
  p.x = checkpoint.x; p.y = checkpoint.y; p.warm = 100; state = 'play'; p.grace = 2.5; p.onBr = null;
  calmEnemies();
};

// Движение врага к точке со скольжением вдоль препятствий
const moveTo = (e, tx, ty, sp, dt) => {
  const dx = tx - e.x, dy = ty - e.y, l = Math.hypot(dx, dy);
  if (l < 1) return true;
  const nx = e.x + dx / l * sp * dt, ny = e.y + dy / l * sp * dt;
  const ox = e.x, oy = e.y;
  if (!blocked(nx, e.y)) e.x = nx;
  if (!blocked(e.x, ny)) e.y = ny;
  const mx = e.x - ox, my = e.y - oy;
  if (Math.hypot(mx, my) > sp * dt * .3) {
    let t = Math.atan2(my, mx) - e.dir; t = Math.atan2(Math.sin(t), Math.cos(t));
    e.dir += t * Math.min(1, dt * 6);
  }
  return l < 6 || Math.hypot(mx, my) < sp * dt * .3;
};

let t0 = performance.now(), last = t0;
const fmt = s => (s = Math.max(0, s), `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`);

const update = (dt, now) => {
  if (state !== 'play') danger = false;
  if (state === 'dead') { if ((deadT -= dt) <= 0) respawn(); return; }
  if (state !== 'play') return;
  p.grace = Math.max(0, p.grace - dt);

  // --- игрок
  let dx = (keys.d ? 1 : 0) - (keys.a ? 1 : 0), dy = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
  if (touch) { dx = touch.x - W / 2; dy = touch.y - H / 2; }
  const len = Math.hypot(dx, dy), moving = touch ? len > 8 : len > 0;   // клавиши дают длину 1, мышь — пиксели до курсора
  p.run = moving && keys.run;
  const sp = p.run ? 160 : 90;
  if (moving) {
    const nx = p.x + dx / len * sp * dt, ny = p.y + dy / len * sp * dt;
    p.dir = Math.atan2(dy, dx); p.step += dt * (p.run ? 15 : 9);
    if (!pBlocked(nx, p.y)) p.x = nx;
    if (!pBlocked(p.x, ny)) p.y = ny;
    const st = Math.floor(p.step / Math.PI);         // шаг — хруст снега (на мосту — стук досок)
    if (st !== p.lastStep) { p.lastStep = st; const rb0 = inRiver(p.x, p.y); footstep(p.run, !!rb0 && onBridge(rb0, p.x, p.y)); }
  }
  { const rw = inRiver(p.x, p.y, -8); if (rw && !onBridge(rw, p.x, p.y)) return die('drowned'); }   // у самого берега мелко — тонешь, только зайдя в воду
  for (const it of items) if (!it.found && dist(p.x, p.y, it.x, it.y) < 24) {
    it.found = true; pickup();
    say(`${t('foundItem')}: ${t(it.kind)} (${items.filter(i => i.found).length}/5)`, 2.2);
  }

  // --- мосты = чекпоинты
  // мост засчитан, когда сошёл с него на дальний берег
  const onR = inRiver(p.x, p.y);
  if (onR && onBridge(onR, p.x, p.y)) p.onBr = onR;
  else if (!onR && p.onBr) {
    const r = p.onBr, b = bridgeLocal(r, p.x, p.y); p.onBr = null;
    if (!r.crossed && b.t > 0) {
      r.crossed = true; p.warm = 100; chime();
      checkpoint = {...r.check};
      say(t(r.key) + (r.key === 'b3' ? `<br><small>${t('b3note')}</small>` : '') + `<br><small>${t('warmed')}</small>`, r.key === 'b3' ? 4 : 2);
    }
  }

  // --- ветер на мосту через Ус: сносит поперёк моста и выдувает тепло
  const rb = inRiver(p.x, p.y);
  windy = rb === rivers[1];
  if (windy) {
    const gust = Math.sin(now / 650) * 30 + Math.sin(now / 230) * 12;
    const nx = p.x - rb.uy * gust * dt, ny = p.y + rb.ux * gust * dt;
    if (!pBlocked(nx, ny)) { p.x = nx; p.y = ny; }
  }
  // --- шум реки: слышно только рядом с водой
  if (riverG) {
    const dw = Math.min(...rivers.map(r => polyDist(r.pts, p.x, p.y) - r.w));
    const k = Math.max(0, 1 - Math.max(0, dw) / 380);
    riverG.gain.setTargetAtTime(.14 * k * k, ac.currentTime, .3);
  }
  // --- холод
  const nearWindow = houses.some(h => h.lit && dist(p.x, p.y, h.x + h.w / 2, h.y + h.h + 34) < 70);
  p.warm = Math.max(0, Math.min(100, p.warm + (nearWindow ? 18 : (windy ? -4 : -1) * D.cold) * dt));
  if (p.warm <= 0) return die('froze');

  danger = false;
  const safe = p.grace > 0;
  // --- собаки
  const hear = (p.run ? 260 : 130) * D.det;
  for (const d of dogs) {
    const dp = dist(d.x, d.y, p.x, p.y);
    d.show = Math.max(0, d.show - dt);
    if (d.state === 'idle' && dp < hear && !safe) { d.state = 'chase'; bark(Math.max(.2, 1 - dp / 400)); }
    if (d.state === 'chase') {
      if (dp < 300) danger = true;
      const stuck = moveTo(d, p.x, p.y, 125 * D.sp, dt);
      if ((d.bark -= dt) <= 0) { d.bark = .9; d.show = .6; bark(Math.max(0, 1 - dp / 600)); }
      d.lose = (dp > hear * 1.5 || stuck) ? d.lose + dt : 0;
      if (dist(d.x, d.y, d.hx, d.hy) > 260 || d.lose > 2) { d.state = 'back'; d.lose = 0; }
      if (dp < 16 && !safe) return die('dogs');
    } else if (d.state === 'back' && moveTo(d, d.hx, d.hy, 80, dt)) d.state = 'idle';
  }
  // далёкий лай в сёлах — для атмосферы
  if (zoneOf(p.y) === 'verh' || zoneOf(p.y) === 'nizh' || p.y < 1500 || p.y > 4600) {
    if ((barkT -= dt) <= 0 && dogs.length) {
      barkT = 5 + Math.random() * 9;
      const d = dogs[Math.floor(Math.random() * dogs.length)], dd = dist(d.x, d.y, p.x, p.y);
      if (d.state === 'idle') { bark(Math.max(.08, .45 - dd / 2000), .9 + Math.random() * .3); if (dd < 700) d.show = .6; }
    }
  }

  // --- волки
  for (const w of wolves) {
    const dp = dist(w.x, w.y, p.x, p.y);
    if (w.state === 'wander') {
      if ((w.pause -= dt) > 0) { /* стоит, принюхивается */ }
      else if (moveTo(w, w.tx, w.ty, 35, dt)) {
        w.pause = .8 + Math.random() * 2;
        for (let k = 0; k < 8; k++) {                // новая цель — не ближе 300 к мостам и старту
          w.tx = Math.max(40, Math.min(WW - 40, w.x + rr(-200, 200)));
          w.ty = Math.max(w.y0, Math.min(w.y1, w.y + rr(-200, 200)));
          if (farFromSafe(w.tx, w.ty, 300)) break;
          w.tx = w.x; w.ty = w.y;
        }
      }
      if (dp < (p.run ? 220 : 150) * D.det && !safe) { w.state = 'chase'; howl(.8); }
    } else {
      if (dp < 300) danger = true;
      const stuck = moveTo(w, p.x, p.y, 115 * D.sp, dt);
      w.lose = (dp > 250 || stuck) ? w.lose + dt : 0;
      if (dp > 380 || w.lose > 2.5) { w.state = 'wander'; w.lose = 0; w.pause = 1.5; w.tx = w.x; w.ty = w.y; }
      if (dp < 16 && !safe) return die('wolves');
    }
  }
  if (zoneOf(p.y) === 'forest' && (howlT -= dt) <= 0) { howlT = 18 + Math.random() * 15; howl(.4); }

  // --- люди с фонарём ходят по куску улицы туда-обратно
  for (const m of people) {
    const ang = Math.atan2(m.by - m.ay, m.bx - m.ax), segL = dist(m.ax, m.ay, m.bx, m.by);
    const want = (m.v > 0 ? ang : ang + Math.PI) + Math.sin(now / 1100 + m.ax) * .3;
    let turn = want - m.dir; turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    m.av += (turn * 5 - m.av * 4) * dt;
    m.dir += m.av * dt;
    if (m.wait > 0) m.wait -= dt;
    else if (Math.abs(turn) < .5) {
      m.s += m.v * 40 * dt / segL; m.step += dt * 8;
      if (m.s < 0 || m.s > 1) { m.s = Math.max(0, Math.min(1, m.s)); m.v *= -1; m.wait = 1.2; }
    }
    m.x = m.ax + (m.bx - m.ax) * m.s; m.y = m.ay + (m.by - m.ay) * m.s;
    const ax = p.x - m.x, ay = p.y - m.y, dm = Math.hypot(ax, ay);
    let da = Math.atan2(ay, ax) - m.dir; da = Math.atan2(Math.sin(da), Math.cos(da));
    if (dm < 290 && Math.abs(da) < .6) danger = true;
    if (!safe && ((dm < D.cone && Math.abs(da) < .38) || dm < 18)) return die('seen');
  }

  // --- финиш: у дома с любой стороны
  const nearHome = p.x > home.x - 35 && p.x < home.x + home.w + 35 && p.y > home.y - 35 && p.y < home.y + home.h + 85;   // включая крыльцо со стороны улицы
  if (nearHome && rivers.every(r => r.crossed)) {
    state = 'won';
    winTune();
    const ms = Math.round(now - t0), rec = saveScore(ms);
    say(`<b>${t('win')}</b>${t('winText')}<br>${t('time')}: ${fmt(ms / 1000)} · ${t(diff)[0].toLowerCase()} · ${t('tries')}: ${attempts}<br>${t('secrets')}: ${items.filter(i => i.found).length}/5${rec ? `<em>${t('record')}</em>` : ''}`, 5);
    setTimeout(() => { if (state === 'won') openMenu(); }, 5000);
  }
};

// ================= РИСОВАНИЕ =================
let camX = 0, camY = 0, windR = 180;
const vis = (x, y, m) => x > -m && y > -m && x < W + m && y < H + m;

const strokePoly = (pts, width, color) => {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = ctx.lineCap = 'round';
  ctx.beginPath();
  for (const [x, y] of pts) ctx.lineTo(x - camX, y - camY);
  ctx.stroke();
};

// Мост в своей системе координат: длина — вдоль дороги
const drawBridge = (r, cable) => {
  if (!vis(r.cx - camX, r.cy - camY, r.len)) return;
  ctx.save();
  ctx.translate(r.cx - camX, r.cy - camY);
  ctx.rotate(Math.atan2(r.uy, r.ux) - Math.PI / 2);
  const bw = r.bw, x0 = -bw / 2, y0 = -r.len / 2, bh = r.len;
  ctx.fillStyle = 'rgba(10,15,20,.5)'; ctx.fillRect(x0 + 6, y0 + 4, bw, bh);
  for (let y = y0 + 22; y < y0 + bh - 16; y += 26) for (const sx of [x0 - 3, x0 + bw - 5]) {
    ctx.fillStyle = '#d7e1ea'; ctx.beginPath(); ctx.arc(sx + 4, y + 4, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#2a2018'; ctx.fillRect(sx, y, 8, 8);
  }
  ctx.fillStyle = '#6a5240'; ctx.fillRect(x0, y0, bw, bh);
  for (let y = y0; y < y0 + bh; y += 7) {
    ctx.fillStyle = (Math.floor((y - y0) / 7) % 2) ? '#5e4836' : '#71594a'; ctx.fillRect(x0 + 6, y, bw - 12, 6);
    ctx.fillStyle = '#3a2c20'; ctx.fillRect(x0 + 6, y + 6, bw - 12, 1);
  }
  ctx.fillStyle = 'rgba(235,242,248,.55)';
  ctx.fillRect(x0 + 6, y0, 7, bh); ctx.fillRect(x0 + bw - 13, y0, 7, bh);
  for (const rx of [x0, x0 + bw - 6]) {
    ctx.fillStyle = '#3e2f22'; ctx.fillRect(rx, y0, 6, bh);
    ctx.fillStyle = '#eef3f7'; ctx.fillRect(rx + 1, y0, 3, bh);
    ctx.fillStyle = '#2a2018';
    for (let y = y0; y < y0 + bh; y += 14) ctx.fillRect(rx, y, 6, 4);
  }
  if (cable) {
    for (const py of [y0 - 6, y0 + bh - 10]) for (const px of [x0 - 6, x0 + bw - 4]) {
      ctx.fillStyle = 'rgba(10,15,20,.5)'; ctx.fillRect(px + 8, py + 6, 10, 16);
      ctx.fillStyle = '#4a4e55'; ctx.fillRect(px, py, 10, 16);
      ctx.fillStyle = '#eef3f7'; ctx.fillRect(px, py, 10, 4);
    }
    ctx.strokeStyle = 'rgba(40,45,52,.9)'; ctx.lineWidth = 1;
    for (const px of [x0 - 1, x0 + bw + 1]) for (let k = 1; k < 6; k++) {
      ctx.beginPath(); ctx.moveTo(px, y0); ctx.lineTo(px, y0 + bh * k / 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, y0 + bh); ctx.lineTo(px, y0 + bh - bh * k / 12); ctx.stroke();
    }
  }
  ctx.restore();
};

const poly = pts => { ctx.beginPath(); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath(); ctx.fill(); };
const drawHouse = h => {
  const x = h.x - camX, y = h.y - camY, f = fenceOf(h);
  ctx.strokeStyle = '#4b3b2c'; ctx.lineWidth = 2;
  ctx.setLineDash([3, 5]); ctx.strokeRect(f.x - camX, f.y - camY, f.w, f.h); ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(20,30,40,.45)'; ctx.fillRect(x + 8, y + 10, h.w, h.h + 20);
  ctx.fillStyle = h.goal ? '#6b4a32' : '#5b412c'; ctx.fillRect(x, y + h.h, h.w, 20);
  ctx.fillStyle = '#3e2c1e';
  for (let k = 4; k < 20; k += 5) ctx.fillRect(x, y + h.h + k, h.w, 1.5);
  const wins = h.goal ? [h.w * .3, h.w * .7] : [h.w / 2];
  for (const wx of wins) {
    ctx.fillStyle = h.lit ? '#ffcc66' : '#1a1d22'; ctx.fillRect(x + wx - 7, y + h.h + 5, 14, 10);
    ctx.fillStyle = '#3a2a1d'; ctx.fillRect(x + wx - .75, y + h.h + 5, 1.5, 10);
  }
  if (h.goal) {
    const L = x - 4, R = x + h.w + 4, T = y - 4, B = y + h.h + 2, rx1 = x + h.w * .3, rx2 = x + h.w * .7, ry = y + h.h / 2;
    ctx.fillStyle = '#2b4d3c'; poly([[L, T], [R, T], [rx2, ry], [rx1, ry]]);
    ctx.fillStyle = '#1f3a2d'; poly([[L, B], [R, B], [rx2, ry], [rx1, ry]]);
    ctx.fillStyle = '#35604b'; poly([[L, T], [rx1, ry], [L, B]]);
    ctx.fillStyle = '#183026'; poly([[R, T], [rx2, ry], [R, B]]);
    ctx.fillStyle = 'rgba(240,245,249,.85)';
    poly([[L + 6, T + 3], [R - 20, T + 3], [rx2 - 4, ry - 6], [rx1 + 2, ry - 6]]);
    ctx.fillStyle = '#c7d2db'; ctx.fillRect(rx1, ry - 1, rx2 - rx1, 2);
    ctx.fillStyle = '#7b4a3a'; ctx.fillRect(x + h.w * .62, y + 6, 10, 12);
    ctx.fillStyle = '#f4f8fb'; ctx.fillRect(x + h.w * .62, y + 6, 10, 3);
    return;
  }
  ctx.fillStyle = '#2e2218'; ctx.fillRect(x - 4, y - 4, h.w + 8, h.h + 6);
  ctx.fillStyle = '#dfe7ee'; ctx.fillRect(x - 2, y - 2, h.w + 4, h.h * .45);
  ctx.fillStyle = '#f4f8fb'; ctx.fillRect(x - 2, y - 2 + h.h * .45, h.w + 4, h.h * .55);
  ctx.fillStyle = '#7a6656'; ctx.fillRect(x - 2, y - 2 + h.h * .45, h.w + 4, 2);
  ctx.fillStyle = '#6b3f33'; ctx.fillRect(x + h.w * .72, y + 2, 9, 12);
  ctx.fillStyle = '#f4f8fb'; ctx.fillRect(x + h.w * .72, y + 2, 9, 3);
};

// Ель: ярусы круглых лап со снегом. Ивняк в пойме: голые серо-бурые кусты с инеем
const drawTree = t => {
  const x = t.x - camX, y = t.y - camY;
  ctx.fillStyle = 'rgba(20,30,40,.4)';
  ctx.beginPath(); ctx.ellipse(x + 7, y + 9, t.r * 1.05, t.r * .8, 0, 0, 7); ctx.fill();
  const layers = t.bush ? [[1, '#4a4038'], [.65, '#5d5248']] : [[1, '#162a1e'], [.7, '#1f3a29'], [.42, '#2b4c36']];
  for (const [k, col] of layers) {
    ctx.fillStyle = col; ctx.beginPath();
    const R = t.r * k;
    ctx.arc(x, y, R * .62, 0, 7);
    for (let i = 0; i < 7; i++) {
      const an = t.a + i * .898 + k;
      ctx.moveTo(x + Math.cos(an) * R * .58 + R * .4 * t.j[i], y + Math.sin(an) * R * .58);
      ctx.arc(x + Math.cos(an) * R * .58, y + Math.sin(an) * R * .58, R * .4 * t.j[i], 0, 7);
    }
    ctx.fill();
  }
  if (t.bush) {                                         // тонкие ветки
    ctx.strokeStyle = 'rgba(200,190,180,.35)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i < 6; i++) { const an = t.a + i * 1.05; ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * t.r * 1.1, y + Math.sin(an) * t.r * 1.1); }
    ctx.stroke();
  }
  ctx.fillStyle = t.bush ? 'rgba(238,243,247,.55)' : 'rgba(238,243,247,.8)';
  for (let i = 0; i < 4; i++) {
    const an = 3.6 + i * .45 + t.j[i] * .3, rr2 = t.r * (.3 + .35 * (i % 2));
    ctx.beginPath(); ctx.arc(x + Math.cos(an) * rr2, y + Math.sin(an) * rr2, t.r * (.1 + .05 * t.j[i]), 0, 7); ctx.fill();
  }
};

const drawPerson = (sx, sy, dir, step, coat, arm, hair, lamp) => {
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(dir); ctx.scale(1.6, 1.6);
  const sw = Math.sin(step) * 5;
  ctx.fillStyle = 'rgba(20,30,40,.35)'; ctx.beginPath(); ctx.ellipse(3, 4, 13, 10, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#1c1c22';
  ctx.beginPath(); ctx.ellipse(sw, -5, 5, 3.5, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-sw, 5, 5, 3.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = coat; ctx.beginPath(); ctx.ellipse(-1, 0, 8, 12, 0, 0, 7); ctx.fill();
  ctx.fillStyle = arm;
  ctx.beginPath(); ctx.arc(-sw * .8, -12, 3.5, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(sw * .8, 12, 3.5, 0, 7); ctx.fill();
  if (lamp) { ctx.fillStyle = '#ffcf7a'; ctx.beginPath(); ctx.arc(sw * .8 + 4, 14, 2.5, 0, 7); ctx.fill(); }
  ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(1, 0, 6.5, 0, 7); ctx.fill();
  ctx.fillStyle = '#e2c9a8'; ctx.beginPath(); ctx.arc(6, 0, 2.5, 0, 7); ctx.fill();
  ctx.restore();
};

// Пять секретов, каждый своей формы
const drawItem = (it, now) => {
  const x = it.x - camX, y = it.y - camY;
  ctx.save(); ctx.translate(x, y + Math.sin(now / 500 + it.x) * .8);
  ctx.fillStyle = 'rgba(20,30,40,.35)'; ctx.beginPath(); ctx.ellipse(3, 5, 11, 5, 0, 0, 7); ctx.fill();
  if (it.kind === 'mitten') {                    // красная варежка с белой опушкой
    ctx.fillStyle = '#b8323a'; ctx.beginPath(); ctx.ellipse(0, -2, 7, 9, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-7, 0, 3, 4.5, -.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#f2ede4'; ctx.fillRect(-7, 6, 14, 4);
    ctx.fillStyle = '#e8c9c9'; ctx.fillRect(-4, -6, 8, 1.5); ctx.fillRect(-4, -2, 8, 1.5);
  } else if (it.kind === 'sled') {               // деревянные санки на полозьях
    ctx.strokeStyle = '#3a3f46'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(10, -6); ctx.quadraticCurveTo(14, -6, 13, -2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-12, 6); ctx.lineTo(10, 6); ctx.quadraticCurveTo(14, 6, 13, 2); ctx.stroke();
    ctx.fillStyle = '#a0683a'; for (let i = -9; i < 10; i += 5) ctx.fillRect(i, -7, 3.5, 14);
  } else if (it.kind === 'cone') {               // кедровая шишка
    ctx.fillStyle = '#6b4226'; ctx.beginPath(); ctx.ellipse(0, 0, 6, 9, .3, 0, 7); ctx.fill();
    ctx.strokeStyle = '#3f2614'; ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i += 3) { ctx.beginPath(); ctx.moveTo(-6, i); ctx.lineTo(6, i + 2); ctx.stroke(); }
    ctx.fillStyle = '#4a6b3a'; ctx.fillRect(-1, -12, 2, 4);
  } else if (it.kind === 'coin') {               // монетка, блестит
    ctx.fillStyle = '#c99a2e'; ctx.beginPath(); ctx.arc(0, 0, 6.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#f0cf6a'; ctx.beginPath(); ctx.arc(-1, -1, 5, 0, 7); ctx.fill();
    ctx.fillStyle = '#c99a2e'; ctx.font = '700 7px system-ui'; ctx.textAlign = 'center'; ctx.fillText('5', -1, 2);
  } else {                                       // металлический свисток на шнурке
    ctx.strokeStyle = '#b8323a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(-9, 0, 5, 0, 7); ctx.stroke();
    ctx.fillStyle = '#5f6b78'; ctx.beginPath(); ctx.ellipse(0, 0, 6, 4.5, 0, 0, 7); ctx.fill();
    ctx.fillRect(2, -2.5, 9, 5);
    ctx.fillStyle = '#e8edf2'; ctx.fillRect(-3, -2, 4, 1.5);
  }
  ctx.restore();
};
const drawBeast = (e, wolf, now) => {
  const x = e.x - camX, y = e.y - camY;
  if (!vis(x, y, 40)) return;
  const s = wolf ? 1.35 : 1, run = Math.sin(now / 60) * 2;
  ctx.save(); ctx.translate(x, y); ctx.rotate(e.dir); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(20,30,40,.35)'; ctx.beginPath(); ctx.ellipse(3, 4, 14, 7, 0, 0, 7); ctx.fill();
  ctx.fillStyle = wolf ? '#5f6366' : '#3a2a1e';
  ctx.beginPath(); ctx.ellipse(-2, 0, 11, 6, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-14, run * .5, 6, 2.2, .2, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(10, 0, 4.5, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(13, -2); ctx.lineTo(18, 0); ctx.lineTo(13, 2); ctx.fill();
  ctx.fillStyle = wolf ? '#3f4245' : '#24190f';
  ctx.beginPath(); ctx.moveTo(8, -3); ctx.lineTo(6, -7); ctx.lineTo(10, -4); ctx.fill();
  ctx.beginPath(); ctx.moveTo(8, 3); ctx.lineTo(6, 7); ctx.lineTo(10, 4); ctx.fill();
  if (wolf) { ctx.fillStyle = '#8a8e91'; ctx.beginPath(); ctx.ellipse(-2, 0, 7, 2.5, 0, 0, 7); ctx.fill(); }
  ctx.restore();
};

const draw = now => {
  camX = p.x - W / 2; camY = p.y - H / 2;

  ctx.fillStyle = '#9aa9b8'; ctx.fillRect(0, 0, W, H);
  for (const st of ALLROADS) strokePoly(st, st === ROAD ? 44 : 36, '#8a8f8f');

  rivers.forEach((r, i) => {
    strokePoly(r.pts, r.w * 2 + 14, '#c9d4de');
    strokePoly(r.pts, r.w * 2, '#1b2a36');
    drawBridge(r, i === 1);
  });

  for (const h of houses) if (vis(h.x - camX, h.y - camY, 110)) drawHouse(h);
  for (const t of trees) if (vis(t.x - camX, t.y - camY, 60)) drawTree(t);
  for (const it of items) if (!it.found && vis(it.x - camX, it.y - camY, 30)) drawItem(it, now);
  for (const d of dogs) drawBeast(d, false, now);
  for (const w of wolves) drawBeast(w, true, now);
  for (const m of people) if (vis(m.x - camX, m.y - camY, 40)) drawPerson(m.x - camX, m.y - camY, m.dir, m.step, '#4a2a24', '#3d221d', '#2b2219', true);
  if (p.grace <= 0 || Math.floor(now / 120) % 2) drawPerson(W / 2, H / 2, p.dir, p.step, '#2f3a48', '#28313d', '#121216', true);

  ctx.fillStyle = '#e8eef5';
  for (const f of flakes) {
    f.y += f.s * .5; f.x += Math.sin(now / 900 + f.y / 50) * .15;
    const x = ((f.x - camX * .2) % W + W) % W, y = ((f.y - camY * .2) % H + H) % H;
    ctx.fillRect(x, y, f.s, f.s);
  }

  // ТЕМНОТА
  windR += ((windy ? D.light * .75 : D.light) - windR) * .03;
  const R = windR + Math.sin(now / 130) * 3 + Math.sin(now / 47) * (windy ? 7 : 2);
  const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, R);
  g.addColorStop(0, 'rgba(255,200,120,0.05)');
  g.addColorStop(.55, 'rgba(0,0,0,0.35)');
  g.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // сквозь темноту видно: окна, фонари людей, глаза волков, лай собак
  ctx.shadowColor = '#ffb347'; ctx.shadowBlur = 18; ctx.fillStyle = '#ffcc66';
  for (const h of houses) {
    if (!h.lit || !vis(h.x - camX, h.y - camY, 80)) continue;
    for (const wx of h.goal ? [h.w * .3, h.w * .7] : [h.w / 2]) ctx.fillRect(h.x - camX + wx - 7, h.y - camY + h.h + 5, 14, 10);
  }
  ctx.shadowBlur = 0;
  for (const h of houses) {
    if (!h.lit) continue;
    const x = h.x - camX + h.w / 2, y = h.y - camY + h.h + 34;
    if (!vis(x, y, 60)) continue;
    const lg = ctx.createRadialGradient(x, y, 0, x, y, 30);
    lg.addColorStop(0, 'rgba(255,190,90,.35)'); lg.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = lg; ctx.fillRect(x - 30, y - 30, 60, 60);
  }
  for (const m of people) {
    const x = m.x - camX, y = m.y - camY;
    if (!vis(x, y, 260)) continue;
    const lx = x + Math.cos(m.dir) * 14, ly = y + Math.sin(m.dir) * 14;
    const cg = ctx.createRadialGradient(lx, ly, 0, lx, ly, D.cone + 10);
    cg.addColorStop(0, 'rgba(255,230,160,0)'); cg.addColorStop(.1, 'rgba(255,230,160,.045)');
    cg.addColorStop(.55, 'rgba(255,230,160,.025)'); cg.addColorStop(1, 'rgba(255,230,160,0)');
    ctx.fillStyle = cg;
    for (let k = 0; k < 20; k++) {
      const half = .12 + k * .022;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.arc(lx, ly, D.cone + 10, m.dir - half, m.dir + half); ctx.closePath(); ctx.fill();
    }
    const gl = ctx.createRadialGradient(lx, ly, 0, lx, ly, 22);
    gl.addColorStop(0, 'rgba(255,220,150,.5)'); gl.addColorStop(1, 'rgba(255,220,150,0)');
    ctx.fillStyle = gl; ctx.fillRect(lx - 22, ly - 22, 44, 44);
  }
  for (const w of wolves) {
    const x = w.x - camX, y = w.y - camY;
    if (!vis(x, y, 20) || (now / 1000 + w.blink) % 5 < .15) continue;
    const ex = Math.cos(w.dir) * 14, ey = Math.sin(w.dir) * 14, nx = -Math.sin(w.dir) * 3, ny = Math.cos(w.dir) * 3;
    ctx.shadowColor = '#d8ff6a'; ctx.shadowBlur = 8; ctx.fillStyle = w.state === 'chase' ? '#ffe36a' : '#c9e86a';
    ctx.beginPath(); ctx.arc(x + ex + nx, y + ey + ny, 1.8, 0, 7); ctx.arc(x + ex - nx, y + ey - ny, 1.8, 0, 7); ctx.fill();
    ctx.shadowBlur = 0;
  }
  for (const it of items) {                       // редкая искорка: секрет где-то рядом
    if (it.found || !vis(it.x - camX, it.y - camY, 10) || dist(it.x, it.y, p.x, p.y) > 520) continue;
    const ph = (now / 1000 + it.x % 3) % 3.2;
    if (ph > .45) continue;
    const a = Math.sin(ph / .45 * Math.PI) * .7, x = it.x - camX, y = it.y - camY - 4, s = 5;
    ctx.strokeStyle = `rgba(255,255,240,${a})`; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); ctx.stroke();
  }
  ctx.font = '600 14px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8d6b8';
  for (const d of dogs) if (d.show > 0 && vis(d.x - camX, d.y - camY, 20)) ctx.fillText(t('woof'), d.x - camX, d.y - camY - 18);

  const n = rivers.filter(r => r.crossed).length;
  const col = p.warm > 50 ? '#ffb347' : p.warm > 25 ? '#9fc4e8' : '#6aa0d8';
  const label = p.warm > 25 ? t('warm') : (now % 800 < 400 ? t('cold') : '');
  hud.innerHTML = `${t('bridges')}: ${n}/3 · ${t('secrets')}: ${items.filter(i => i.found).length}/5 · ${fmt(((state === 'won' ? wonAt : now) - t0) / 1000)}${p.run ? ' · ' + t('run') : ''}<div class="warm"><b>${label}</b><div class="bar"><i style="width:${p.warm}%;background:${col}"></i></div></div>`;
};

let wonAt = 0;

// ================= МЕНЮ, СБРОС, ДОСКА ПОЧЁТА =================
const menu = document.getElementById('menu'), nickIn = document.getElementById('nick');
const diffsEl = document.getElementById('diffs'), board = document.getElementById('board'), srcEl = document.getElementById('src');
const store = {get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
               set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }};
nickIn.value = store.get('tma_nick', '');
diff = store.get('tma_diff', 'normal'); if (!DIFFS[diff]) diff = 'normal';
const getNick = () => (nickIn.value.trim().slice(0, 16) || t('player'));

const renderDiffs = () => {
  diffsEl.innerHTML = '';
  for (const [k, v] of Object.entries(DIFFS)) {
    const b = document.createElement('button');
    b.setAttribute('aria-pressed', k === diff);
    b.textContent = t(k)[0];
    const sm = document.createElement('small'); sm.textContent = t(k)[1]; b.append(sm);
    b.addEventListener('click', () => { diff = k; store.set('tma_diff', k); renderDiffs(); renderBoard(); });
    diffsEl.append(b);
  }
};

// Карта v2 (маршрут как на Google Картах): старые рекорды с прямой дороги не смешиваем
const MAPV = 2;
let db = null, uid = null, shared = null;
let local = store.get('tma_scores2', []);
const rows = () => {
  const list = shared
    ? Object.entries(shared).filter(([, r]) => r.v === MAPV && typeof r[diff] === 'number').map(([id, r]) => ({nick: String(r.nick || t('player')).slice(0, 16), ms: r[diff], me: id === uid}))
    : local.filter(r => r.diff === diff).map(r => ({nick: r.nick, ms: r.ms, me: false}));
  return list.sort((a, b) => a.ms - b.ms).slice(0, 10);
};
const renderBoard = () => {
  srcEl.textContent = (shared ? t('shared') : t('local')) + ' · ' + t(diff)[0].toLowerCase();
  board.innerHTML = '';
  const list = rows();
  if (!list.length) {
    const tr = board.insertRow(), td = tr.insertCell(); td.colSpan = 3; td.className = 'empty';
    td.textContent = t('empty');
    return;
  }
  list.forEach((r, i) => {
    const tr = board.insertRow(); if (r.me) tr.className = 'me';
    tr.insertCell().textContent = i + 1;
    tr.insertCell().textContent = r.nick;
    tr.insertCell().textContent = fmt(r.ms / 1000) + '.' + String(Math.floor(r.ms % 1000 / 100));
  });
};
const saveScore = ms => {
  const nick = getNick();
  const prev = local.filter(r => r.diff === diff).reduce((m, r) => Math.min(m, r.ms), Infinity);
  local.push({nick, diff, ms, at: Date.now()});
  local = local.sort((a, b) => a.ms - b.ms).filter((r, i, a) => a.filter(x => x.diff === r.diff).indexOf(r) < 20);
  store.set('tma_scores2', local);
  if (db && uid) {
    const old = (shared && shared[uid]) || {}, mine = old.v === MAPV ? old : {};
    if (!(mine[diff] <= ms) || mine.nick !== nick) {
      const body = {v: MAPV, nick, easy: mine.easy ?? null, normal: mine.normal ?? null, hard: mine.hard ?? null};
      body[diff] = Math.min(ms, mine[diff] ?? Infinity);
      db.doc('scores/' + uid).set(body).catch(() => {});
    }
  }
  renderBoard();
  return ms < prev;
};
(async () => {
  try {
    if (!window.claude || !window.claude.use) return;
    const [d, u] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!d || !u) return;
    const id = await u.id();
    if (!id) return;
    db = d; uid = id;
    db.collection('scores').onSnapshot(snap => {
      shared = {};
      for (const doc of snap.docs) shared[doc.id] = doc.data();
      renderBoard();
    }, () => { db = null; shared = null; renderBoard(); });
  } catch (e) {}
})();

const resetWorld = () => {
  for (const r of rivers) r.crossed = false;
  checkpoint = {...START};
  p.x = START.x; p.y = START.y; p.warm = 100; p.dir = -Math.PI * .75; p.grace = 2; p.onBr = null;
  for (const it of items) it.found = it.x === 0;
  spawnEnemies();
  for (const k in keys) keys[k] = false;
  windR = D.light;
};
const resumeGame = () => {
  if (!pausedFrom) return;
  t0 += last - pausedAt;                                   // время в паузе не считается
  state = pausedFrom; pausedFrom = null;
  for (const k in keys) keys[k] = false;
  menu.hidden = true; hud.hidden = false; document.getElementById('hint').hidden = false;
  menuMusic(false);
};
const startGame = () => {
  wake(); pausedFrom = null;
  store.set('tma_nick', nickIn.value.trim().slice(0, 16));
  D = DIFFS[diff]; attempts = 1;
  resetWorld();
  menu.hidden = true; hud.hidden = false; document.getElementById('hint').hidden = false;
  t0 = -1; state = 'play'; menuMusic(false);
  say(t('intro'), 4.5);
};
let pausedFrom = null, pausedAt = 0;
const resumeBtn = document.getElementById('resume'), goBtn = document.getElementById('go');
const openMenu = (pause = false) => {
  pausedFrom = pause ? state : null; pausedAt = last;      // запоминаем, где остановились
  resumeBtn.hidden = !pause;
  goBtn.textContent = pause ? t('restart') : t('start');
  goBtn.classList.toggle('ghost', pause);
  state = 'menu'; danger = false; menuMusic(true);
  menu.hidden = false; hud.hidden = true; document.getElementById('hint').hidden = true;
  msg.style.opacity = 0; msgTimer = 0;
  renderBoard();
};
const applyLang = () => {
  document.documentElement.lang = lang;
  document.title = t('title');
  for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
  nickIn.placeholder = t('nickPh');
  document.getElementById('hint').textContent = t('hint');
  for (const b of document.querySelectorAll('#lang button')) b.setAttribute('aria-pressed', b.dataset.l === lang);
  sndBtn.textContent = muted ? t('sndOff') : t('sndOn');
  if (pausedFrom) goBtn.textContent = t('restart');
  renderDiffs(); renderBoard();
};
for (const b of document.querySelectorAll('#lang button')) b.addEventListener('click', () => { lang = b.dataset.l; store.set('tma_lang', lang); applyLang(); });
document.getElementById('go').addEventListener('click', startGame);
resumeBtn.addEventListener('click', resumeGame);
menu.addEventListener('pointerdown', wake);          // музыка меню включается с первого касания
applyLang();
spawnEnemies();

const frame = now => {
  const dt = Math.min((now - last) / 1000, .05); last = now;
  if (t0 < 0) t0 = now;
  const was = state;
  update(dt, now);
  if (was !== 'won' && state === 'won') wonAt = now;
  if ((msgTimer -= dt) <= 0) msg.style.opacity = 0;
  draw(now);
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
}
