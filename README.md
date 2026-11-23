# Return Home · Дорога домой

A small atmospheric browser game. It is a winter night in a Siberian village, and you have to walk home in total darkness across three bridges without being caught.

**Play:** https://3dendroid.github.io/return-home/

![Main menu](docs/menu.png)

## Story

A winter evening, around ten o'clock. You walk from Verkhneusinskoye to Nizhneusinskoye, two real villages on the Us river in Krasnoyarsk Krai. It is dark and freezing, and it is best if nobody sees you on the way. Home is the house with a green roof and two lit windows, in the far north-east corner of Nizhneusinskoye.

The map follows the real route on Google Maps: out of Verkhneusinskoye to the north-west, over a side channel, across the floodplain, over the Us, north through the forest, over the last channel and through the streets of Nizhneusinskoye to the far side of the village.

![Gameplay](docs/gameplay.png)

## Story scenes

The cutscenes are drawn as silhouettes against warm light, with layered parallax, snow and slow camera moves. The game opens with four short scenes: ten to ten at his aunt's house, the boy at the window missing his grandmother; the locked door; from outside, he breaks the glass, climbs out and runs off barefoot; then darkness closes in around him. It ends at grandma's green-roofed house: her silhouette with a mug in the lit window, then the door creaks open and she stands on the porch with open arms. Click or press Space to advance, Esc to skip.

## How to play

| Key | Action |
|---|---|
| WASD / arrows | Walk |
| Shift | Run (faster, but enemies hear you from further away) |
| F | Flashlight on/off. It shines as a beam where the boy faces; houses cast shadows. Off: harder to spot, but you see little and freeze faster |
| H | Sense: an arrow points to the nearest hidden secret; once all five are found, it leads you back to the road and along it home (costs warmth, 8 s cooldown) |
| Hold mouse | Walk towards the pointer |
| Phone | On-screen stick, plus Run, Light, Sense and pause buttons |
| Esc | Pause: continue or restart |
| M | Sound on / off |

The current objective is shown in the top-right corner. You only see what is inside your lantern's circle of light. Lit windows, other people's lanterns and wolves' eyes are visible from far away.

## What tries to stop you

- **Cold.** Warmth drains all the time. Lit windows warm you up; every bridge restores it fully. The wind on the Us bridge drains it four times faster and pushes you sideways.
- **Dogs** sit in village yards. They hear footsteps nearby and running from far away, then chase and bark. A dog caught in your flashlight beam yelps and backs off.
- **Wolves** roam the forest and the floodplain. You only see their eyes. They are faster than walking but slower than running. Like dogs, they back away from your flashlight beam.
- **Grown-ups with lanterns** patrol village streets. If you step into the beam, the grown-up stops, calls out "Hey!" (an orange "!" appears) and follows you with the light; get out of the beam in about a second, or you are caught. Bumping right into one still ends the run.
- **Hunters** stand in the forest and the floodplain with a flashlight on the rifle, sweeping the beam towards the road. If you step into the beam they aim (a red beam and a "!"); get out before the shot. Lantern and rifle beams do not pass through houses, so a house is safe cover from adults and hunters.
- **Your uncle on a sidecar motorbike** rides up and down the forest road before the last bridge, with a long bright headlight. You hear the engine getting closer, panned left or right. Step off the road and stay out of the headlight: if it catches you, he brakes, shouts and you have about a second to get out of the beam.
- **Rivers.** Walk into the water from the bank and you drown. Bridges have railings, so you cannot fall off them; planks creak under your feet.

Enemies are placed randomly on every run.

## Hot tea

Thermoses with hot tea lie off the road in random places; each one restores all your warmth. Easy has 5, Normal 3, Hard 1.

## Secrets

Five things are hidden off the road, one in each part of the map, in new places on every run: a mitten, a sled, a cedar cone, a coin and a whistle. A faint sparkle gives one away when you are close. The count is shown in the HUD and on the win screen. Find all five and the ending gets one more scene: by the stove, the boy lays out what he found and Grandma strokes his hair.

Barking, howling and gunshots come from the left or right, so you can hear where danger is. The river is audible only near the water, and footsteps sound different on loose snow, the packed road and creaking bridge planks. You leave footprints that slowly fade, your breath steams in the cold, and when you are freezing frost creeps in from the screen edges, the lantern dims and the picture shivers. Bridges are checkpoints: if you lose, you go back to the last bridge you crossed.

New players get short one-time tips the first time they meet something: a dog or wolf (use the flashlight), a grown-up, a hunter, the cold, the first secret, the motorbike, or getting lost (use your sense). Each tip shows once per browser.

## Difficulty

| | Easy | Normal | Hard |
|---|---|---|---|
| Cold | 0.7× | 1× | 1.4× |
| Light radius | 210 | 180 | 150 |
| Enemy speed | 0.85× | 1× | 1.1× |
| Enemy hearing | 0.8× | 1× | 1.25× |
| Dogs / wolves / lantern patrols | 10 / 8 / 4 | 14 / 11 / 6 | 18 / 15 / 8 |
| Hunters (beam range, aim time) | 2 (250, 1.3 s) | 3 (300, 1 s) | 5 (350, 0.75 s) |

## Leaderboard

Your best times are saved in the browser (`localStorage`), per difficulty. The copy of the game published as a claude.ai artifact also has a shared board for everyone it is shared with; on GitHub Pages the board is local to your device.

## Tech

- Plain HTML, CSS and JavaScript, no frameworks, no build step, no image files. Recorded sounds (footsteps, bridge planks, gunshot, breaking glass, motorbike engine) are embedded in `sounds.js` as base64 MP3.
- Rendering: Canvas 2D, top-down. Darkness is a mask with a small circle around the boy and a flashlight beam where he faces; houses cast shadows for every lantern. On slow devices the game switches to lighter graphics by itself.
- Sound: Web Audio API. The recordings above are mixed with synthesized sounds: the river, menu music, barking, howling, the "Hey!" call, the chase theme, win and lose tunes.
- Languages: Russian and English, switchable in the menu.

```
index.html   page markup and menu
style.css    menu and HUD styles
game.js      map, enemies, audio, rendering, menu and leaderboard logic
docs/        screenshots and the map overview
```

### Run locally

```bash
git clone https://github.com/3dendroid/return-home.git
cd return-home
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly from disk also works.

![Map overview](docs/map.png)

*Map overview without darkness: start (blue circle), bridges (orange), home (green frame), secrets (purple); red, orange and yellow mark one random set of wolves, dogs and lantern patrols.*

---

**RU.** Атмосферная браузерная игра: зимняя ночь, полная темнота, путь пешком из Верхнеусинского в Нижнеусинское (Красноярский край) через три моста. Мешают холод, собаки, волки, взрослые с фонарями и река. По пути спрятаны пять секретов. Карта повторяет реальный маршрут. Есть три уровня сложности, доска почёта, русский и английский язык.
