{
const cv = document.getElementById('c');
let ctx = cv.getContext('2d');
const hud = document.getElementById('hud'), msg = document.getElementById('msg'), sndBtn = document.getElementById('snd');
let W, H;
const resize = () => {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
addEventListener('resize', resize); resize();

let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;   // карта — всегда одинаковая
const rr = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
// постоянное «случайное» число для дома/льдины по координатам — внешний вид не меняется между заходами
const hv = (x, y, k) => { const s = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453; return s - Math.floor(s); };                          // враги — каждый раз по-новому
const dist = (a, b, c, d) => Math.hypot(a - c, b - d);

// ================= ЯЗЫК =================
const T = {
  ru: {
    title: 'Дорога домой',
    story: 'Зима, десять вечера. Мальчик сбежал от тёти и идёт к бабушке: из Верхнеусинского в Нижнеусинское, через три моста. Темно и морозно. Не попадайся взрослым, береги тепло и не сходи с пути. По дороге спрятаны 5 секретов.',
    resume: 'Продолжить', restart: 'Начать заново', runBtn: 'Бег', pause: 'Пауза',
    nickLabel: 'Имя для доски почёта', nickPh: 'Игрок', diffLabel: 'Сложность', start: 'Начать',
    keys: 'WASD — идти · Shift — бег · F — фонарь · H — чутьё · M — звук · Esc — пауза',
    hint: 'WASD — идти · Shift — бежать · F — фонарь · H — чутьё · Esc — пауза',
    board: 'Доска почёта', shared: 'Общая доска', local: 'Рекорды на этом устройстве', empty: 'Пока никто не дошёл. Будь первым!',
    sndOn: 'Звук: вкл', sndOff: 'Звук: выкл',
    bridges: 'Мосты', run: 'бег', warm: 'Тепло', cold: 'Холодно!', woof: 'гав!',
    intro: '<b>В путь!</b>Иди по дороге через три моста к дому бабушки.<br><small>Тепло тает — грейся у светящихся окон.</small>',
    b1: 'Первый мост позади!', b2: 'Второй мост позади!', b3: 'Последний мост позади!',
    b3note: 'Дом бабушки — на дальней улице справа. Зелёная крыша, два окна.',
    feedback: 'Нашёл баг или есть идея? Оставь отзыв →',
    tipLabel: 'Подсказка',
    tipDog: 'Собака! Посвети на неё фонарём{F} — отбежит.',
    tipWolf: 'Волки боятся света. Свети на них фонарём{F}.',
    tipAdult: 'Не попадай в луч взрослых. За домом тебя не видно.',
    tipHunter: 'Охотник! Увидел «!» — сразу уходи из луча.',
    tipCold: 'Мёрзнешь? Грейся у окон или найди термос.',
    tipSecret: 'Секрет! Чутьё{H} покажет, где следующий.',
    tipMoto: 'Мотор! Это дядя. Уйди с дороги от фары.',
    tipLost: 'Заблудился? Чутьё{H} покажет путь.',
    warmed: 'Ты согрелся. Здесь сохранение.',
    lose: 'Попался!', back: 'Начнёшь с последнего моста…',
    c1: 'Верхнеусинское, дом тёти. Без десяти десять. Бабушка — в Нижнеусинском, за тремя мостами, и он очень по ней скучает.',
    c2: 'Дверь заперта. Но он уже всё решил.',
    c3: 'Он разбивает стекло, вылезает в окно и бежит — босиком, прямо по снегу.',
    c4: 'Ночь, мороз. До бабушки почти три километра.', c5: 'Главное — чтобы взрослые не заметили.',
    o1: 'Нижнеусинское. Зелёная крыша, в окне свет — бабушка не спит.', o3: 'У печки он раскладывает свои находки: варежку, санки, шишку, монетку и свисток. Бабушка гладит его по голове.', o2: 'Скрипит дверь. На пороге бабушка. Он дома.', skip: 'Пропустить ›',
    lampOn: 'Фонарь включён', lampOff: 'Фонарь выключен: тебя хуже видно, но ты быстрее мёрзнешь', lampOffShort: 'без фонаря',
    senseWait: 'Чутьё ещё не вернулось — подожди', senseItem: 'Чутьё: секрет где-то там', senseRoad: 'Чутьё: домой — туда', senseShort: 'чутьё', lampBtn: 'Фонарь', senseBtn: 'Чутьё',
    tea: 'Горячий чай! Тепло снова на максимуме.',
    drowned: 'Провалился под лёд. Реку переходи только по мосту.', foundItem: 'Найдено', secrets: 'Секреты',
    mitten: 'варежка', sled: 'санки', cone: 'кедровая шишка', coin: 'монетка', whistle: 'свисток',
    shot: 'Охотник выстрелил. Увидел «!» — сразу уходи из луча.', task: 'Задание',
    task0: 'Дойди до первого моста', task1: 'Перейди мост через Ус', task2: 'Через лес к третьему мосту',
    task3: 'Найди дом с зелёной крышей', taskDone: 'Ты дома',
    froze: 'Замёрз. Грейся у окон, на мостах и пей чай из термосов.', dogs: 'Собаки догнали. Свети на них фонарём — они отступят.', wolves: 'Волки догнали. Они боятся света фонаря.', seen: 'Взрослые заметили тебя. Обходи их лучи и прячься за домами.', uncle: 'Дядя заметил тебя. Слышишь мотор — уходи с дороги.',
    win: 'Ты дома!', winText: 'Бабушка ждала тебя.', time: 'Время', tries: 'попыток', record: 'Новый личный рекорд!',
    player: 'Игрок',
    easy: ['Лёгкий', 'Больше тепла и света, враги медленнее'],
    normal: ['Нормальный', 'Так, как задумано'],
    hard: ['Сложный', 'Сильный мороз, мало света, враги зорче'],
  },
  en: {
    title: 'Return Home',
    story: 'Winter, ten at night. The boy has run away from his aunt and is walking to Grandma\'s: from Verkhneusinskoye to Nizhneusinskoye, across three bridges. It is dark and freezing. Don\'t let grown-ups see you, keep warm and stay on track. 5 secrets are hidden along the way.',
    resume: 'Continue', restart: 'Restart', runBtn: 'Run', pause: 'Pause',
    nickLabel: 'Name for the leaderboard', nickPh: 'Player', diffLabel: 'Difficulty', start: 'Start',
    keys: 'WASD — walk · Shift — run · F — light · H — sense · M — sound · Esc — pause',
    hint: 'WASD — walk · Shift — run · F — flashlight · H — sense · Esc — pause',
    board: 'Leaderboard', shared: 'Shared board', local: 'Records on this device', empty: 'Nobody has made it yet. Be the first!',
    sndOn: 'Sound: on', sndOff: 'Sound: off',
    bridges: 'Bridges', run: 'running', warm: 'Warmth', cold: 'Freezing!', woof: 'woof!',
    intro: '<b>Off you go!</b>Follow the road across three bridges to Grandma\'s house.<br><small>Warmth runs out — warm up by lit windows.</small>',
    b1: 'First bridge done!', b2: 'Second bridge done!', b3: 'Last bridge done!',
    b3note: 'Grandma\'s house is on the far street to the right. Green roof, two windows.',
    feedback: 'Found a bug or have an idea? Leave feedback →',
    tipLabel: 'Tip',
    tipDog: 'A dog! Shine your flashlight{F} at it — it backs off.',
    tipWolf: 'Wolves fear light. Shine your flashlight{F} at them.',
    tipAdult: 'Stay out of grown-ups\' beams. Houses hide you.',
    tipHunter: 'A hunter! See the “!” — leave the beam at once.',
    tipCold: 'Freezing? Warm up by windows or find a thermos.',
    tipSecret: 'A secret! Your sense{H} points to the next one.',
    tipMoto: 'An engine! It\'s your uncle. Get off the road.',
    tipLost: 'Lost? Your sense{H} shows the way.',
    warmed: 'You warmed up. Progress saved here.',
    lose: 'Caught!', back: 'Back to the last bridge…',
    c1: 'Verkhneusinskoye, his aunt\'s house. Ten to ten. Grandma lives in Nizhneusinskoye, three bridges away, and he misses her badly.',
    c2: 'The door is locked. But his mind is made up.',
    c3: 'He breaks the glass, climbs out of the window and runs — barefoot, straight through the snow.',
    c4: 'Night and frost. Almost three kilometres to Grandma\'s.', c5: 'Just don\'t let the grown-ups see you.',
    o1: 'Nizhneusinskoye. A green roof and a lit window — Grandma is still up.', o3: 'By the stove he lays out everything he found: a mitten, a sled, a cone, a coin and a whistle. Grandma strokes his hair.', o2: 'The door creaks. Grandma is in the doorway. He is home.', skip: 'Skip ›',
    lampOn: 'Flashlight on', lampOff: 'Flashlight off: harder to spot, but you freeze faster', lampOffShort: 'no light',
    senseWait: 'Your sense isn\'t back yet — wait', senseItem: 'Sense: a secret is that way', senseRoad: 'Sense: home is that way', senseShort: 'sense', lampBtn: 'Light', senseBtn: 'Sense',
    tea: 'Hot tea! Warmth is full again.',
    drowned: 'You fell through the ice. Cross rivers only by bridges.', foundItem: 'Found', secrets: 'Secrets',
    mitten: 'a mitten', sled: 'a sled', cone: 'a cedar cone', coin: 'a coin', whistle: 'a whistle',
    shot: 'The hunter fired. See the “!” — leave the beam at once.', task: 'Objective',
    task0: 'Reach the first bridge', task1: 'Cross the Us bridge', task2: 'Through the forest to bridge 3',
    task3: 'Find the house with a green roof', taskDone: 'You are home',
    froze: 'You froze. Warm up by windows, on bridges and with tea.', dogs: 'The dogs caught you. Shine your light at them — they back off.', wolves: 'The wolves caught you. They fear your flashlight.', seen: 'A grown-up saw you. Avoid their beams and hide behind houses.', uncle: 'Your uncle saw you. Hear the engine — get off the road.',
    win: 'You\'re home!', winText: 'Grandma was waiting for you.', time: 'Time', tries: 'attempts', record: 'New personal best!',
    player: 'Player',
    easy: ['Easy', 'More warmth, wider light, slower enemies'],
    normal: ['Normal', 'As intended'],
    hard: ['Hard', 'Bitter frost, little light, sharp-eyed enemies'],
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
    r.len = Math.min(2 * (r.w + 10) / Math.max(sin, .4) + 40, 4 * r.w + 80);   // перекрывает воду и лёд у берега
    break outer;
  }
  r.check = {x: r.cx + r.ux * (r.len / 2 + 30), y: r.cy + r.uy * (r.len / 2 + 30)};
  r.minX = Math.min(...r.pts.map(q => q[0])) - r.w; r.maxX = Math.max(...r.pts.map(q => q[0])) + r.w;
  r.minY = Math.min(...r.pts.map(q => q[1])) - r.w; r.maxY = Math.max(...r.pts.map(q => q[1])) + r.w;
}
// Путь дяди на мотоцикле: отрезок дороги перед третьим мостом (около 1300 px), туда и обратно
const MOTO = (() => {
  const r = rivers[2];
  let ib = 0, bd = Infinity;
  ROAD.forEach((q, i) => { const d = dist(q[0], q[1], r.cx, r.cy); if (d < bd) { bd = d; ib = i; } });
  while (ib > 0 && dist(ROAD[ib][0], ROAD[ib][1], r.cx, r.cy) < r.len / 2 + 110) ib--;     // разворачивается, не доезжая до моста
  const pts = [ROAD[ib]], cum = [0];
  for (let i = ib - 1; i >= 0 && cum[cum.length - 1] < 1300; i--) { pts.push(ROAD[i]); cum.push(cum[cum.length - 1] + dist(ROAD[i][0], ROAD[i][1], ROAD[i + 1][0], ROAD[i + 1][1])); }
  return {pts, cum, len: cum[cum.length - 1]};
})();
const motoAt = u => {                             // точка и направление пути на расстоянии u от моста
  const {pts, cum} = MOTO; let i = 1;
  while (i < cum.length - 1 && cum[i] < u) i++;
  const k = (u - cum[i - 1]) / Math.max(1, cum[i] - cum[i - 1]), a = pts[i - 1], b = pts[i];
  return {x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, ang: Math.atan2(b[1] - a[1], b[0] - a[0])};
};
for (const r of rivers) {                       // льдины у кромки воды
  r.floes = [];
  for (let i = 2; i < r.pts.length - 1; i += 2) {
    const [ax, ay] = r.pts[i], [bx, by] = r.pts[i + 1], l = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / l, ny = (bx - ax) / l;
    if (hv(ax, ay, 9) < .45) continue;
    const side = hv(ax, ay, 3) < .5 ? -1 : 1, off = r.w * (.55 + hv(ax, ay, 4) * .3);
    const fx = ax + nx * off * side, fy = ay + ny * off * side;
    if (r.cx !== undefined && Math.hypot(fx - r.cx, fy - r.cy) < r.len / 2 + 20) continue;   // не под мостом
    r.floes.push({x: fx, y: fy, r: 5 + hv(ax, ay, 5) * 8, a: hv(ax, ay, 6) * 6.3});
  }
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
// Дома заслоняют свет: луч фонаря не проходит сквозь стены, и сквозь дом тебя не увидят
const OCC = houses.map(h => ({x: h.x, y: h.y, w: h.w, h: h.h + 20}));
const segHits = (ax, ay, bx, by, r) => {          // отрезок пересекает прямоугольник (Лианг–Барски)
  let t0 = 0, t1 = 1; const dx = bx - ax, dy = by - ay;
  for (const [pp, q] of [[-dx, ax - r.x], [dx, r.x + r.w - ax], [-dy, ay - r.y], [dy, r.y + r.h - ay]]) {
    if (pp === 0) { if (q < 0) return false; continue; }
    const k = q / pp;
    if (pp < 0) { if (k > t1) return false; if (k > t0) t0 = k; } else { if (k < t0) return false; if (k < t1) t1 = k; }
  }
  return true;
};
const losClear = (ax, ay, bx, by) => !OCC.some(r => segHits(ax, ay, bx, by, r));
const EDGE_N = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const shadows = (c, lx, ly, range, ox, oy) => {   // тени домов от точки света (каждая — четырёхугольник за стеной)
  for (const r of OCC) {
    if (r.x > lx + range || r.x + r.w < lx - range || r.y > ly + range || r.y + r.h < ly - range) continue;
    const C = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]];
    c.beginPath();                                                    // одним контуром на дом — без светлых швов
    for (let i = 0; i < 4; i++) {
      const a = C[i], b = C[(i + 1) % 4], n = EDGE_N[i];
      if ((lx - a[0]) * n[0] + (ly - a[1]) * n[1] >= 0) continue;     // стена смотрит на свет — тень не от неё
      const far = q => { const dx = q[0] - lx, dy = q[1] - ly, k = range * 2 / Math.max(1, Math.hypot(dx, dy)); return [q[0] + dx * k, q[1] + dy * k]; };
      const fa = far(a), fb = far(b);
      c.moveTo(a[0] + ox, a[1] + oy); c.lineTo(b[0] + ox, b[1] + oy); c.lineTo(fb[0] + ox, fb[1] + oy); c.lineTo(fa[0] + ox, fa[1] + oy); c.closePath();
    }
    c.fill();
  }
};

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
const onDeck = (x, y) => rivers.some(r => { const b = bridgeLocal(r, x, y); return Math.abs(b.t) < r.len / 2 && Math.abs(b.q) < r.bw / 2 - 6; });
const pBlocked = (x, y) => {
  if (landBlocked(x, y) || bumpsPerson(x, y)) return true;
  if (onDeck(p.x, p.y)) {                       // стоишь на настиле (над водой или над берегом) — перила не пускают в воду
    const r = inRiver(x, y, -8); return !!r && !onDeck(x, y);
  }
  return false;
};

// ================= СЕКРЕТЫ: 5 разных вещей, спрятаны в стороне от дороги =================
const ITEM_KINDS = ['mitten', 'sled', 'cone', 'coin', 'whistle'];
const ITEM_ZONES = [[4980, 5500, 1300, 2400], [3980, 4600, 0, 2400], [2700, 3500, 0, 2400], [1500, 2400, 0, 2400], [130, 1150, 300, 1600]];
// Карта достижимости: клетки 10×10, куда можно дойти пешком от старта (один раз при загрузке)
const RG = 10, rgw = Math.ceil(WW / RG), rgh = Math.ceil(WH / RG), reach = new Uint8Array(rgw * rgh);
{
  const q = [Math.round(5250 / RG) * rgw + Math.round(1900 / RG)]; reach[q[0]] = 1;
  for (let qi = 0; qi < q.length; qi++) {
    const id = q[qi], x = id % rgw, y = (id / rgw) | 0;
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + a, ny = y + b, n = ny * rgw + nx;
      if (nx < 0 || ny < 0 || nx >= rgw || ny >= rgh || reach[n] || blocked(nx * RG, ny * RG)) continue;
      reach[n] = 1; q.push(n);
    }
  }
}
const reachable = (x, y) => reach[Math.round(y / RG) * rgw + Math.round(x / RG)] === 1;
const items = ITEM_KINDS.map(kind => ({kind, x: 0, y: 0, found: false}));
// Термосы с горячим чаем: возвращают всё тепло. Чем сложнее, тем их меньше; лежат каждый раз в новых местах
let thermos = [];
const placeThermos = () => {
  thermos = [];
  const zones = [[4950, 5500, 1300, 2400], [3950, 4600, 0, 2400], [2900, 3650, 0, 2400], [2150, 2900, 0, 2400], [1450, 2150, 0, 2400], [150, 1150, 300, 1600]];
  const pickZones = [...zones].sort(() => Math.random() - .5).slice(0, D.thermos);
  for (const [y0, y1, x0, x1] of pickZones) for (let k = 0; k < 3000; k++) {
    const x = rr(x0, x1), y = rr(y0, y1), d = roadDist(x, y);
    if (d < 40 || d > 320 || !reachable(x, y) || blocked(x, y) || inRiver(x, y, 40) || houses.some(h => overlap(fenceOf(h), {x: x - 20, y: y - 20, w: 40, h: 40}))) continue;
    if (dist(x, y, 1900, 5250) < 400 || items.some(i => dist(i.x, i.y, x, y) < 120)) continue;
    thermos.push({x, y, taken: false}); break;
  }
};
const placeItems = () => {                     // по одному секрету в каждой зоне, зоны тасуются между вещами
  const zones = [...ITEM_ZONES].sort(() => Math.random() - .5);
  items.forEach((it, i) => {
    const [y0, y1, x0, x1] = zones[i];
    it.found = true;
    for (let k = 0; k < 4000; k++) {
      const x = rr(x0, x1), y = rr(y0, y1), d = roadDist(x, y);
      if (d < 120 || d > 450 || !reachable(x, y) || blocked(x, y) || inRiver(x, y, 40) || houses.some(h => overlap(fenceOf(h), {x: x - 20, y: y - 20, w: 40, h: 40}))) continue;
      if (dist(x, y, 1900, 5250) < 250) continue;
      it.x = x; it.y = y; it.found = false; break;
    }
  });
};

// ================= ВРАГИ: каждый заход расставляются случайно =================
const START = {x: 1900, y: 5250};
const SAFE = [START, ...rivers.map(r => r.check)];
const farFromSafe = (x, y, d) => SAFE.every(s => dist(x, y, s.x, s.y) > d);
let dogs = [], wolves = [], people = [], hunters = [];
const moto = {u: 0, dir: 1, pause: 0, x: 0, y: 0, ang: 0, face: 0, state: 'ride', t: 0, spd: 0, on: false};
const resetMoto = () => { Object.assign(moto, {u: MOTO.len, dir: -1, pause: 1, state: 'ride', t: 0, spd: 0}); const q = motoAt(moto.u); moto.x = q.x; moto.y = q.y; moto.face = q.ang + Math.PI; };
// сквозь людей не пройти: шаг запрещён, если он ближе 20 к человеку и ещё ближе, чем сейчас (отойти можно всегда)
const bumpsPerson = (x, y) => [...hunters, ...people].some(h => { const d = dist(x, y, h.x, h.y); return d < 20 && d < dist(p.x, p.y, h.x, h.y); });
const wolfSpot = (y0, y1) => {                 // случайное место для волка: не у дороги и не у точек возврата
  for (let i = 0; i < 400; i++) {
    const x = rr(60, WW - 60), y = rr(y0, y1);
    if (roadDist(x, y) >= 140 && !blocked(x, y) && farFromSafe(x, y, 380)) return {x, y};
  }
  return null;
};
// Охотники с ружьём и фонарём на стволе: стоят в лесу и в пойме, водят лучом, смотрят в сторону дороги.
// Заметили — целятся (видно «!»), не успел уйти из луча — выстрел
const spawnHunters = () => {
  hunters = [];
  const zones = [[1450, 3600], [3950, 4620]];
  for (let tries = 0; hunters.length < D.hunters && tries < 3000; tries++) {
    const [y0, y1] = zones[hunters.length % 3 === 2 ? 1 : 0];
    const x = rr(80, WW - 80), y = rr(y0, y1), d = roadDist(x, y);
    if (d < 110 || d > 420 || blocked(x, y) || !farFromSafe(x, y, 420) || hunters.some(h => dist(h.x, h.y, x, y) < 500)) continue;
    let best = null, bd = 1e9;                    // смотрит в сторону ближайшей точки дороги
    for (const [rx, ry] of ROAD) { const dd = dist(x, y, rx, ry); if (dd < bd) { bd = dd; best = [rx, ry]; } }
    const base = Math.atan2(best[1] - y, best[0] - x);
    hunters.push({x, y, base, dir: base, ph: rr(0, 6), state: 'scan', t: 0, flash: 0, step: 0,
      look: {coat: pick(['#3d4a2e', '#4a4a36', '#3a3f34']), hat: 'cap', hatCol: '#c76a1e'}});
  }
};
const spawnEnemies = () => {
  // собаки во дворах случайных домов
  dogs = houses.filter(h => !h.goal && farFromSafe(h.x + h.w / 2, h.y + h.h, 260))
    .sort(() => Math.random() - .5).slice(0, D.dogs)
    .map(h => { const hx = h.x + h.w / 2, hy = h.y + h.h + 38; return {hx, hy, x: hx, y: hy, state: 'idle', bark: 0, show: 0, dir: rr(0, 6.3), lose: 0,
      look: {col: pick(['#2a2622', '#5a3a22', '#8a5a2e', '#6d6a66', '#c8b89a', '#3b3029']), size: rr(.8, 1.12), spot: Math.random() < .4, ph: rr(0, 6)}}; });
  // волки: 5 в лесу, 2 в пойме между мостами 1 и 2
  wolves = [];
  const place = (y0, y1, n) => {
    const goal = wolves.length + n;                 // n волков именно в этой зоне (раньше n считалось от общего числа)
    for (let tries = 0; wolves.length < goal && tries < 2000; tries++) {
      const s = wolfSpot(y0, y1);
      if (s) wolves.push({x: s.x, y: s.y, tx: s.x, ty: s.y, y0, y1, state: 'wander', dir: rr(0, 6.3), blink: rr(0, 5), pause: rr(0, 2), lose: 0,
        look: {col: pick(['#5f6366', '#6b6660', '#55595c', '#76726a', '#4d4f52']), size: rr(.95, 1.15), ph: rr(0, 6)}});
    }
  };
  place(1350, 3650, D.wolvesForest); place(3950, 4600, D.wolvesFlood);
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
    if (people.length >= D.people) break;
    if (people.some(m => dist(m.ax, m.ay, a[0], a[1]) < 220)) continue;
    const v = Math.random() < .5 ? 1 : -1, ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    people.push({ax: a[0], ay: a[1], bx: b[0], by: b[1], s: rr(0, 1), v, x: a[0], y: a[1], dir: v > 0 ? ang : ang + Math.PI, av: 0, step: 0, wait: 0, state: 'walk', t: 0,
      look: {coat: pick(['#4a2a24', '#2f3d2c', '#3a3a42', '#5a4a36', '#2a3448', '#4b3a2a']), hat: pick(['ushanka', 'platok', 'cap']), hatCol: pick(['#5b4632', '#a83a3a', '#2f4f7a', '#3a3a3a', '#7a6a3a'])}});
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
  master = ac.createGain(); master.gain.value = muted ? 0 : 0.7;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -8; comp.ratio.value = 6; comp.attack.value = .002; comp.release.value = .2;
  master.connect(comp); comp.connect(ac.destination);   // выстрел громкий, но без хрипа
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
  loadSamples();
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
// Шаг: по рыхлому снегу — хруст, по укатанной дороге — глухой «шорх», по мосту — стук доски
// Скрип доски: «крык» — частые щелчки трения (40–90 в секунду), звенящие на резонансе дерева
const creak = run => {
  if (Math.random() < .35) return;               // скрипит не каждая доска
  const t = ac.currentTime + .03, dur = .14 + Math.random() * .12, v = run ? .9 : .7;
  const o = ac.createOscillator(), f1 = ac.createBiquadFilter(), f2 = ac.createBiquadFilter(), g = ac.createGain();
  o.type = 'square';
  const r0 = 40 + Math.random() * 25;
  o.frequency.setValueAtTime(r0, t); o.frequency.linearRampToValueAtTime(r0 * (1.4 + Math.random() * .6), t + dur);
  f1.type = 'bandpass'; f1.frequency.value = 650 + Math.random() * 400; f1.Q.value = 9;
  f2.type = 'bandpass'; f2.frequency.value = 1500 + Math.random() * 500; f2.Q.value = 7;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .015);
  g.gain.setValueAtTime(v, t + dur * .7); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(gameG);
  o.start(t); o.stop(t + dur + .02);
};
// Шаг по снегу: «хрум» — сначала пятка, потом носок; внутри — сотни мелких щелчков ломающихся снежинок
// поверх мягкого шуршания. Заготовлено 8 разных шагов, играются со случайной высотой, чтобы не повторялись
let snowBufs = [];
const makeSnowSteps = () => {
  const sr = ac.sampleRate;
  for (let v = 0; v < 8; v++) {
    const dur = .3 + Math.random() * .12, n = Math.floor(sr * dur), buf = ac.createBuffer(1, n, sr), d = buf.getChannelData(0);
    const heel = .32 + Math.random() * .08;
    let lp1 = 0, lp2 = 0, hp = 0, prevS = 0, thump = 0, peak = 0;
    for (let i = 0; i < n; i++) {
      const tt = i / n;
      // огибающая: пятка вдавливает снег (резкий рост), носок — второй, чуть тише «хрум»
      const e1 = tt < heel ? Math.pow(Math.sin(Math.PI * tt / heel), .6) : 0;
      const e2 = tt > heel * .8 ? .8 * Math.pow(Math.max(0, Math.sin(Math.PI * (tt - heel * .8) / (1 - heel * .8))), .8) : 0;
      const e = Math.max(e1, e2);
      // плотные щелчки сминаемого снега: часто, разной силы
      let s = Math.random() < .55 * e ? (Math.random() * 2 - 1) * Math.pow(Math.random(), .5) : 0;
      lp1 += (s - lp1) * .35; lp2 += (lp1 - lp2) * .35;             // срезать «песочный» верх — хруст становится плотным
      hp = .985 * (hp + lp2 - prevS); prevS = lp2;                  // убрать гул
      if (i < sr * .03) thump += (Math.sin(i / sr * 2 * Math.PI * 90) * (1 - i / (sr * .03)) - thump) * .5;   // мягкий удар ноги
      else thump *= .995;
      d[i] = hp * 1.4 + thump * .35; peak = Math.max(peak, Math.abs(d[i]));
    }
    for (let i = 0; i < n; i++) d[i] *= .9 / peak;
    snowBufs.push(buf);
  }
};
const snowStep = run => {
  if (!snowBufs.length) makeSnowSteps();
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), lp = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = snowBufs[Math.floor(Math.random() * snowBufs.length)];
  s.playbackRate.value = (run ? 1.15 : .95) + Math.random() * .15;
  f.type = 'peaking'; f.frequency.value = 1400; f.gain.value = 5; f.Q.value = .8;
  lp.type = 'lowpass'; lp.frequency.value = 5500;
  g.gain.value = run ? .3 : .22;
  s.connect(f); f.connect(lp); lp.connect(g); g.connect(gameG); s.start();
};
const knock = run => {                          // стук каблука по доске: короткий деревянный тон + щелчок
  const t = ac.currentTime, v = run ? .55 : .42, f0 = 330 + Math.random() * 120;   // доска звучит выше — слышно и на ноутбуке
  const o = ac.createOscillator(), og = ac.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(f0 * 1.3, t); o.frequency.exponentialRampToValueAtTime(f0, t + .02);
  og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(v, t + .003); og.gain.exponentialRampToValueAtTime(.001, t + .13);
  o.connect(og); og.connect(gameG); o.start(t); o.stop(t + .15);
  const s = ac.createBufferSource(), bf = ac.createBiquadFilter(), sg = ac.createGain();
  s.buffer = noiseBuf; bf.type = 'bandpass'; bf.frequency.value = 1700 + Math.random() * 500; bf.Q.value = 2;
  sg.gain.setValueAtTime(0, t); sg.gain.linearRampToValueAtTime(v * .9, t + .002); sg.gain.exponentialRampToValueAtTime(.001, t + .035);
  s.connect(bf); bf.connect(sg); sg.connect(gameG); s.start(t, Math.random()); s.stop(t + .05);
};
// Настоящие записи шагов: декодируются один раз, каждый шаг — случайный кусок (не повторяя предыдущий)
const SAMPLES = {}, lastSeg = {};
const loadSamples = () => {
  const src = window.STEP_SOUNDS; if (!src) return;
  for (const [k, v] of Object.entries(src)) {
    const bin = atob(v.data), arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    ac.decodeAudioData(arr.buffer).then(buf => { SAMPLES[k] = {buf, seg: v.seg}; }).catch(() => {});
  }
};
const playSample = (k, vol, out = gameG) => {
  const s0 = SAMPLES[k]; if (!s0) return false;
  let i; do i = Math.floor(Math.random() * s0.seg.length); while (s0.seg.length > 1 && i === lastSeg[k]);
  lastSeg[k] = i;
  const [st, du] = s0.seg[i], s = ac.createBufferSource(), g = ac.createGain();
  s.buffer = s0.buf; s.playbackRate.value = .94 + Math.random() * .12;
  g.gain.value = vol;
  s.connect(g); g.connect(out); s.start(0, Math.max(0, st - .01), du + .02);
  return true;
};
const footstep = (run, surf) => {
  if (!ac) return;
  const t = ac.currentTime, v = run ? .09 : .055;
  if (surf === 'wood') { if (playSample('bridge', run ? .55 : .5)) return; creak(run); return knock(run); }
  if (surf === 'snow') { if (playSample(run ? 'run' : 'walk', run ? .5 : .45)) return; return snowStep(run); }
  // дорога — прежний короткий хруст; мост — глухой стук под скрипом
  const bursts = surf === 'wood' ? [[0, 260, 2, 'lowpass', 3, .07]]
    : [[0, 2600, 1.2, 'bandpass', 5, .045], [.018, 3400, 1.5, 'bandpass', 5, .045], [.04, 2200, 1.2, 'bandpass', 5, .045]];
  for (const [d, f, q, type, k, len] of bursts) {
    const s = ac.createBufferSource(), bf = ac.createBiquadFilter(), g = ac.createGain(), s0 = t + d;
    s.buffer = noiseBuf; bf.type = type; bf.frequency.value = f * (.85 + Math.random() * .3); bf.Q.value = q;
    g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(v * k, s0 + .004); g.gain.exponentialRampToValueAtTime(.001, s0 + len);
    s.connect(bf); bf.connect(g); g.connect(gameG); s.start(s0, Math.random()); s.stop(s0 + len + .02);
  }
};
const hey = (x = p.x) => {                            // взрослый заметил: короткий оклик «Эй!» — голосовой тон через форманты
  if (!ac) return;
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), out = panTo(x);
  o.type = 'sawtooth'; o.frequency.setValueAtTime(170, t); o.frequency.linearRampToValueAtTime(230, t + .08); o.frequency.exponentialRampToValueAtTime(150, t + .32);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.22, t + .03); g.gain.setValueAtTime(.22, t + .18); g.gain.exponentialRampToValueAtTime(.001, t + .38);
  o.connect(g);
  for (const [f, q, v] of [[600, 6, 1], [1800, 8, .5], [2600, 10, .25]]) {     // гласная «э»
    const bf = ac.createBiquadFilter(), fg = ac.createGain(); bf.type = 'bandpass'; bf.frequency.value = f; bf.Q.value = q; fg.gain.value = v;
    g.connect(bf); bf.connect(fg); fg.connect(out);
  }
  o.start(t); o.stop(t + .4);
};
let motoSrc = null, motoGain = null, motoPan = null;
const motoSound = () => {                          // мотор: петля из записи; громкость и панорама по расстоянию, обороты по скорости
  if (!ac || !SAMPLES.moto) return;
  if (!motoSrc) {
    motoSrc = ac.createBufferSource(); motoSrc.buffer = SAMPLES.moto.buf; motoSrc.loop = true;
    motoSrc.loopStart = .05; motoSrc.loopEnd = SAMPLES.moto.buf.duration - .05;
    motoGain = ac.createGain(); motoGain.gain.value = 0;
    motoPan = ac.createStereoPanner ? ac.createStereoPanner() : null;
    motoSrc.connect(motoGain); if (motoPan) { motoGain.connect(motoPan); motoPan.connect(gameG); } else motoGain.connect(gameG);
    motoSrc.start();
  }
  const d = dist(moto.x, moto.y, p.x, p.y), vol = moto.on && (state === 'play' || state === 'dead') ? Math.max(0, 1 - d / 900) ** 1.6 * .9 : 0;
  const now = ac.currentTime;
  motoGain.gain.setTargetAtTime(vol, now, .15);
  if (motoPan) motoPan.pan.setTargetAtTime(Math.max(-1, Math.min(1, (moto.x - p.x) / 400)), now, .1);
  motoSrc.playbackRate.setTargetAtTime(.8 + .35 * Math.min(1, moto.spd / 210), now, .3);
};
const cock = (x = p.x) => {                           // охотник заметил: металлический щелчок затвора
  if (!ac) return;
  const t = ac.currentTime;
  for (const d of [0, .09]) {
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = 3200; f.Q.value = 6;
    g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(.3, t + d + .003); g.gain.exponentialRampToValueAtTime(.001, t + d + .04);
    s.connect(f); f.connect(g); g.connect(panTo(x)); s.start(t + d, Math.random()); s.stop(t + d + .05);
  }
};
const gunshot = (x = p.x) => {                         // выстрел из ружья — настоящая запись; поверх — далёкое эхо по лесу
  if (!ac) return;
  const t = ac.currentTime;
  const burst = (d, type, f, q, vol, att, len) => {
    const s = ac.createBufferSource(), bf = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; bf.type = type; bf.frequency.value = f; bf.Q.value = q;
    g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(vol, t + d + att); g.gain.exponentialRampToValueAtTime(.001, t + d + len);
    s.connect(bf); bf.connect(g); g.connect(gameG); s.start(t + d, Math.random()); s.stop(t + d + len + .05);
  };
  if (playSample('shot', 1, panTo(x))) { burst(.45, 'bandpass', 700, .8, .12, .04, 1); return; }
  burst(0, 'highpass', 1500, .7, .9, .001, .05);
  burst(0, 'lowpass', 2500, .7, .8, .002, .3);
  burst(.02, 'lowpass', 700, .7, .55, .02, 1.4);
  burst(.32, 'bandpass', 900, .8, .35, .03, .8);
  const o = ac.createOscillator(), og = ac.createGain();
  o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(38, t + .3);
  og.gain.setValueAtTime(.5, t); og.gain.exponentialRampToValueAtTime(.001, t + .4);
  o.connect(og); og.connect(gameG); o.start(t); o.stop(t + .42);
};
const click = () => {
  if (!ac) return;
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
  o.type = 'square'; o.frequency.value = 1800;
  g.gain.setValueAtTime(.08, t); g.gain.exponentialRampToValueAtTime(.001, t + .03);
  o.connect(g); g.connect(gameG); o.start(t); o.stop(t + .04);
};
const glassBreak = () => {                      // разбитое стекло: запись; если не загрузилась — синтез ниже
  if (!ac) return;
  if (playSample('glass', .9)) return;
  const t = ac.currentTime;
  const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 2500;
  g.gain.setValueAtTime(.9, t); g.gain.exponentialRampToValueAtTime(.001, t + .35);
  s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + .4);
  for (let i = 0; i < 26; i++) {
    const d = .02 + Math.random() * .9, o = ac.createOscillator(), og = ac.createGain();
    o.type = 'sine'; o.frequency.value = 2500 + Math.random() * 4500;
    og.gain.setValueAtTime(0, t + d); og.gain.linearRampToValueAtTime(.06 + Math.random() * .08, t + d + .002); og.gain.exponentialRampToValueAtTime(.001, t + d + .08 + Math.random() * .15);
    o.connect(og); og.connect(master); o.start(t + d); o.stop(t + d + .3);
  }
};
// --- звуки заставок: треск дров, ходики, ветер
const crackle = (v = .18) => {                  // щелчок полена в печи: короткий шумовой импульс
  if (!ac) return;
  const t = ac.currentTime, n = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const d = t + i * (.015 + Math.random() * .03), s = ac.createBufferSource(), bf = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; bf.type = 'bandpass'; bf.frequency.value = 1800 + Math.random() * 2500; bf.Q.value = 1.5;
    const a = v * (.4 + Math.random() * .6);
    g.gain.setValueAtTime(0, d); g.gain.linearRampToValueAtTime(a, d + .002); g.gain.exponentialRampToValueAtTime(.001, d + .03 + Math.random() * .04);
    s.connect(bf); bf.connect(g); g.connect(gameG); s.start(d, Math.random()); s.stop(d + .1);
  }
};
const fireBed = (dur, v = .05) => {             // ровный гул огня под щелчками
  if (!ac) return;
  const t = ac.currentTime, s = ac.createBufferSource(), lp = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noiseBuf; s.loop = true; lp.type = 'lowpass'; lp.frequency.value = 500;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .8); g.gain.setValueAtTime(v, t + dur - .8); g.gain.linearRampToValueAtTime(0, t + dur);
  s.connect(lp); lp.connect(g); g.connect(gameG); s.start(t, Math.random()); s.stop(t + dur + .1);
};
const tick = hi => {                            // ходики: тик-так
  if (!ac) return;
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), bf = ac.createBiquadFilter();
  o.type = 'square'; o.frequency.value = hi ? 2300 : 1900; bf.type = 'bandpass'; bf.frequency.value = hi ? 2600 : 2100; bf.Q.value = 6;
  g.gain.setValueAtTime(.09, t); g.gain.exponentialRampToValueAtTime(.001, t + .025);
  o.connect(bf); bf.connect(g); g.connect(gameG); o.start(t); o.stop(t + .03);
};
const wind = (dur, v = .1) => {                 // ветер на улице: шум с плавающим фильтром
  if (!ac) return;
  const t = ac.currentTime, s = ac.createBufferSource(), bf = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noiseBuf; s.loop = true; bf.type = 'bandpass'; bf.Q.value = 1.2;
  bf.frequency.setValueAtTime(350, t); bf.frequency.linearRampToValueAtTime(700, t + dur * .4); bf.frequency.linearRampToValueAtTime(420, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 1.2); g.gain.linearRampToValueAtTime(v * .6, t + dur * .6); g.gain.linearRampToValueAtTime(0, t + dur);
  s.connect(bf); bf.connect(g); g.connect(gameG); s.start(t, Math.random()); s.stop(t + dur + .1);
};
const every = (from, to, step, fn, jitter = 0) => {   // расписание повторяющихся звуков для кадра
  const out = []; for (let x = from; x < to; x += step) out.push([x + Math.random() * jitter, fn]); return out;
};
const doorCreak = () => {                       // скрип двери: долгий, с плавающей высотой
  if (!ac) return;
  const t = ac.currentTime + .2, o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(28, t); o.frequency.linearRampToValueAtTime(55, t + .8); o.frequency.linearRampToValueAtTime(38, t + 1.6);
  f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 8;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + .15); g.gain.setValueAtTime(.5, t + 1.3); g.gain.linearRampToValueAtTime(0, t + 1.7);
  o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + 1.8);
};
const sip = () => {                            // горячий чай: глоток и тёплый аккорд
  if (!ac) return;
  const t = ac.currentTime;
  [[392, 0], [493.88, .08], [587.33, .16]].forEach(([f, d]) => {
    const o = ac.createOscillator(), g = ac.createGain(), s0 = t + d;
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0, s0); g.gain.linearRampToValueAtTime(.07, s0 + .05); g.gain.exponentialRampToValueAtTime(.001, s0 + 1.2);
    o.connect(g); g.connect(gameG); o.start(s0); o.stop(s0 + 1.3);
  });
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
const panTo = x => {                           // звук слева/справа от мальчика
  if (!ac.createStereoPanner) return gameG;
  const pn = ac.createStereoPanner(); pn.pan.value = Math.max(-1, Math.min(1, (x - p.x) / 320)); pn.connect(gameG); return pn;
};
const bark = (vol, pitch = 1, x = p.x) => {
  if (!ac || vol <= 0.02 || ac.currentTime < barkBusy) return;
  const n = Math.random() < .5 ? 2 : 3;
  barkBusy = ac.currentTime + .32 * n + .3;
  const out = panTo(x);
  for (let k = 0; k < n; k++) barkTo(ac, out, noiseBuf, ac.currentTime + k * (.26 + Math.random() * .08), vol, pitch * (1 + (Math.random() - .5) * .1));
};
const howl = (vol, x = p.x + (Math.random() - .5) * 900) => {
  if (!ac || ac.currentTime < howlBusy) return;
  howlBusy = ac.currentTime + 4;
  const t = ac.currentTime, o = ac.createOscillator(), v = ac.createOscillator(), vg = ac.createGain(), g = ac.createGain();
  o.frequency.setValueAtTime(320, t); o.frequency.linearRampToValueAtTime(520, t + .8);
  o.frequency.linearRampToValueAtTime(470, t + 2); o.frequency.linearRampToValueAtTime(290, t + 2.8);
  v.frequency.value = 5; vg.gain.value = 7; v.connect(vg); vg.connect(o.frequency);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09 * vol, t + .6); g.gain.linearRampToValueAtTime(0, t + 2.9);
  o.connect(g); g.connect(panTo(x)); o.start(t); v.start(t); o.stop(t + 3); v.stop(t + 3);
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
  if (e.code === 'Escape') { if (state === 'cine') { cineSkip(); return; } if (state === 'menu') { if (pausedFrom) resumeGame(); } else if (state !== 'won') openMenu(true); }
  if (e.code === 'KeyM') setMute(!muted);
  if (e.code === 'KeyF' && state === 'play') toggleLamp();
  if (e.code === 'KeyH' && state === 'play') useSense();
  if (state === 'cine' && (e.code === 'Space' || e.code === 'Enter')) cineNext();
  if (KEYMAP[e.code]) { keys[KEYMAP[e.code]] = true; e.preventDefault(); }
});
addEventListener('keyup', e => { if (KEYMAP[e.code]) keys[KEYMAP[e.code]] = false; });
// окно потеряло фокус — отпускаем клавиши (иначе персонаж «залипает» и идёт сам)
addEventListener('blur', () => { for (const k in keys) keys[k] = false; touch = null; });
// вкладку свернули посреди игры — ставим на паузу, чтобы не замёрзнуть и не тратить время
document.addEventListener('visibilitychange', () => { if (document.hidden && (state === 'play' || state === 'dead')) openMenu(true); });
let touch = null;
cv.addEventListener('pointerdown', e => { wake(); if (e.pointerType !== 'touch') touch = {x: e.clientX, y: e.clientY}; });   // на телефоне — стик
cv.addEventListener('pointermove', e => { if (touch) touch = {x: e.clientX, y: e.clientY}; });
addEventListener('pointerup', () => touch = null);

// Экранный стик и кнопки для телефона
const joyEl = document.getElementById('joy'), knob = document.getElementById('knob'), runBtn = document.getElementById('runBtn'), pauseBtn = document.getElementById('pauseBtn');
let joy = null, joyId = null;
const markTouch = () => document.body.classList.add('touch');
if (matchMedia('(pointer: coarse)').matches) markTouch();
addEventListener('pointerdown', e => { if (e.pointerType === 'touch') markTouch(); }, true);
const joyMove = e => {
  const r = joyEl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width * .38;
  let vx = e.clientX - cx, vy = e.clientY - cy; const l = Math.hypot(vx, vy);
  if (l > R) { vx *= R / l; vy *= R / l; }
  knob.style.transform = `translate(${vx}px, ${vy}px)`;
  joy = {x: vx / R, y: vy / R};
};
const joyEnd = e => { if (e.pointerId !== joyId) return; joyId = null; joy = null; knob.style.transform = ''; };
joyEl.addEventListener('pointerdown', e => { wake(); joyId = e.pointerId; joyEl.setPointerCapture(e.pointerId); joyMove(e); e.preventDefault(); });
joyEl.addEventListener('pointermove', e => { if (e.pointerId === joyId) joyMove(e); });
joyEl.addEventListener('pointerup', joyEnd); joyEl.addEventListener('pointercancel', joyEnd);
const runSet = on => e => { keys.run = on; runBtn.classList.toggle('on', on); if (on) { wake(); runBtn.setPointerCapture(e.pointerId); } e.preventDefault(); };
runBtn.addEventListener('pointerdown', runSet(true)); runBtn.addEventListener('pointerup', runSet(false)); runBtn.addEventListener('pointercancel', runSet(false));
pauseBtn.addEventListener('click', () => { if (state === 'play' || state === 'dead') openMenu(true); });
const lampBtn = document.getElementById('lampBtn'), senseBtn = document.getElementById('senseBtn');
// срабатывают сразу при касании (как «Бег»), поэтому работают вторым пальцем, пока держишь бег
const tapBtn = (el, fn) => el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); wake(); if (state === 'play') fn(); });
tapBtn(lampBtn, () => toggleLamp()); tapBtn(senseBtn, () => useSense());
// Фонарик: выключил — тебя хуже видно, но и сам почти ничего не видишь и мёрзнешь быстрее
const toggleLamp = () => { p.lamp = !p.lamp; lampBtn.classList.toggle('on', !p.lamp); click(); say(t(p.lamp ? 'lampOn' : 'lampOff'), 1.2); };
// Чутьё: на пару секунд видно, куда идти; стоит тепла и перезаряжается
const useSense = () => {
  if (senseCd > 0) { say(t('senseWait'), 1); return; }
  senseCd = 8; senseT = 2; p.warm = Math.max(1, p.warm - 8); click(); senseUsed = true;
  senseTo = senseTarget(); say(t(senseTo.item ? 'senseItem' : 'senseRoad'), 1.6);
};
let senseTo = null;
// Чутьё ведёт к ближайшему ненайденному секрету; когда все найдены — к дороге, а по дороге — вперёд, к дому
const senseTarget = () => {
  const left = items.filter(i => !i.found);
  if (left.length) {
    const it = left.reduce((a, b) => dist(a.x, a.y, p.x, p.y) < dist(b.x, b.y, p.x, p.y) ? a : b);
    return {x: it.x, y: it.y, item: true};
  }
  let best = null, bd = Infinity, bi = 0, onMain = false;
  for (const line of ALLROADS) line.forEach((q, i) => { const d = dist(q[0], q[1], p.x, p.y); if (d < bd) { bd = d; best = q; bi = i; onMain = line === ROAD; } });
  if (bd > 45) return {x: best[0], y: best[1]};                       // сначала выйти на дорогу
  if (onMain && bi < ROAD.length - 6) {                              // по дороге — на точку метрах в двухстах впереди
    let j = bi; while (j < ROAD.length - 1 && dist(ROAD[j][0], ROAD[j][1], p.x, p.y) < 200) j++;
    return {x: ROAD[j][0], y: ROAD[j][1]};
  }
  return goalPoint();
};
let senseCd = 0, senseT = 0;
const goalPoint = () => {
  const r = rivers.find(r => !r.crossed);
  return r ? {x: r.cx - r.ux * (r.len / 2 + 20), y: r.cy - r.uy * (r.len / 2 + 20)} : {x: home.x + home.w / 2, y: home.y + home.h + 40};
};

const flakes = Array.from({length: 220}, () => ({x: rnd() * 2000, y: rnd() * 2000, s: .5 + rnd() * 1.5}));

let msgTimer = 0;
const say = (text, sec) => { msg.innerHTML = text; msg.style.opacity = 1; msgTimer = sec; };

const DIFFS = {
  easy:   {thermos: 5, hunters: 2, hunt: 250, aim: 1.3, cold: .7,  light: 210, sp: .85, det: .8,  cone: 180, dogs: 10, wolvesForest: 6,  wolvesFlood: 2, people: 4},
  normal: {thermos: 3, hunters: 3, hunt: 300, aim: 1,   cold: 1,   light: 180, sp: 1,   det: 1,   cone: 210, dogs: 14, wolvesForest: 8,  wolvesFlood: 3, people: 6},
  hard:   {thermos: 1, hunters: 5, hunt: 350, aim: .75, cold: 1.4, light: 150, sp: 1.1, det: 1.25, cone: 240, dogs: 18, wolvesForest: 11, wolvesFlood: 4, people: 8},
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
  for (const h of hunters) { h.state = 'cool'; h.t = 2; }
  resetMoto();
  for (const m of people) {                      // кто смотрел на точку возврата — отворачивается
    const a = Math.atan2(p.y - m.y, p.x - m.x);
    let da = a - m.dir; da = Math.atan2(Math.sin(da), Math.cos(da));
    if (Math.abs(da) < 1.2) { m.v *= -1; m.dir += Math.PI; m.av = 0; }
    m.state = 'walk';
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

// Подсказки: каждая показывается один раз (запоминается в браузере), по одной, когда впервые встречаешь что-то новое
const tipEl = document.getElementById('tip');
let tipQ = [], tipT = 0, playT = 0, senseUsed = false;
const tipSeen = () => { try { return JSON.parse(localStorage.getItem('tma_tips') || '[]'); } catch (e) { return []; } };
const tip = key => {
  const seen = tipSeen(); if (seen.includes(key) || tipQ.includes(key)) return;
  tipQ.push(key);
};
const tipKey = k => document.body.classList.contains('touch') ? '' : ` (${k})`;   // на телефоне кнопки и так подписаны
const tipTick = dt => {
  if (tipT > 0) { if ((tipT -= dt) <= 0) tipEl.classList.remove('on'); return; }
  if (tipT > -1.2) { tipT -= dt; return; }                            // пауза между подсказками
  const k = tipQ.shift(); if (!k) return;
  tipEl.innerHTML = `<b>${t('tipLabel')}</b>${t(k).replace('{F}', tipKey('F')).replace('{H}', tipKey('H'))}`;
  if (document.body.classList.contains('touch')) { const tb = taskEl.getBoundingClientRect(); tipEl.style.top = Math.round(Math.max(tb.bottom, 80) + 10) + 'px'; }   // на телефоне — под заданием
  tipEl.classList.add('on'); tipT = 4.5;
  try { localStorage.setItem('tma_tips', JSON.stringify([...tipSeen(), k])); } catch (e) {}
};
const tipsCheck = () => {
  if (dogs.some(d => d.state === 'chase' && dist(d.x, d.y, p.x, p.y) < 320)) tip('tipDog');
  if (wolves.some(w => dist(w.x, w.y, p.x, p.y) < 330)) tip('tipWolf');
  if (people.some(m => dist(m.x, m.y, p.x, p.y) < 360)) tip('tipAdult');
  if (hunters.some(h => dist(h.x, h.y, p.x, p.y) < D.hunt + 80)) tip('tipHunter');
  if (p.warm < 55) tip('tipCold');
  if (items.some(i => i.found)) tip('tipSecret');
  if (moto.on && dist(moto.x, moto.y, p.x, p.y) < 900) tip('tipMoto');
  if (playT > 45 && !senseUsed) tip('tipLost');
};
const update = (dt, now) => {
  if (state !== 'play') danger = false;
  if (state === 'dead') { if ((deadT -= dt) <= 0) respawn(); return; }
  if (state !== 'play') return;
  p.grace = Math.max(0, p.grace - dt);
  playT += dt; tipsCheck(); tipTick(dt);

  // --- игрок
  let dx = (keys.d ? 1 : 0) - (keys.a ? 1 : 0), dy = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
  if (touch) { dx = touch.x - W / 2; dy = touch.y - H / 2; }
  if (joy && Math.hypot(joy.x, joy.y) > .18) { dx = joy.x; dy = joy.y; }
  let len = Math.hypot(dx, dy), moving = touch ? len > 8 : len > (joy ? .18 : 0);
  senseCd = Math.max(0, senseCd - dt); senseT = Math.max(0, senseT - dt);   // клавиши дают длину 1, мышь — пиксели до курсора
  p.run = moving && keys.run;
  const sp = p.run ? 160 : 90;
  if (moving) {
    const nx = p.x + dx / len * sp * dt, ny = p.y + dy / len * sp * dt;
    p.dir = Math.atan2(dy, dx); p.step += dt * (p.run ? 15 : 9);
    if (!pBlocked(nx, p.y)) p.x = nx;
    if (!pBlocked(p.x, ny)) p.y = ny;
    const st = Math.floor(p.step / Math.PI);         // шаг — хруст снега (на мосту — стук досок)
    if (st !== p.lastStep) {
      p.lastStep = st; const rb0 = inRiver(p.x, p.y);
      if (!onDeck(p.x, p.y)) {                       // след на снегу, левый-правый по очереди
        const side = st % 2 ? 1 : -1;
        prints.push({x: p.x - Math.sin(p.dir) * 4 * side, y: p.y + Math.cos(p.dir) * 4 * side, dir: p.dir, t: now, road: roadDist(p.x, p.y) < 21});
        if (prints.length > 180) prints.shift();
      }
      footstep(p.run, onDeck(p.x, p.y) ? 'wood' : roadDist(p.x, p.y) < 21 ? 'road' : 'snow');
    }
  }
  { const rw = inRiver(p.x, p.y, -8); if (rw && !onDeck(p.x, p.y)) return die('drowned'); }   // у самого берега мелко — тонешь, только зайдя в воду
  for (const th of thermos) if (!th.taken && dist(p.x, p.y, th.x, th.y) < 24) {
    th.taken = true; p.warm = 100; sip(); say(t('tea'), 2);
  }
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
  p.warm = Math.max(0, Math.min(100, p.warm + (nearWindow ? 18 : (windy ? -4 : -1) * D.cold * (p.lamp ? 1 : 1.25)) * dt));
  if (p.warm <= 0) return die('froze');

  danger = false;
  const safe = p.grace > 0;
  // --- собаки
  const hear = (p.run ? 260 : 130) * D.det;
  for (const d of dogs) {
    const dp = dist(d.x, d.y, p.x, p.y);
    d.show = Math.max(0, d.show - dt);
    if (d.state !== 'shy' && d.state !== 'back' && dp < 320 && beamInside(d.x, d.y)) {   // попала под луч — пугается и пятится
      if (d.state === 'chase') bark(Math.max(.15, .7 - dp / 600), 1.7, d.x);           // взвизгнула
      d.state = 'shy'; d.shy = 1.8;
    }
    if (d.state === 'shy') {
      const k = 1 / Math.max(1, dp);
      moveTo(d, d.x + (d.x - p.x) * k * 60, d.y + (d.y - p.y) * k * 60, 95 * D.sp, dt);
      if (beamInside(d.x, d.y)) d.shy = Math.max(d.shy, .6);
      if ((d.shy -= dt) <= 0) { d.state = 'back'; d.lose = 0; }
      continue;
    }
    if (d.state === 'idle' && dp < hear && !safe) { d.state = 'chase'; bark(Math.max(.2, 1 - dp / 400), 1, d.x); }
    if (d.state === 'chase') {
      if (dp < 300) danger = true;
      const stuck = moveTo(d, p.x, p.y, 125 * D.sp, dt);
      if ((d.bark -= dt) <= 0) { d.bark = .9; d.show = .6; bark(Math.max(0, 1 - dp / 600), 1, d.x); }
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
      if (d.state === 'idle') { bark(Math.max(.08, .45 - dd / 2000), .9 + Math.random() * .3, d.x); if (dd < 700) d.show = .6; }
    }
  }

  // --- волки
  for (const w of wolves) {
    const dp = dist(w.x, w.y, p.x, p.y);
    if (w.state !== 'shy' && dp < 320 && beamInside(w.x, w.y)) {   // волк под лучом — пятится от света
      if (w.state === 'chase') howl(.35, w.x);
      w.state = 'shy'; w.shy = 2;
    }
    if (w.state === 'shy') {
      const k = 1 / Math.max(1, dp);
      moveTo(w, w.x + (w.x - p.x) * k * 60, w.y + (w.y - p.y) * k * 60, 100 * D.sp, dt);
      if (beamInside(w.x, w.y)) w.shy = Math.max(w.shy, .7);
      if ((w.shy -= dt) <= 0) { w.state = 'wander'; w.pause = 1.5; w.tx = w.x; w.ty = w.y; w.lose = 0; }
      continue;
    }
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
      if (dp < (p.run ? 220 : 150) * D.det * (p.lamp ? 1 : .8) && !safe) { w.state = 'chase'; howl(.8, w.x); }
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
  // взрослый с фонарём: заметил — останавливается, кричит «Эй!» и всматривается; не ушёл из луча вовремя — поймали
  for (const m of people) {
    const ax = p.x - m.x, ay = p.y - m.y, dm = Math.hypot(ax, ay);
    let da = Math.atan2(ay, ax) - m.dir; da = Math.atan2(Math.sin(da), Math.cos(da));
    const see = p.lamp ? 1 : .6;                             // без фонаря замечают только вблизи
    const sees = (range, half) => !safe && dm < range * see && Math.abs(da) < half && losClear(m.x, m.y, p.x, p.y);
    if (m.state === 'alert') {
      danger = true;
      m.dir += Math.max(-1.8 * dt, Math.min(1.8 * dt, da)); m.av = 0;   // ведёт фонарём за мальчиком
      if (!sees(D.cone * 1.15, .5)) { m.state = 'cool'; m.t = 1.5; }
      else if ((m.t -= dt) <= 0) return die('seen');
      continue;
    }
    if (m.state === 'cool' && (m.t -= dt) <= 0) m.state = 'walk';
    const ang = Math.atan2(m.by - m.ay, m.bx - m.ax), segL = dist(m.ax, m.ay, m.bx, m.by);
    const want = (m.v > 0 ? ang : ang + Math.PI) + Math.sin(now / 1100 + m.ax) * .3;
    let turn = want - m.dir; turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    m.av += (turn * 5 - m.av * 4) * dt;
    m.dir += m.av * dt;
    if (m.wait > 0 || m.state === 'cool') m.wait = Math.max(0, m.wait - dt);
    else if (Math.abs(turn) < .5) {
      m.s += m.v * 40 * dt / segL; m.step += dt * 8;
      if (m.s < 0 || m.s > 1) { m.s = Math.max(0, Math.min(1, m.s)); m.v *= -1; m.wait = 1.2; }
    }
    m.x = m.ax + (m.bx - m.ax) * m.s; m.y = m.ay + (m.by - m.ay) * m.s;
    if (dm < 18 && !safe) return die('seen');                    // столкнулся вплотную
    if (dm < 290 * see && Math.abs(da) < .6 && dm < 300 && losClear(m.x, m.y, p.x, p.y)) danger = true;
    if (m.state !== 'cool' && sees(D.cone, .38)) { m.state = 'alert'; m.t = D.aim + .2; hey(m.x); }
  }

  // --- охотники
  for (const h of hunters) {
    h.flash = Math.max(0, h.flash - dt);
    const ax = p.x - h.x, ay = p.y - h.y, dh = Math.hypot(ax, ay);
    let da = Math.atan2(ay, ax) - h.dir; da = Math.atan2(Math.sin(da), Math.cos(da));
    const sees = (range, half) => !safe && dh < range * (p.lamp ? 1 : .6) && Math.abs(da) < half && losClear(h.x, h.y, p.x, p.y);
    if (h.state === 'scan') {
      const want = h.base + Math.sin(now / 1700 + h.ph) * 1.1;   // медленно водит лучом из стороны в сторону
      let tr = want - h.dir; tr = Math.atan2(Math.sin(tr), Math.cos(tr)); h.dir += tr * Math.min(1, dt * 2);
      if (dh < D.hunt * 1.2 && Math.abs(da) < .6 && losClear(h.x, h.y, p.x, p.y)) danger = true;
      if (sees(D.hunt, .3)) { h.state = 'aim'; h.t = D.aim; cock(h.x); }
    } else if (h.state === 'aim') {
      danger = true;
      h.dir += Math.max(-2.2 * dt, Math.min(2.2 * dt, da));      // ведёт стволом за игроком
      if (!sees(D.hunt * 1.15, .5)) { h.state = 'cool'; h.t = 1.5; }
      else if ((h.t -= dt) <= 0) { h.state = 'cool'; h.t = 2; h.flash = .12; gunshot(h.x); if (sees(D.hunt * 1.15, .45)) return die('shot'); }
    } else if ((h.t -= dt) <= 0) h.state = 'scan';
  }

  // --- дядя на мотоцикле с коляской: катается по дороге перед третьим мостом, фара бьёт далеко вперёд
  moto.on = rivers[1].crossed && !rivers[2].crossed;
  if (moto.on) {
    const ax = p.x - moto.x, ay = p.y - moto.y, dmo = Math.hypot(ax, ay);
    let da = Math.atan2(ay, ax) - moto.face; da = Math.atan2(Math.sin(da), Math.cos(da));
    const see = p.lamp ? 1 : .7, R = 330 * D.det;
    const lit = (range, half) => !safe && dmo < range * see && Math.abs(da) < half && losClear(moto.x, moto.y, p.x, p.y);
    if (dmo < 26 && !safe) return die('uncle');
    if (moto.state === 'alert') {
      danger = true; moto.spd = Math.max(0, moto.spd - 400 * dt);
      moto.face += Math.max(-1.5 * dt, Math.min(1.5 * dt, da));                 // поворачивает руль на мальчика
      if (!lit(R * 1.15, .45)) { moto.state = 'ride'; moto.pause = 1.2; }
      else if ((moto.t -= dt) <= 0) return die('uncle');
    } else {
      if (moto.pause > 0) { moto.pause -= dt; moto.spd = 0; }
      else {
        moto.spd = Math.min(210 * D.sp, moto.spd + 160 * dt);
        moto.u += moto.dir * moto.spd * dt;
        if (moto.u <= 0 || moto.u >= MOTO.len) { moto.u = Math.max(0, Math.min(MOTO.len, moto.u)); moto.dir *= -1; moto.pause = 1.6; }
      }
      const q = motoAt(moto.u), want = q.ang + (moto.dir > 0 ? 0 : Math.PI);
      let tr = want - moto.face; tr = Math.atan2(Math.sin(tr), Math.cos(tr)); moto.face += tr * Math.min(1, dt * (moto.pause > 0 ? 1.5 : 5));
      moto.x = q.x; moto.y = q.y;
      if (dmo < R * 1.3 && Math.abs(da) < .6) danger = true;
      if (lit(R, .3)) { moto.state = 'alert'; moto.t = D.aim * .9; hey(moto.x); }
    }
  }
  motoSound(dt);

  // --- финиш (после него — финальная сценка)
  const nearHome = p.x > home.x - 35 && p.x < home.x + home.w + 35 && p.y > home.y - 35 && p.y < home.y + home.h + 85;   // включая крыльцо со стороны улицы
  if (nearHome && rivers.every(r => r.crossed)) {
    winMs = Math.round(now - t0); winRec = saveScore(winMs);
    startCine(items.every(i => i.found) ? 'outro5' : 'outro');
  }
};

// ================= РИСОВАНИЕ =================
let camX = 0, camY = 0, windR = 180, beamL = 0, darkC = null, beamC = null;
const BEAM_W = .5;                                  // полуширина луча к его длине (≈ 27°)
const beamLen = () => D.light * (windy ? 1.6 : 1.9);
const beamInside = (x, y) => {                    // точка в луче фонаря мальчика и не за домом
  if (!p.lamp || beamL < 20) return false;
  const dx = x - p.x, dy = y - p.y, d = Math.hypot(dx, dy);
  let a = Math.atan2(dy, dx) - p.dir; a = Math.atan2(Math.sin(a), Math.cos(a));
  return d < beamL * .95 && Math.abs(a) < .42 && losClear(p.x, p.y, x, y);
};
const beamSprite = () => {                         // мягкий клин света, смотрит вправо, рисуется один раз
  if (beamC) return beamC;
  const L = 256, Hh = L * BEAM_W; beamC = document.createElement('canvas'); beamC.width = L; beamC.height = Hh * 2;
  const x = beamC.getContext('2d');
  for (let k = 0; k < 14; k++) {
    const half = .1 + k * .025, gr = x.createRadialGradient(0, Hh, 0, 0, Hh, L);
    gr.addColorStop(0, 'rgba(255,255,255,.2)'); gr.addColorStop(.6, 'rgba(255,255,255,.16)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.beginPath(); x.moveTo(0, Hh); x.arc(0, Hh, L, -half, half); x.closePath(); x.fill();
  }
  return beamC;
};
let lastHud = '', lastTask = '', irisR = 0, winMs = 0, winRec = false;
// ================= ЗАСТАВКИ: кадры-картинки с подписью; клик/пробел — дальше, Esc — пропустить =================
const cineEl = document.getElementById('cine'), cineText = document.getElementById('cineText');
let cine = null;
const BREAK_AT = .25;                             // момент удара по стеклу в кадре побега
// Кадры-картинки: медленный наезд и сдвиг камеры + живые детали поверх (огонь, свет, снег, пар). Координаты — в пикселях исходника 1664×928
const CIMG = {};
for (const [k, b64] of Object.entries(window.CINE_IMAGES || {})) { const im = new Image(); im.src = 'data:image/webp;base64,' + b64; CIMG[k] = im; }
const imgScene = (key, o) => (now, t) => {
  const im = CIMG[key];
  ctx.fillStyle = '#05070c'; ctx.fillRect(0, 0, W, H);
  if (!im || !im.complete || !im.naturalWidth) return;
  const iw = im.naturalWidth, ih = im.naturalHeight, k0 = iw / 1664, portrait = W / H < 1.25;
  const shake = o.shake ? o.shake(t) : 0;
  const z = 1.06 + t * (o.zoom ?? .012), pan = o.pan || [0, 0];
  const cxI = iw / 2 + pan[0] * k0 * t, cyI = ih / 2 + pan[1] * k0 * t;     // куда смотрит камера (в пикселях картинки)
  if (portrait) {                                                         // телефон вертикально: вся картинка целиком, за ней — размытая копия
    const sb = Math.max(W / iw, H / ih) * 1.1;
    ctx.globalAlpha = .35; ctx.drawImage(im, W / 2 - iw * sb / 2, H / 2 - ih * sb / 2, iw * sb, ih * sb); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(3,5,10,.55)'; ctx.fillRect(0, 0, W, H);
  }
  const sc = (portrait ? Math.min(W / iw, H / ih) : Math.max(W / iw, H / ih)) * z;
  const ox = W / 2 - cxI * sc + shake, oy = H / 2 - cyI * sc;
  ctx.save();
  if (portrait) { ctx.beginPath(); ctx.rect(ox, oy, iw * sc, ih * sc); ctx.clip(); }
  ctx.drawImage(im, ox, oy, iw * sc, ih * sc);
  const P = (x, y) => [ox + x * k0 * sc, oy + y * k0 * sc], u = k0 * sc;   // точка исходника → экран; u — масштаб размеров
  if (o.fx) o.fx(P, u, now, t);
  if (o.snow) snowFront(now, t, S());
  ctx.restore();
  vignette(.45);
  if (o.post) o.post(t);
};
const flick = now => .75 + .25 * Math.sin(now / 90) * Math.sin(now / 37);
const steam = (P, u, now, x, y) => {                                     // пар над кружкой
  ctx.strokeStyle = 'rgba(255,250,240,.45)'; ctx.lineWidth = 2.2 * u; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const [sx, sy] = P(x + (i - 1) * 7, y), ph = now / 600 + i * 2.1, h = (40 + i * 6) * u;
    ctx.globalAlpha = .5 + .3 * Math.sin(now / 400 + i);
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.bezierCurveTo(sx + Math.sin(ph) * 8 * u, sy - h * .35, sx - Math.sin(ph) * 8 * u, sy - h * .7, sx + Math.sin(ph + 1) * 6 * u, sy - h); ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.lineCap = 'butt';
};
const tickTock = (() => { let hi = false; return () => tick(hi = !hi); })();
const CINES = {
  intro: [{draw: imgScene('room', {pan: [-6, 0], fx: (P, u, now) => {       // тётин дом: огонь в печи и керосиновая лампа мерцают
            const f = flick(now), [fx, fy] = P(593, 566), [lx, ly] = P(770, 405);
            glowAdd(fx, fy, 260 * u, '255,130,40', .22 * f); glowAdd(lx, ly, 200 * u, '255,190,90', .18 + .05 * Math.sin(now / 120));
          }}), dur: 6.5, key: 'c1', start: () => fireBed(6.5, .05),
            at: [...every(.2, 6.3, .45, () => crackle(.16), .35), ...every(.3, 6.4, .5, tickTock)]},   // треск дров и ходики
          {draw: imgScene('door', {zoom: .02, pan: [3, 0], shake: t => (t > .6 && t < 2.4) ? Math.sin(t * 60) * 3 * (Math.floor(t * 3) % 2) : 0,
            fx: (P, u, now) => { const [lx, ly] = P(1292, 812); glowAdd(lx, ly, 260 * u, '255,180,80', .22 + .06 * Math.sin(now / 110) * Math.sin(now / 53)); }}),
            dur: 4.5, key: 'c2', at: [.7, 1.1, 1.7, 2.1].map(x => [x, () => { knock(false); click(); }])},   // дёргает запертую дверь: дерево и железный засов
          {draw: imgScene('escape', {pan: [7, 0], snow: true, fx: (P, u, now, t) => {   // побег: вспышка от удара, свет из разбитого окна, блики на осколках
            const [wx, wy] = P(585, 240); glowAdd(wx, wy, 330 * u, '255,150,60', .16 + .04 * Math.sin(now / 140));
            for (let i = 0; i < 8; i++) { const g = Math.sin(now / 120 + i * 2.3); if (g > .85) { const [gx, gy] = P(520 + i * 28, 600 + (i * 37) % 60); glowAdd(gx, gy, 14 * u, '255,255,240', .7); } }
            if (t > BREAK_AT) { const a = Math.max(0, .75 * (1 - (t - BREAK_AT) / .45)); if (a > 0) { ctx.fillStyle = `rgba(255,245,225,${a})`; ctx.fillRect(0, 0, W, H); } }
          }}), dur: 6, key: 'c3', start: () => wind(6, .07), at: [[BREAK_AT, () => glassBreak()], [BREAK_AT + .6, () => footstep(false, 'snow')],
            ...Array.from({length: 18}, (_, i) => [BREAK_AT + .85 + i * .27, () => footstep(true, 'snow')])]},   // бежит босиком по снегу — те же шаги, что в игре
          {draw: imgScene('street', {zoom: .02, pan: [0, -4], snow: true, fx: (P, u, now) => {   // улица села: окна и фонарь, фонарик мальчика
            for (const [x, y] of [[299, 338], [416, 338], [1118, 364]]) { const [wx, wy] = P(x, y); glowAdd(wx, wy, 90 * u, '255,190,90', .14 + .03 * Math.sin(now / 900 + x)); }
            const [sx, sy] = P(689, 262); glowAdd(sx, sy, 110 * u, '255,210,140', .16);
            const [bx, by] = P(845, 600); glowAdd(bx, by, 160 * u, '230,235,255', .1 + .03 * Math.sin(now / 70));
          }}), dur: 5.5, key: 'c4', start: () => wind(5.5, .09),
            at: [...every(.3, 5.3, .55, () => footstep(false, 'snow')), [2.6, () => bark(.1, 1, p.x + 400)]]},   // идёт по улице, где-то лает собака
          {draw: 'iris', dur: 2.5, key: 'c5'}],
  outro: [{draw: imgScene('window', {pan: [-4, -2], snow: true, fx: (P, u, now) => {   // бабушка в окне: тёплый свет дышит, над кружкой пар
            const [wx, wy] = P(1027, 390); glowAdd(wx, wy, 320 * u, '255,160,60', .14 + .04 * Math.sin(now / 700));
            steam(P, u, now, 1000, 575);
          }}), dur: 6.5, key: 'o1', start: () => { winTune(); wind(6.5, .05); }},
          {draw: imgScene('porch', {zoom: .018, pan: [3, -2], snow: true, fx: (P, u, now) => {   // бабушка на пороге: свет из двери и фонарь
            const [dx, dy] = P(962, 330); glowAdd(dx, dy, 380 * u, '255,190,90', .16 + .05 * Math.sin(now / 500));
            const [lx, ly] = P(707, 265); glowAdd(lx, ly, 90 * u, '255,200,120', .18);
          }, post: t => { if (t > 4.7) { ctx.fillStyle = `rgba(255,236,200,${Math.min(1, (t - 4.7) / 1.4)})`; ctx.fillRect(0, 0, W, H); } }}),
            dur: 6.5, key: 'o2', start: () => doorCreak(), at: [1.6, 2.1, 2.6, 3.1].map(x => [x, () => footstep(false, 'wood')])},   // поднимается по деревянным ступенькам
  ],
  stove: {draw: imgScene('bonus', {pan: [3, 0], fx: (P, u, now) => {       // у печки: огонь мерцает
            const [fx, fy] = P(273, 437); glowAdd(fx, fy, 300 * u, '255,130,40', .22 * flick(now));
          }}), dur: 6.5, key: 'o3', low: true, start: () => fireBed(6.5, .05), at: every(.2, 6.3, .5, () => crackle(.14), .4)},
};
CINES.outro5 = [...CINES.outro, CINES.stove];
const startCine = kind => {
  state = 'cine'; cine = {kind, i: -1, t: 0}; document.body.classList.add('cine'); danger = false;
  for (const k in keys) keys[k] = false; joy = null; touch = null;
  cineNext();
};
const cineNext = () => {
  if (!cine) return;
  cine.i++; cine.t = 0;
  const f = CINES[cine.kind][cine.i];
  if (!f) return cineEnd();
  cineText.textContent = t(f.key); cineText.style.opacity = 0; cineText.classList.toggle('low', !!f.low);   // low — подпись в левом верхнем углу, если по центру сверху лицо
  if (f.start) f.start();
};
const cineSkip = () => { if (cine) cineEnd(); };
const cineEnd = () => {
  const kind = cine.kind; cine = null; irisR = 0; document.body.classList.remove('cine');
  if (kind === 'intro') { state = 'play'; t0 = -1; p.grace = 2; say(t('intro'), 4.5); }
  else {
    state = 'won';
    say(`<b>${t('win')}</b>${t('winText')}<br>${t('time')}: ${fmt(winMs / 1000)} · ${t(diff)[0].toLowerCase()} · ${t('tries')}: ${attempts}<br>${t('secrets')}: ${items.filter(i => i.found).length}/5${winRec ? `<em>${t('record')}</em>` : ''}`, 6);
    setTimeout(() => { if (state === 'won') openMenu(); }, 6000);
  }
};
document.getElementById('cineSkip').addEventListener('click', e => { e.stopPropagation(); cineSkip(); });
cineEl.addEventListener('pointerdown', e => { if (e.target.id !== 'cineSkip') cineNext(); });
const drawCine = (now, dt) => {
  const f = CINES[cine.kind][cine.i], t0c = cine.t; cine.t += dt;
  for (const [at, fn] of f.at || []) if (t0c < at && cine.t >= at) fn();
  if (f.draw === 'iris') {                        // улица: темнота сжимается в круг фонарика
    const k = Math.min(1, cine.t / (f.dur - .4)), e = 1 - Math.pow(1 - k, 3);
    irisR = Math.hypot(W, H) * (1 - e) + D.light * .5 * e;
    draw(now);
  } else { ctx.save(); f.draw(now, cine.t); ctx.restore(); }
  const fade = Math.min(1, cine.t / .6, (f.dur - cine.t) / .6);
  if (f.draw !== 'iris' && fade < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - Math.max(0, fade)})`; ctx.fillRect(0, 0, W, H); }
  cineText.style.opacity = Math.max(0, Math.min(1, cine.t / .8, (f.dur - cine.t) / .5));
  if (cine.t >= f.dur) cineNext();
};
// --- кадры (рисуются кодом; s — масштаб под экран)
const S = () => Math.min(W, H * 1.4) / 700;
// --- общие детали кадров
const lightPool = (x, y, r, col, a) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
};

// ================= ФИНАЛ =================
// --- снег, свечение, виньетка для кадров заставок
const FLAKES2 = Array.from({length: 70}, (_, i) => ({x: hv(i, 5, 2), y: hv(i, 6, 2), z: .4 + hv(i, 7, 2) * 1.6, ph: hv(i, 8, 2) * 6}));
const vignette = (a = .65) => {
  const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .72);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
};
const glowAdd = (x, y, r, col, a) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; lightPool(x, y, r, col, a); ctx.restore(); };
const snowFront = (now, t, s) => {
  for (const f of FLAKES2) {
    const sp = f.z, x = ((f.x * W + Math.sin(now / 1500 + f.ph) * 20 * sp - t * 10 * sp) % W + W) % W, y = ((f.y * H + now / 40 * sp) % (H + 20)) - 10;
    ctx.fillStyle = `rgba(235,242,252,${.25 + .35 * (sp / 2)})`; ctx.beginPath(); ctx.arc(x, y, sp * 1.6 * s, 0, 7); ctx.fill();
  }
};
// Узнаваемость силуэта: платок козырьком над лбом и узлом под подбородком, выступающий нос, впалый рот, сутулая спина
const prints = [], breath = [];
let breathT = 0, frost = null;
// Иней по краям экрана: чем холоднее, тем сильнее
const makeFrost = () => {
  frost = document.createElement('canvas'); frost.width = W; frost.height = H;
  const x = frost.getContext('2d'), R = Math.hypot(W, H) / 2;
  const gr = x.createRadialGradient(W / 2, H / 2, R * .45, W / 2, H / 2, R);
  gr.addColorStop(0, 'rgba(200,225,245,0)'); gr.addColorStop(.7, 'rgba(200,225,245,.35)'); gr.addColorStop(1, 'rgba(230,242,252,.85)');
  x.fillStyle = gr; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(240,248,255,.5)'; x.lineWidth = 1;
  for (let i = 0; i < 260; i++) {                 // ледяные «иголки» у кромки
    const a = Math.random() * 6.283, d = R * (.82 + Math.random() * .2), cx = W / 2 + Math.cos(a) * d, cy = H / 2 + Math.sin(a) * d * (H / W + .3);
    const l = 6 + Math.random() * 16, b = a + Math.PI + (Math.random() - .5);
    x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(b) * l, cy + Math.sin(b) * l); x.stroke();
  }
};
const taskEl = document.getElementById('task');
const CONES = new Map();
const coneSprite = (R, kind = 'lamp') => {     // мягкий луч фонаря, смотрит вправо; рисуется один раз на каждый вид
  const key = kind + R;
  if (CONES.has(key)) return CONES.get(key);
  const c = document.createElement('canvas'); c.width = c.height = R * 2; c.R = R;
  const col = {lamp: '255,230,160', alert: '255,160,90', hunt: '215,230,255', aim: '255,120,100', moto: '255,248,220'}[kind], narrow = kind === 'hunt' || kind === 'aim' || kind === 'moto';
  const x = c.getContext('2d'), cg = x.createRadialGradient(R, R, 0, R, R, R);
  const am = kind === 'moto' ? 2.2 : 1;                                     // фара мотоцикла ярче
  cg.addColorStop(0, `rgba(${col},0)`); cg.addColorStop(.1, `rgba(${col},${.024 * am})`);
  cg.addColorStop(.55, `rgba(${col},${.013 * am})`); cg.addColorStop(1, `rgba(${col},0)`);
  x.fillStyle = cg;
  for (let k = 0; k < 20; k++) { const half = narrow ? .07 + k * .013 : .12 + k * .022; x.beginPath(); x.moveTo(R, R); x.arc(R, R, R, -half, half); x.closePath(); x.fill(); }
  CONES.set(key, c); return c;
};
const scratch = document.createElement('canvas'), sctx = scratch.getContext('2d');
const litCone = (cs, wx, wy, dir) => {           // луч чужого фонаря с тенями от домов (wx, wy — точка света на карте)
  const R = cs.R, D2 = R * 2;
  if (lowFx || !OCC.some(r => r.x < wx + R && r.x + r.w > wx - R && r.y < wy + R && r.y + r.h > wy - R)) {   // домов рядом нет — рисуем как есть
    ctx.save(); ctx.translate(wx - camX, wy - camY); ctx.rotate(dir); ctx.drawImage(cs, -R, -R); ctx.restore(); return;
  }
  if (scratch.width < D2) scratch.width = scratch.height = D2;
  sctx.clearRect(0, 0, D2, D2);
  sctx.save(); sctx.translate(R, R); sctx.rotate(dir); sctx.drawImage(cs, -R, -R); sctx.restore();
  sctx.globalCompositeOperation = 'destination-out'; sctx.fillStyle = '#000';
  shadows(sctx, wx, wy, R, R - wx, R - wy);
  sctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(scratch, 0, 0, D2, D2, wx - camX - R, wy - camY - R, D2, D2);
};
const glowSprite = (r, col) => {
  const c = document.createElement('canvas'); c.width = c.height = r * 2;
  const x = c.getContext('2d'), gr = x.createRadialGradient(r, r, 0, r, r, r);
  gr.addColorStop(0, col); gr.addColorStop(1, col.replace(/[\d.]+\)$/, '0)'));
  x.fillStyle = gr; x.fillRect(0, 0, r * 2, r * 2); return c;
};
const GLOW_WIN = glowSprite(22, 'rgba(255,179,71,.55)'), GLOW_SPOT = glowSprite(30, 'rgba(255,190,90,.35)'), GLOW_EYE = glowSprite(8, 'rgba(216,255,106,.6)'), GLOW_LAMP = glowSprite(22, 'rgba(255,220,150,.5)');
// Ели и кусты рисуются один раз в картинки-заготовки (по 12 вариантов), потом только копируются
const TREE_SPR = new Map();
const treeSprite = t => {
  const key = (t.bush ? 'b' : 't') + Math.round(t.r / 3) + '_' + (Math.floor(t.a * 2) % 12);
  let s = TREE_SPR.get(key);
  if (s) return s;
  const R = Math.round(t.r / 3) * 3, size = Math.ceil(R * 2.6 + 16), k = Math.min(devicePixelRatio || 1, 2);
  s = document.createElement('canvas'); s.width = s.height = Math.ceil(size * k);
  const sx = s.getContext('2d'); sx.scale(k, k);
  const saved = ctx; ctx = sx; const ox = camX, oy = camY; camX = camY = 0;
  drawTree({...t, x: size / 2 - 4, y: size / 2 - 4, r: R, a: (Math.floor(t.a * 2) % 12) / 2});
  ctx = saved; camX = ox; camY = oy;
  s.off = size / 2 - 4; s.size = size;
  TREE_SPR.set(key, s); return s;
};
const vis = (x, y, m) => x > -m && y > -m && x < W + m && y < H + m;

const strokePoly = (pts, width, color) => {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = ctx.lineCap = 'round';
  ctx.beginPath();
  const m = width + 60; let open = false;
  for (let i = 0; i < pts.length; i++) {           // только точки рядом с экраном, остальной путь не рисуем
    const x = pts[i][0] - camX, y = pts[i][1] - camY;
    const near = x > -m && y > -m && x < W + m && y < H + m;
    const nb = near || (i > 0 && vis(pts[i - 1][0] - camX, pts[i - 1][1] - camY, m)) || (i < pts.length - 1 && vis(pts[i + 1][0] - camX, pts[i + 1][1] - camY, m));
    if (nb) { if (open) ctx.lineTo(x, y); else ctx.moveTo(x, y); open = true; } else open = false;
  }
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
const houseStyle = h => {
  if (h.st) return h.st;
  const r = k => hv(h.x, h.y, k);
  return h.st = h.goal
    ? {wall: '#6b4a32', logs: true, roof: 'goal', shut: '#4f7fb0', pile: true, fence: 'picket', fcol: '#4b3b2c'}
    : {wall: ['#5b412c', '#6b4a32', '#3d5f7a', '#3f6150', '#5d5650', '#4e3a2a'][Math.floor(r(1) * 6)],
       logs: r(2) < .6,
       roof: r(3) < .55 ? 'snow' : 'tin',
       tin: ['#8a3a32', '#3a5a7a', '#3d6a4f', '#6a6f74'][Math.floor(r(4) * 4)],
       shut: r(5) < .3 ? null : ['#4f7fb0', '#e8e6dc', '#3f7a55', '#a8443a'][Math.floor(r(6) * 4)],
       pile: r(7) < .5, fence: r(8) < .5 ? 'picket' : 'boards', fcol: r(9) < .5 ? '#4b3b2c' : '#5a4a3c'};
};
const drawHouse = (h, now, part) => {   // part: 'static' — всё, кроме дыма; 'smoke' — только дым
  const s = houseStyle(h), x = h.x - camX, y = h.y - camY, f = fenceOf(h);
  const cx = x + h.w * (h.goal ? .62 : .72), cy = y + 2;
  if (part === 'smoke') { if (h.lit) drawSmoke(cx, cy, h, now); return; }
  // забор: штакетник или сплошные доски, со столбиками
  ctx.strokeStyle = s.fcol; ctx.lineWidth = s.fence === 'picket' ? 2 : 3;
  if (s.fence === 'picket') ctx.setLineDash([2, 4]);
  ctx.strokeRect(f.x - camX, f.y - camY, f.w, f.h); ctx.setLineDash([]);
  ctx.fillStyle = '#3a2c20';
  for (let k = 0; k <= 4; k++) for (const [px, py] of [[f.x + f.w * k / 4, f.y], [f.x + f.w * k / 4, f.y + f.h]]) ctx.fillRect(px - camX - 2, py - camY - 2, 4, 4);
  ctx.fillStyle = '#e8eef4'; ctx.fillRect(f.x - camX, f.y - camY - 1, f.w, 1.5);          // снег на заборе
  // калитка напротив крыльца
  ctx.fillStyle = s.fcol; ctx.fillRect(x + h.w * .8 - 6 - (f.x - h.x) * 0, f.y + f.h - camY - 2, 12, 4);
  ctx.fillStyle = 'rgba(20,30,40,.45)'; ctx.fillRect(x + 8, y + 10, h.w, h.h + 20);
  // поленница вдоль стены
  if (s.pile) for (let yy = y + 6; yy < y + h.h + 14; yy += 5) for (const xx of [x - 11, x - 6]) {
    ctx.fillStyle = '#7a5434'; ctx.beginPath(); ctx.arc(xx, yy, 2.4, 0, 7); ctx.fill();
    ctx.fillStyle = '#b08a5a'; ctx.beginPath(); ctx.arc(xx, yy, 1.1, 0, 7); ctx.fill();
  }
  // стена: брёвна или доски, цоколь
  ctx.fillStyle = s.wall; ctx.fillRect(x, y + h.h, h.w, 20);
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  if (s.logs) for (let k = 4; k < 20; k += 5) ctx.fillRect(x, y + h.h + k, h.w, 1.5);
  else for (let k = 6; k < h.w; k += 7) ctx.fillRect(x + k, y + h.h, 1, 20);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x, y + h.h + 17, h.w, 3);
  // окна с наличниками и ставнями, дверь с крыльцом
  const wins = h.goal ? [h.w * .3, h.w * .7] : [h.w * .4];
  for (const wx of wins) {
    if (s.shut) { ctx.fillStyle = s.shut; ctx.fillRect(x + wx - 12, y + h.h + 4, 4, 12); ctx.fillRect(x + wx + 8, y + h.h + 4, 4, 12); }
    ctx.fillStyle = '#e8e6dc'; ctx.fillRect(x + wx - 8, y + h.h + 4, 16, 12);
    ctx.fillStyle = h.lit ? '#ffcc66' : '#1a1d22'; ctx.fillRect(x + wx - 7, y + h.h + 5, 14, 10);
    ctx.fillStyle = '#3a2a1d'; ctx.fillRect(x + wx - .75, y + h.h + 5, 1.5, 10); ctx.fillRect(x + wx - 7, y + h.h + 9, 14, 1.2);
  }
  if (!h.goal) {
    ctx.fillStyle = '#2e2218'; ctx.fillRect(x + h.w * .8 - 5, y + h.h + 3, 10, 17);
    ctx.fillStyle = '#7a6a58'; ctx.fillRect(x + h.w * .8 - 8, y + h.h + 20, 16, 4);
    ctx.fillStyle = '#eef3f7'; ctx.fillRect(x + h.w * .8 - 8, y + h.h + 20, 16, 1.5);
  }
  // крыша
  if (s.roof === 'goal') {
    const L = x - 4, R = x + h.w + 4, T = y - 4, B = y + h.h + 2, rx1 = x + h.w * .3, rx2 = x + h.w * .7, ry = y + h.h / 2;
    ctx.fillStyle = '#2b4d3c'; poly([[L, T], [R, T], [rx2, ry], [rx1, ry]]);
    ctx.fillStyle = '#1f3a2d'; poly([[L, B], [R, B], [rx2, ry], [rx1, ry]]);
    ctx.fillStyle = '#35604b'; poly([[L, T], [rx1, ry], [L, B]]);
    ctx.fillStyle = '#183026'; poly([[R, T], [rx2, ry], [R, B]]);
    ctx.fillStyle = 'rgba(240,245,249,.85)';
    poly([[L + 6, T + 3], [R - 20, T + 3], [rx2 - 4, ry - 6], [rx1 + 2, ry - 6]]);
    ctx.fillStyle = '#c7d2db'; ctx.fillRect(rx1, ry - 1, rx2 - rx1, 2);
  } else {
    ctx.fillStyle = '#2e2218'; ctx.fillRect(x - 4, y - 4, h.w + 8, h.h + 6);
    if (s.roof === 'snow') {
      ctx.fillStyle = '#dfe7ee'; ctx.fillRect(x - 2, y - 2, h.w + 4, h.h * .45);
      ctx.fillStyle = '#f4f8fb'; ctx.fillRect(x - 2, y - 2 + h.h * .45, h.w + 4, h.h * .55);
      ctx.fillStyle = 'rgba(160,175,190,.5)';                                     // наметённые волны снега
      for (let k = 0; k < 3; k++) ctx.fillRect(x + 6 + k * 21, y + h.h * .7, 12, 1.5);
    } else {
      ctx.fillStyle = s.tin; ctx.fillRect(x - 2, y - 2, h.w + 4, h.h + 2);
      ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(x - 2, y - 2, h.w + 4, h.h * .45);
      ctx.fillStyle = 'rgba(255,255,255,.12)'; for (let k = 2; k < h.w; k += 6) ctx.fillRect(x + k, y - 2, 1.5, h.h + 2);   // рёбра профиля
      ctx.fillStyle = 'rgba(240,245,249,.85)';                                     // снег пятнами
      ctx.beginPath(); ctx.ellipse(x + h.w * .3, y + h.h * .72, 14, 6, 0, 0, 7); ctx.ellipse(x + h.w * .75, y + h.h * .25, 10, 4, 0, 0, 7); ctx.fill();
    }
    ctx.fillStyle = '#7a6656'; ctx.fillRect(x - 2, y - 2 + h.h * .45, h.w + 4, 2);
  }
  // труба и дым (если в доме топят)
  ctx.fillStyle = '#6b3f33'; ctx.fillRect(cx, cy, 9, 12);
  ctx.fillStyle = '#2a1d16'; ctx.fillRect(cx + 2, cy + 3, 5, 5);
  ctx.fillStyle = '#f4f8fb'; ctx.fillRect(cx, cy, 9, 2.5);
};
const drawSmoke = (cx, cy, h, now) => {
  for (let i = 0; i < 4; i++) {
    const ph = (now / 2200 + i / 4 + h.x % 1) % 1;
    ctx.fillStyle = `rgba(210,215,222,${.32 * (1 - ph)})`;
    ctx.beginPath(); ctx.arc(cx + 4.5 + ph * 16 + Math.sin(ph * 6 + i) * 2, cy + 5 - ph * 26, 3 + ph * 7, 0, 7); ctx.fill();
  }
};
// Дом рисуется один раз в картинку (без дыма), дальше только копируется
const houseSprite = h => {
  if (h.spr) return h.spr;
  const f = fenceOf(h), bx = Math.min(f.x, h.x - 16) - 4, by = f.y - 4, bw = f.x + f.w + 4 - bx, bh = f.y + f.h + 6 - by;
  const k = Math.min(devicePixelRatio || 1, 2), c = document.createElement('canvas');
  c.width = Math.ceil(bw * k); c.height = Math.ceil(bh * k);
  const cx2 = c.getContext('2d'); cx2.scale(k, k);
  const saved = ctx, ox = camX, oy = camY; ctx = cx2; camX = bx; camY = by;
  drawHouse(h, 0, 'static');
  ctx = saved; camX = ox; camY = oy;
  return h.spr = {c, bx, by, bw, bh};
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

// Взрослый сверху: тулуп/фуфайка, шапка-ушанка, платок или вязаная шапка, фонарь в руке
const drawMoto = (sx, sy, a, now) => {             // мотоцикл с коляской сверху: «Урал», дядя в ушанке, коляска справа
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(a);
  ctx.fillStyle = 'rgba(20,30,40,.35)'; ctx.beginPath(); ctx.ellipse(2, 8, 26, 20, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#1b1b1d'; ctx.fillRect(14, -3, 10, 6); ctx.fillRect(-24, -3, 10, 6);                   // колёса
  ctx.fillStyle = '#3c4a2e'; ctx.beginPath(); ctx.ellipse(0, 0, 18, 6, 0, 0, 7); ctx.fill();               // бак и рама
  ctx.fillStyle = '#2a2a2c'; ctx.fillRect(9, -9, 3, 18);                                                    // руль
  ctx.fillStyle = '#3c4a2e'; ctx.beginPath(); ctx.ellipse(-2, 17, 15, 8, 0, 0, 7); ctx.fill();             // коляска
  ctx.fillStyle = '#2c3622'; ctx.beginPath(); ctx.ellipse(-5, 17, 9, 5.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#1b1b1d'; ctx.fillRect(-6, 25, 9, 4);                                                    // колесо коляски
  ctx.fillStyle = '#e8eef4'; ctx.fillRect(-14, 12, 10, 3);                                                  // снег на коляске
  ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.ellipse(-3, 0, 8, 10, 0, 0, 7); ctx.fill();              // дядя: тулуп
  ctx.fillStyle = '#5b4632'; ctx.beginPath(); ctx.arc(-1, 0, 5.5, 0, 7); ctx.fill();                       // ушанка
  ctx.fillRect(-4, -8, 5, 3); ctx.fillRect(-4, 5, 5, 3);
  ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(25, 0, 3, 0, 7); ctx.fill();                          // фара
  ctx.fillStyle = '#ff3a2a'; ctx.fillRect(-27, -1.5, 2.5, 3);                                               // стоп-сигнал
  ctx.restore();
};
const drawPerson = (sx, sy, dir, step, look) => {
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(dir); ctx.scale(1.6, 1.6);
  const sw = Math.sin(step) * 5;
  ctx.fillStyle = 'rgba(20,30,40,.35)'; ctx.beginPath(); ctx.ellipse(3, 4, 13, 10, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#1c1c22';
  ctx.beginPath(); ctx.ellipse(sw, -5, 5, 3.5, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-sw, 5, 5, 3.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = look.coat; ctx.beginPath(); ctx.ellipse(-1, 0, 8, 12, 0, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.ellipse(-2, -3, 5, 7, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .8;                             // стёжка/полы
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(6, 0); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.arc(-sw * .8, -12, 3.6, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(sw * .8, 12, 3.6, 0, 7); ctx.fill();
  ctx.fillStyle = look.coat;
  ctx.beginPath(); ctx.arc(-sw * .8, -12, 3, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(sw * .8, 12, 3, 0, 7); ctx.fill();
  ctx.fillStyle = '#3a3a3a'; ctx.fillRect(sw * .8 + 2, 12.5, 4, 3);                    // фонарь
  ctx.fillStyle = '#ffcf7a'; ctx.beginPath(); ctx.arc(sw * .8 + 6, 14, 2, 0, 7); ctx.fill();
  if (look.hat === 'ushanka') {
    ctx.fillStyle = look.hatCol; ctx.beginPath(); ctx.arc(1, 0, 6.8, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-4, -8, 5, 4); ctx.fillRect(-4, 4, 5, 4);
    ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(-1, -2, 3, 0, 7); ctx.fill();
  } else if (look.hat === 'platok') {
    ctx.fillStyle = look.hatCol; ctx.beginPath(); ctx.arc(1, 0, 6.5, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-3, -4); ctx.lineTo(-11, 0); ctx.lineTo(-3, 4); ctx.fill();      // уголок платка
    ctx.fillStyle = 'rgba(255,240,200,.55)';
    for (const [a, b] of [[-1, -3], [3, 2], [-2, 3], [2, -3]]) { ctx.beginPath(); ctx.arc(a, b, 1, 0, 7); ctx.fill(); }   // узор
  } else {
    ctx.fillStyle = look.hatCol; ctx.beginPath(); ctx.arc(1, 0, 6.3, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(1, 0, 4, 0, 7); ctx.stroke();
  }
  ctx.fillStyle = '#e2c9a8'; ctx.beginPath(); ctx.arc(6.5, 0, 2.4, 0, 7); ctx.fill();
  ctx.restore();
};
// Мальчик 5–6 лет: маленький, в дутой куртке, шарфе, вязаной шапке с помпоном, босиком (убежал как был), с фонариком
const drawBoy = (sx, sy, dir, step) => {
  ctx.save(); ctx.translate(sx, sy); ctx.rotate(dir); ctx.scale(1.2, 1.2);
  const sw = Math.sin(step) * 4;
  ctx.fillStyle = 'rgba(20,30,40,.35)'; ctx.beginPath(); ctx.ellipse(3, 4, 11, 9, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#d9b49a';                                                              // босые ноги
  ctx.beginPath(); ctx.ellipse(sw, -4, 4.5, 3.2, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-sw, 4, 4.5, 3.2, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#c23b3b'; ctx.fillRect(-12, -1.5, 7, 3);                               // кончик шарфа сзади
  ctx.fillStyle = '#1f4f8a'; ctx.beginPath(); ctx.ellipse(-1, 0, 7.5, 10, 0, 0, 7); ctx.fill();   // дутая куртка
  ctx.fillStyle = '#2e6cb5'; ctx.beginPath(); ctx.ellipse(-1, 0, 6.5, 9, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = .8;                          // стёжка пуховика
  for (const yy of [-5, 0, 5]) { ctx.beginPath(); ctx.moveTo(-6, yy); ctx.lineTo(4, yy); ctx.stroke(); }
  ctx.fillStyle = '#2e6cb5';
  ctx.beginPath(); ctx.arc(-sw * .7, -10, 2.8, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(sw * .7, 10, 2.8, 0, 7); ctx.fill();
  ctx.fillStyle = '#c23b3b';                                                              // варежки
  ctx.beginPath(); ctx.arc(-sw * .7 + 2, -11.5, 2.2, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(sw * .7 + 2, 11.5, 2.2, 0, 7); ctx.fill();
  ctx.fillStyle = '#4a4a50'; ctx.fillRect(sw * .7 + 3, 11, 5, 2.4);                     // фонарик
  ctx.fillStyle = p.lamp ? '#ffe08a' : '#6a6a60'; ctx.beginPath(); ctx.arc(sw * .7 + 8.5, 12.2, 1.6, 0, 7); ctx.fill();
  ctx.fillStyle = '#c23b3b'; ctx.beginPath(); ctx.ellipse(2, 0, 3, 7, 0, 0, 7); ctx.fill();   // шарф на шее
  ctx.fillStyle = '#e2c9a8'; ctx.beginPath(); ctx.arc(6.5, 0, 2.8, 0, 7); ctx.fill();          // лицо (большая голова)
  ctx.fillStyle = '#c23b3b'; ctx.beginPath(); ctx.arc(1.5, 0, 6.6, 0, 7); ctx.fill();         // вязаная шапка
  ctx.strokeStyle = '#f2ede4'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(1.5, 0, 4.2, 0, 7); ctx.stroke();
  ctx.fillStyle = '#f2ede4'; ctx.beginPath(); ctx.arc(-1.5, 0, 2.6, 0, 7); ctx.fill();         // помпон
  ctx.restore();
};

// Термос: красный, с крышкой-кружкой и паром — видно, что горячий
const drawThermos = (th, now) => {
  const x = th.x - camX, y = th.y - camY;
  ctx.fillStyle = 'rgba(20,30,40,.4)'; ctx.beginPath(); ctx.ellipse(x + 4, y + 6, 10, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#a8282e'; ctx.fillRect(x - 5, y - 12, 10, 20);
  ctx.fillStyle = '#d23a3f'; ctx.fillRect(x - 5, y - 12, 4, 20);
  ctx.fillStyle = '#c8ccd2'; ctx.fillRect(x - 5.5, y - 15, 11, 4); ctx.fillRect(x - 5.5, y + 6, 11, 2.5);
  ctx.fillStyle = '#f2ede4'; ctx.fillRect(x - 3, y - 4, 6, 5);                                   // этикетка
  ctx.fillStyle = '#c8ccd2'; ctx.beginPath(); ctx.ellipse(x + 11, y + 4, 4.5, 3.5, 0, 0, 7); ctx.fill();   // крышка-кружка рядом
  ctx.fillStyle = '#7a4a24'; ctx.beginPath(); ctx.ellipse(x + 11, y + 3.5, 3, 2, 0, 0, 7); ctx.fill();     // чай в кружке
  for (let i = 0; i < 3; i++) {                                                                  // пар
    const ph = (now / 1400 + i / 3) % 1;
    ctx.fillStyle = `rgba(240,244,248,${.4 * (1 - ph)})`;
    ctx.beginPath(); ctx.arc(x + 11 + Math.sin(ph * 6 + i) * 2, y - ph * 18, 2 + ph * 3, 0, 7); ctx.fill();
  }
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
  const L = e.look, mv = Math.hypot(e.x - (e.lx ?? e.x), e.y - (e.ly ?? e.y)); e.lx = e.x; e.ly = e.y;
  e.gait = (e.gait || 0) + mv * .35;
  const leg = mv > .05 ? Math.sin(e.gait) * 3 : 0, wag = Math.sin(now / (wolf ? 400 : (e.state === 'chase' ? 70 : 180)) + L.ph) * (wolf ? .15 : .45);
  const s = (wolf ? 1.35 : 1) * L.size;
  ctx.save(); ctx.translate(x, y); ctx.rotate(e.dir); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(20,30,40,.35)'; ctx.beginPath(); ctx.ellipse(3, 4, 14, 7, 0, 0, 7); ctx.fill();
  const dark = wolf ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.3)';
  ctx.fillStyle = dark;                                                                  // лапы
  for (const [lx0, side, ph] of [[6, -1, 1], [6, 1, -1], [-8, -1, -1], [-8, 1, 1]]) {
    ctx.beginPath(); ctx.ellipse(lx0 + leg * ph, side * 5.5, 2.6, 1.8, 0, 0, 7); ctx.fill();
  }
  ctx.save(); ctx.translate(-12, 0); ctx.rotate(wag);                                   // хвост
  ctx.fillStyle = L.col;
  if (wolf) { ctx.beginPath(); ctx.ellipse(-5, 0, 7.5, 3.2, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#2f3133'; ctx.beginPath(); ctx.ellipse(-10.5, 0, 2.5, 2, 0, 0, 7); ctx.fill(); }
  else { ctx.beginPath(); ctx.ellipse(-4, 0, 5.5, 1.8, 0, 0, 7); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = L.col; ctx.beginPath(); ctx.ellipse(-2, 0, 11, 6, 0, 0, 7); ctx.fill();          // тело
  if (wolf) {
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(-3, 0, 9, 2.4, 0, 0, 7); ctx.fill();   // тёмная полоса по спине
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(-2, 4.5, 8, 1.6, 0, 0, 7); ctx.ellipse(-2, -4.5, 8, 1.6, 0, 0, 7); ctx.fill();
    ctx.fillStyle = L.col; ctx.beginPath(); ctx.arc(7, 0, 5.6, 0, 7); ctx.fill();                  // грива-воротник
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = .8;
    for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(4, k * 2.2); ctx.lineTo(1, k * 2.8); ctx.stroke(); }
  } else if (L.spot) {
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(-5, -1, 3.5, 2.5, .4, 0, 7); ctx.ellipse(1, 2.5, 2.5, 2, 0, 0, 7); ctx.fill();
  }
  ctx.fillStyle = L.col; ctx.beginPath(); ctx.arc(10, 0, 4.5, 0, 7); ctx.fill();                 // голова
  ctx.beginPath(); ctx.moveTo(13, -2.2); ctx.lineTo(wolf ? 19 : 17.5, 0); ctx.lineTo(13, 2.2); ctx.fill();
  ctx.fillStyle = '#151515'; ctx.beginPath(); ctx.arc(wolf ? 18.6 : 17, 0, 1, 0, 7); ctx.fill(); // нос
  ctx.fillStyle = 'rgba(0,0,0,.35)';                                                     // уши
  if (wolf) { ctx.beginPath(); ctx.moveTo(8, -3); ctx.lineTo(6, -7.5); ctx.lineTo(10.5, -4); ctx.fill(); ctx.beginPath(); ctx.moveTo(8, 3); ctx.lineTo(6, 7.5); ctx.lineTo(10.5, 4); ctx.fill(); }
  else { ctx.beginPath(); ctx.ellipse(8, -4.2, 2.8, 1.6, .5, 0, 7); ctx.ellipse(8, 4.2, 2.8, 1.6, -.5, 0, 7); ctx.fill();
         ctx.strokeStyle = '#a8343a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(6.2, -4.3); ctx.lineTo(6.2, 4.3); ctx.stroke(); }   // ошейник
  ctx.restore();
};

const draw = now => {
  camX = p.x - W / 2; camY = p.y - H / 2;
  const shiver = state === 'play' && p.warm < 25 ? (25 - p.warm) / 25 : 0;     // замерзаешь — картинку потряхивает
  if (shiver) { camX += (Math.random() - .5) * 2.4 * shiver; camY += (Math.random() - .5) * 2.4 * shiver; }

  ctx.fillStyle = '#9aa9b8'; ctx.fillRect(0, 0, W, H);
  for (const st of ALLROADS) strokePoly(st, (st === ROAD ? 44 : 36) + 14, '#b2bfcc');   // снежные отвалы по краям
  for (const st of ALLROADS) {
    const w = st === ROAD ? 44 : 36;
    strokePoly(st, w, '#8a8f8f');                                                    // укатанный снег
    strokePoly(st, w * .72, '#7c8183');                                              // колеи
    strokePoly(st, w * .4, '#8d9294');                                               // гребень между колеями
  }

  rivers.forEach((r, i) => {
    strokePoly(r.pts, r.w * 2 + 16, '#c9d4de');                                     // забереги — лёд у берега
    ctx.setLineDash([9, 13]); strokePoly(r.pts, r.w * 2 + 6, '#e6edf3'); ctx.setLineDash([]);   // рваный край льда
    strokePoly(r.pts, r.w * 2, '#1b2a36');
    strokePoly(r.pts, r.w * 1.1, '#16232e');                                         // глубина посередине
    ctx.setLineDash([5, 30]); ctx.lineDashOffset = -now / 45 * (r.w / 40);             // течение: бегущие блики
    strokePoly(r.pts, r.w * 1.3, 'rgba(120,160,190,.22)');
    ctx.lineDashOffset = -now / 60 - 17; strokePoly(r.pts, r.w * .5, 'rgba(150,185,210,.18)');
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
    for (const fl of r.floes) if (vis(fl.x - camX, fl.y - camY, 20)) {                // льдины у кромки
      ctx.fillStyle = 'rgba(225,235,242,.85)'; ctx.beginPath();
      for (let k = 0; k < 5; k++) { const an = fl.a + k * 1.257, rr2 = fl.r * (.7 + hv(fl.x, fl.y, k) * .5); ctx.lineTo(fl.x - camX + Math.cos(an) * rr2, fl.y - camY + Math.sin(an) * rr2); }
      ctx.closePath(); ctx.fill();
    }
    drawBridge(r, i === 1);
  });

  for (const h of houses) if (vis(h.x - camX, h.y - camY, 110)) { const s = houseSprite(h); ctx.drawImage(s.c, s.bx - camX, s.by - camY, s.bw, s.bh); }
  for (const h of houses) if (h.lit && vis(h.x - camX, h.y - camY, 110)) drawHouse(h, now, 'smoke');
  for (const pr of prints) {                       // следы: медленно заметает снегом
    const age = (now - pr.t) / 1000; if (age > 45 || !vis(pr.x - camX, pr.y - camY, 10)) continue;
    ctx.save(); ctx.translate(pr.x - camX, pr.y - camY); ctx.rotate(pr.dir);
    ctx.fillStyle = `rgba(${pr.road ? '70,78,86' : '95,115,135'},${.38 * (1 - age / 45)})`;
    ctx.beginPath(); ctx.ellipse(0, 0, 3.6, 2.2, 0, 0, 7); ctx.fill(); ctx.restore();
  }
  for (const t of trees) if (vis(t.x - camX, t.y - camY, 60)) { const s = treeSprite(t); ctx.drawImage(s, t.x - camX - s.off, t.y - camY - s.off, s.size, s.size); }
  for (const it of items) if (!it.found && vis(it.x - camX, it.y - camY, 30)) drawItem(it, now);
  for (const th of thermos) if (!th.taken && vis(th.x - camX, th.y - camY, 40)) drawThermos(th, now);
  for (const d of dogs) drawBeast(d, false, now);
  for (const w of wolves) drawBeast(w, true, now);
  for (const m of people) if (vis(m.x - camX, m.y - camY, 40)) drawPerson(m.x - camX, m.y - camY, m.dir, m.step, m.look);
  for (const h of hunters) if (vis(h.x - camX, h.y - camY, 50)) {
    drawPerson(h.x - camX, h.y - camY, h.dir, 0, h.look);
    ctx.save(); ctx.translate(h.x - camX, h.y - camY); ctx.rotate(h.dir);          // ружьё
    ctx.fillStyle = '#5a3a22'; ctx.fillRect(2, 9, 12, 4);
    ctx.fillStyle = '#2b2d30'; ctx.fillRect(13, 9.6, 22, 2.6);
    ctx.fillStyle = '#9aa0a6'; ctx.fillRect(28, 8.6, 5, 4.6);                       // фонарь на стволе
    ctx.restore();
  }
  if (moto.on && vis(moto.x - camX, moto.y - camY, 60)) drawMoto(moto.x - camX, moto.y - camY, moto.face, now);
  if (p.grace <= 0 || Math.floor(now / 120) % 2) drawBoy(W / 2, H / 2, p.dir, p.step);
  if (state === 'play' && (breathT -= 1 / 60) <= 0) {   // пар изо рта: на бегу чаще
    breathT = p.run ? .55 : 1.5;
    breath.push({x: p.x + Math.cos(p.dir) * 11, y: p.y + Math.sin(p.dir) * 11, vx: Math.cos(p.dir) * 6, vy: Math.sin(p.dir) * 6 - 4, t: now});
  }
  for (let i = breath.length - 1; i >= 0; i--) {
    const b = breath[i], age = (now - b.t) / 1400;
    if (age > 1) { breath.splice(i, 1); continue; }
    ctx.fillStyle = `rgba(235,242,248,${.32 * (1 - age)})`;
    ctx.beginPath(); ctx.arc(b.x + b.vx * age * 1.4 - camX, b.y + b.vy * age * 1.4 - camY, 2.5 + age * 8, 0, 7); ctx.fill();
  }

  ctx.fillStyle = '#e8eef5';
  for (const f of flakes) {
    f.y += f.s * .5; f.x += Math.sin(now / 900 + f.y / 50) * .15;
    const x = ((f.x - camX * .2) % W + W) % W, y = ((f.y - camY * .2) % H + H) % H;
    ctx.fillRect(x, y, f.s, f.s);
  }

  // ТЕМНОТА
  // вокруг — небольшое пятно, а фонарь светит лучом туда, куда смотрит мальчик; дома отбрасывают тень
  windR += ((p.lamp ? D.light * .5 : D.light * .38) - windR) * .06;
  beamL += ((p.lamp && !irisR ? beamLen() : 0) - beamL) * .08;
  const flick = 1 - shiver * .12 * (1 + Math.sin(now / 90));                    // на холоде фонарь слабеет и мигает
  const R = irisR || windR * flick + Math.sin(now / 130) * 2 + Math.sin(now / 47) * (windy ? 4 : 1);
  const DS = lowFx ? .3 : .5;                                                    // маска мягкая — хватает половинного разрешения
  if (!darkC || darkC.width !== Math.ceil(W * DS) || darkC.height !== Math.ceil(H * DS)) { darkC = document.createElement('canvas'); darkC.width = Math.ceil(W * DS); darkC.height = Math.ceil(H * DS); }
  const dx2 = darkC.getContext('2d'); dx2.setTransform(DS, 0, 0, DS, 0, 0);
  dx2.globalCompositeOperation = 'source-over'; dx2.fillStyle = '#000'; dx2.fillRect(0, 0, W, H);
  dx2.globalCompositeOperation = 'destination-out';
  if (beamL > 8) {
    const bl = beamL * flick, bs = beamSprite();
    dx2.save(); dx2.translate(W / 2 + Math.cos(p.dir) * 8, H / 2 + Math.sin(p.dir) * 8); dx2.rotate(p.dir);
    dx2.drawImage(bs, 0, -bl * BEAM_W, bl, bl * BEAM_W * 2); dx2.restore();
    dx2.globalCompositeOperation = 'source-over'; dx2.fillStyle = '#000';
    shadows(dx2, p.x, p.y, bl + 20, W / 2 - p.x, H / 2 - p.y);
    dx2.globalCompositeOperation = 'destination-out';
  }
  const g = dx2.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, R);
  g.addColorStop(0, 'rgba(0,0,0,.97)'); g.addColorStop(.45, 'rgba(0,0,0,.65)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  dx2.fillStyle = g; dx2.fillRect(0, 0, W, H);
  dx2.globalCompositeOperation = 'source-over';
  ctx.drawImage(darkC, 0, 0, W, H);

  if (senseT > 0 && state === 'play') {           // чутьё: светящаяся стрелка к цели
    senseTo = senseTarget();
    const gp = senseTo, a = Math.atan2(gp.y - p.y, gp.x - p.x), al = Math.min(1, senseT / .5), rr2 = 62 + Math.sin(now / 120) * 4;
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(a); ctx.globalAlpha = al;
    ctx.fillStyle = gp.item ? '#cfe6ff' : '#ffd27a'; ctx.beginPath(); ctx.moveTo(rr2 + 16, 0); ctx.lineTo(rr2, -9); ctx.lineTo(rr2 + 4, 0); ctx.lineTo(rr2, 9); ctx.closePath(); ctx.fill();
    ctx.restore(); ctx.globalAlpha = 1;
  }
  if (state !== 'menu' && p.warm < 60) {
    if (!frost || frost.width !== W || frost.height !== H) makeFrost();
    ctx.globalAlpha = Math.min(1, (60 - p.warm) / 50); ctx.drawImage(frost, 0, 0, W, H); ctx.globalAlpha = 1;
  }
  // сквозь темноту видно: окна, фонари людей, глаза волков, лай собак
  ctx.fillStyle = '#ffcc66';
  for (const h of houses) {
    if (!h.lit || !vis(h.x - camX, h.y - camY, 80)) continue;
    for (const wx of h.goal ? [h.w * .3, h.w * .7] : [h.w * .4]) {
      const x = h.x - camX + wx, y = h.y - camY + h.h + 10;
      ctx.drawImage(GLOW_WIN, x - 22, y - 22); ctx.fillRect(x - 7, y - 5, 14, 10);
    }
    ctx.drawImage(GLOW_SPOT, h.x - camX + h.w * .4 - 30, h.y - camY + h.h + 4);
  }
  for (const m of people) {
    const x = m.x - camX, y = m.y - camY;
    if (!vis(x, y, 260)) continue;
    const lx = x + Math.cos(m.dir) * 14, ly = y + Math.sin(m.dir) * 14;
    litCone(coneSprite(D.cone + 10, m.state === 'alert' ? 'alert' : 'lamp'), lx + camX, ly + camY, m.dir);
    ctx.drawImage(GLOW_LAMP, lx - 22, ly - 22);
    if (m.state === 'alert') { ctx.font = '700 22px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffa04a'; ctx.fillText('!', x, y - 26); }
  }
  for (const h of hunters) {                       // луч фонаря на стволе: уже и дальше, холодный; при прицеливании краснеет
    const x = h.x - camX, y = h.y - camY;
    if (!vis(x, y, D.hunt + 40)) continue;
    const mx = x + Math.cos(h.dir) * 34 - Math.sin(h.dir) * 11, my = y + Math.sin(h.dir) * 34 + Math.cos(h.dir) * 11;
    litCone(coneSprite(D.hunt + 10, h.state === 'aim' ? 'aim' : 'hunt'), mx + camX, my + camY, h.dir);
    ctx.drawImage(GLOW_LAMP, mx - 22, my - 22);
    if (h.state === 'aim') { ctx.font = '700 22px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ff5a4a'; ctx.fillText('!', x, y - 26); }
    if (h.flash > 0) { ctx.fillStyle = '#fff3c0'; ctx.beginPath(); ctx.arc(mx, my, 10, 0, 7); ctx.fill(); ctx.drawImage(GLOW_WIN, mx - 22, my - 22); }
  }
  if (moto.on) {                                   // фара: длинный яркий луч, видна издалека; задний красный огонёк
    const x = moto.x - camX, y = moto.y - camY, R = 330 * D.det;
    if (vis(x, y, R + 40)) {
      const fx = x + Math.cos(moto.face) * 25, fy = y + Math.sin(moto.face) * 25;
      litCone(coneSprite(Math.round(R + 10), moto.state === 'alert' ? 'aim' : 'moto'), fx + camX, fy + camY, moto.face);
      ctx.drawImage(GLOW_WIN, fx - 22, fy - 22);
      ctx.fillStyle = 'rgba(255,60,40,.8)'; ctx.beginPath(); ctx.arc(x - Math.cos(moto.face) * 26, y - Math.sin(moto.face) * 26, 2, 0, 7); ctx.fill();
      if (moto.state === 'alert') { ctx.font = '700 22px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ff5a4a'; ctx.fillText('!', x, y - 30); }
    }
  }
  for (const w of wolves) {
    const x = w.x - camX, y = w.y - camY;
    if (!vis(x, y, 20) || (now / 1000 + w.blink) % 5 < .15) continue;
    const ex = Math.cos(w.dir) * 14, ey = Math.sin(w.dir) * 14, nx = -Math.sin(w.dir) * 3, ny = Math.cos(w.dir) * 3;
    ctx.drawImage(GLOW_EYE, x + ex - 8, y + ey - 8);
    ctx.fillStyle = w.state === 'chase' ? '#ffe36a' : '#c9e86a';
    ctx.beginPath(); ctx.arc(x + ex + nx, y + ey + ny, 1.8, 0, 7); ctx.arc(x + ex - nx, y + ey - ny, 1.8, 0, 7); ctx.fill();
  }
  for (const th of thermos) {                      // тёплый огонёк: рядом термос
    if (th.taken || !vis(th.x - camX, th.y - camY, 10) || dist(th.x, th.y, p.x, p.y) > 600) continue;
    const a = .35 + .25 * Math.sin(now / 300 + th.x);
    ctx.globalAlpha = a; ctx.drawImage(GLOW_LAMP, th.x - camX - 22, th.y - camY - 26); ctx.globalAlpha = 1;
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
  const hudHtml = `${t('bridges')}: ${n}/3 · ${t('secrets')}: ${items.filter(i => i.found).length}/5 · ${fmt(((state === 'won' ? wonAt : now) - t0) / 1000)}${p.run ? ' · ' + t('run') : ''}${p.lamp ? '' : ' · ' + t('lampOffShort')}${senseCd > 0 ? ' · ' + t('senseShort') + ' ' + Math.ceil(senseCd) : ''}<div class="warm"><b>${label}</b><div class="bar"><i style="width:${Math.round(p.warm)}%;background:${col}"></i></div></div>`;
  if (hudHtml !== lastHud) { hud.innerHTML = hudHtml; lastHud = hudHtml; }
  const task = state === 'won' ? t('taskDone') : t('task' + n);
  if (task !== lastTask) { taskEl.innerHTML = `<b>${t('task')}</b>${task}`; lastTask = task; }   // перестраиваем HUD, только когда он изменился
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
  const mineLocal = local.filter(r => r.diff === diff);
  let list;
  if (shared) {
    list = Object.entries(shared).filter(([, r]) => r.v === MAPV && typeof r[diff] === 'number').map(([id, r]) => ({nick: String(r.nick || t('player')).slice(0, 16), ms: r[diff], me: id === uid}));
    const myShared = list.find(r => r.me), myBest = mineLocal.reduce((m, r) => r.ms < m.ms ? r : m, {ms: Infinity});
    if (myBest.ms < Infinity && (!myShared || myBest.ms < myShared.ms)) {   // своя строка — лучший результат, где бы он ни был сохранён
      list = list.filter(r => !r.me); list.push({nick: myBest.nick, ms: myBest.ms, me: true});
    }
  } else list = mineLocal.map(r => ({nick: r.nick, ms: r.ms, me: false}));
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
    const best = typeof mine[diff] === 'number' ? mine[diff] : Infinity;   // null <= ms в JS — true, из-за этого рекорд не писался
    if (ms < best || mine.nick !== nick) {
      const body = {v: MAPV, nick, easy: mine.easy ?? null, normal: mine.normal ?? null, hard: mine.hard ?? null};
      body[diff] = Math.min(ms, best);
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
  p.x = START.x; p.y = START.y; p.warm = 100; p.dir = -Math.PI * .75; p.grace = 2; p.onBr = null; p.lamp = true;
  placeItems(); placeThermos(); spawnHunters();
  spawnEnemies(); resetMoto(); prints.length = 0; breath.length = 0;
  for (const k in keys) keys[k] = false;
  windR = D.light;
};
const resumeGame = () => {
  if (!pausedFrom) return;
  t0 += last - pausedAt;                                   // время в паузе не считается
  state = pausedFrom; pausedFrom = null;
  for (const k in keys) keys[k] = false;
  menu.hidden = true; hud.hidden = false; document.getElementById('hint').hidden = false; document.body.classList.add('playing');
  menuMusic(false);
};
const startGame = () => {
  wake(); pausedFrom = null;
  store.set('tma_nick', nickIn.value.trim().slice(0, 16));
  D = DIFFS[diff]; attempts = 1;
  resetWorld();
  menu.hidden = true; hud.hidden = false; document.getElementById('hint').hidden = false; document.body.classList.add('playing');
  menuMusic(false); p.lamp = true; lampBtn.classList.remove('on'); senseCd = 0; senseT = 0; playT = 0; senseUsed = false; tipQ = []; tipT = 0; tipEl.classList.remove('on');
  startCine('intro');
};
let pausedFrom = null, pausedAt = 0;
const resumeBtn = document.getElementById('resume'), goBtn = document.getElementById('go');
const openMenu = (pause = false) => {
  pausedFrom = pause ? state : null; pausedAt = last;      // запоминаем, где остановились
  resumeBtn.hidden = !pause;
  goBtn.textContent = pause ? t('restart') : t('start');
  goBtn.classList.toggle('ghost', pause);
  state = 'menu'; danger = false; menuMusic(true);
  menu.hidden = false; hud.hidden = true; document.getElementById('hint').hidden = true; document.body.classList.remove('playing');
  joy = null; joyId = null; knob.style.transform = ''; keys.run = false; runBtn.classList.remove('on');
  msg.style.opacity = 0; msgTimer = 0; tipEl.classList.remove('on'); tipT = 0;
  renderBoard();
};
const applyLang = () => {
  document.documentElement.lang = lang;
  document.title = t('title');
  for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
  nickIn.placeholder = t('nickPh');
  document.getElementById('hint').textContent = t('hint');
  runBtn.textContent = t('runBtn'); pauseBtn.setAttribute('aria-label', t('pause'));
  lampBtn.textContent = t('lampBtn'); senseBtn.textContent = t('senseBtn'); document.getElementById('cineSkip').textContent = t('skip');
  for (const b of document.querySelectorAll('#lang button')) b.setAttribute('aria-pressed', b.dataset.l === lang);
  sndBtn.textContent = muted ? t('sndOff') : t('sndOn');
  if (pausedFrom) goBtn.textContent = t('restart');
  renderDiffs(); renderBoard();
};
for (const b of document.querySelectorAll('#lang button')) b.addEventListener('click', () => { lang = b.dataset.l; store.set('tma_lang', lang); applyLang(); });
placeItems(); placeThermos(); spawnHunters();
document.getElementById('go').addEventListener('click', startGame);
resumeBtn.addEventListener('click', resumeGame);
menu.addEventListener('pointerdown', wake);          // музыка меню включается с первого касания
applyLang();
spawnEnemies();

// Слабое устройство: если в игре стабильно меньше ~40 кадров/с, включаем лёгкую графику (маска темноты грубее, чужие лучи без теней)
let lowFx = false, fpsT = 0, fpsN = 0;
const frame = now => {
  const raw = (now - last) / 1000, dt = Math.min(raw, .05); last = now;
  if (state === 'play' && !lowFx && raw < .5) {
    fpsT += raw; fpsN++;
    if (fpsT > 4) { if (fpsN / fpsT < 40) lowFx = true; fpsT = 0; fpsN = 0; }
  }
  if (t0 < 0) t0 = now;
  const was = state;
  update(dt, now);
  if (was !== 'won' && state === 'won') wonAt = now;
  if ((msgTimer -= dt) <= 0) msg.style.opacity = 0;
  if (state === 'cine' && cine) drawCine(now, dt); else draw(now);
  requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
}
