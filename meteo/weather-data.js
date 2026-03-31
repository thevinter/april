/* ==========================================================
   AZEROTH WEATHER SERVICE — Core Data & Shared Logic
   ========================================================== */

// ---- Day names ----
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// ---- Weather icons (unicode) ----
const ICONS = {
  sunny:     '☀️',
  partcloud: '⛅',
  cloudy:    '☁️',
  rain:      '🌧️',
  storm:     '⛈️',
  snow:      '❄️',
  blizzard:  '🌨️',
  fog:       '🌫️',
  fire:      '🔥',
  tornado:   '🌪️',
  flood:     '🌊',
  hot:       '🌡️',
  volcano:   '🌋',
  plague:    '☠️',
  perfect:   '🌈',
  dust:      '💨',
  spore:     '🍄',
  undead:    '💀',
  chat:      '💬',
};

// ---- Zone database (all temperatures in °C) ----
const ZONES = {
  durotar: {
    name: "Durotar",
    region: "Kalimdor — Horde Territory",
    continent: "Kalimdor",
    faction: "Horde",
    currentIcon: ICONS.hot,
    currentCondition: "Scorching & Cloudless",
    currentTemp: 48,
    feelsLike: 51,
    oldGodProximity: "Low (nearest: C'Thun, 2 zones away)",
    oldGodModifier: "+3°C ambient dread",
    humidity: "0%",
    wind: "S 13 km/h — hot and gritty",
    pressure: "30.2 APU (Arcane Pressure Units)",
    uvIndex: "11 — Extreme (Orc sunburn risk: moderate)",
    visibility: "Excellent (19 km)",
    dewPoint: "— (concept does not apply here)",
    rainChance: "0%",
    forecast: [
      { cond: "Scorching", icon: ICONS.hot, hi: 48, lo: 33, hum: "0%", wind: "S 10" },
      { cond: "Scorching", icon: ICONS.sunny, hi: 49, lo: 34, hum: "0%", wind: "S 6" },
      { cond: "Scorching", icon: ICONS.hot, hi: 47, lo: 32, hum: "0%", wind: "SW 13" },
      { cond: "Still Scorching", icon: ICONS.sunny, hi: 49, lo: 33, hum: "0%", wind: "S 8" },
      { cond: "Scorching (surprise)", icon: ICONS.hot, hi: 50, lo: 35, hum: "0%", wind: "S 5" },
      { cond: "Scorching", icon: ICONS.sunny, hi: 48, lo: 32, hum: "0%", wind: "SE 11" },
      { cond: "Scorching Forever", icon: ICONS.hot, hi: 51, lo: 34, hum: "0%", wind: "S 10" },
    ],
    alerts: [
      { type: "warning", label: "EXTREME HEAT WARNING", detail: "Temperatures exceeding 46°C for the 4,387th consecutive day. Hydrate or die. Water vendors in Orgrimmar price-gouging as usual." },
    ],
    specialMetric: { label: "Cactus Apple Ripeness Index", value: "Overripe", level: "high" },
  },

  winterspring: {
    name: "Winterspring",
    region: "Kalimdor — Contested (but mostly just cold)",
    continent: "Kalimdor",
    faction: "Contested",
    currentIcon: ICONS.blizzard,
    currentCondition: "Blizzard — Whiteout Conditions",
    currentTemp: -33,
    feelsLike: -46,
    oldGodProximity: "Moderate (Y'Shaarj residual corruption, 3 zones)",
    oldGodModifier: "-13°C existential chill",
    humidity: "94%",
    wind: "NW 72 km/h — gusting to 109",
    pressure: "28.1 APU (dangerously low)",
    uvIndex: "0 — None (sun hasn't been seen since the Second War)",
    visibility: "Near zero (5 m)",
    dewPoint: "N/A (everything is already frozen)",
    rainChance: "100% (as snow)",
    forecast: [
      { cond: "Blizzard", icon: ICONS.blizzard, hi: -31, lo: -41, hum: "95%", wind: "NW 80" },
      { cond: "Heavy Snow", icon: ICONS.snow, hi: -29, lo: -39, hum: "90%", wind: "N 64" },
      { cond: "Blizzard", icon: ICONS.blizzard, hi: -34, lo: -44, hum: "97%", wind: "NW 89" },
      { cond: "Severe Blizzard", icon: ICONS.blizzard, hi: -37, lo: -47, hum: "98%", wind: "N 100" },
      { cond: "Snow", icon: ICONS.snow, hi: -28, lo: -37, hum: "88%", wind: "NE 48" },
      { cond: "Blizzard", icon: ICONS.blizzard, hi: -32, lo: -42, hum: "93%", wind: "NW 77" },
      { cond: "Eternal Blizzard", icon: ICONS.blizzard, hi: -36, lo: -46, hum: "96%", wind: "N 93" },
    ],
    alerts: [
      { type: "danger", label: "BLIZZARD WARNING", detail: "Whiteout conditions persist across all of Winterspring. Travel is impossible. This is not new information. We issue this alert every single day." },
      { type: "warning", label: "AVALANCHE WATCH", detail: "Frostsaber Rock and surrounding peaks. Do not aggro the Frostsabers. They are also cold and angry." },
    ],
    specialMetric: { label: "Frostbite Risk", value: "Certain", level: "extreme" },
  },

  "thousand-needles": {
    name: "Thousand Needles",
    region: "Kalimdor — Formerly a canyon, now a lake",
    continent: "Kalimdor",
    faction: "Contested",
    currentIcon: ICONS.flood,
    currentCondition: "Flooded — Permanent",
    currentTemp: 26,
    feelsLike: 32,
    oldGodProximity: "Moderate (C'Thun, 1 zone south)",
    oldGodModifier: "+6°C eldritch humidity",
    humidity: "100%",
    wind: "Calm — water surface still",
    pressure: "29.8 APU (waterlogged)",
    uvIndex: "7 — High (water reflection doubles exposure)",
    visibility: "Good above water, 0 below",
    dewPoint: "You're IN the dew",
    rainChance: "Irrelevant — already submerged",
    forecast: [
      { cond: "Flooded", icon: ICONS.flood, hi: 26, lo: 20, hum: "100%", wind: "Calm" },
      { cond: "Still Flooded", icon: ICONS.flood, hi: 27, lo: 21, hum: "100%", wind: "Calm" },
      { cond: "Flooded (tides rising)", icon: ICONS.flood, hi: 25, lo: 19, hum: "100%", wind: "E 5" },
      { cond: "Flooded", icon: ICONS.flood, hi: 27, lo: 21, hum: "100%", wind: "Calm" },
      { cond: "Very Flooded", icon: ICONS.flood, hi: 26, lo: 19, hum: "100%", wind: "Calm" },
      { cond: "Flooded Forever", icon: ICONS.flood, hi: 28, lo: 22, hum: "100%", wind: "SE 3" },
      { cond: "Flooded (fish report: good)", icon: ICONS.flood, hi: 26, lo: 20, hum: "100%", wind: "Calm" },
    ],
    alerts: [
      { type: "flood", label: "FLOOD ADVISORY", detail: "Permanent flood advisory in effect since the Cataclysm. The Speedbarge remains operational. Swim at your own risk. Piranhas reported." },
      { type: "info", label: "MARINE ADVISORY", detail: "River boats from Freewind Post are running 3 hours behind schedule. Cause: the entire zone is underwater." },
    ],
    specialMetric: { label: "Water Level", value: "Yes", level: "extreme" },
  },

  darkshore: {
    name: "Darkshore",
    region: "Kalimdor — Night Elf Territory (disputed, burning)",
    continent: "Kalimdor",
    faction: "Contested",
    currentIcon: ICONS.fire,
    currentCondition: "On Fire",
    currentTemp: 760,
    feelsLike: 871,
    oldGodProximity: "High (N'Zoth corruption vectors active)",
    oldGodModifier: "+111°C corruption heat",
    humidity: "0% (evaporated)",
    wind: "Firestorm — 129 km/h updrafts",
    pressure: "Unmeasurable (instruments melted)",
    uvIndex: "∞ — (the fire IS the light source)",
    visibility: "15 m (heavy smoke)",
    dewPoint: "Vaporized",
    rainChance: "0% — rain evaporates before reaching ground",
    forecast: [
      { cond: "Fire", icon: ICONS.fire, hi: 760, lo: 482, hum: "0%", wind: "Firestorm" },
      { cond: "More Fire", icon: ICONS.fire, hi: 816, lo: 510, hum: "0%", wind: "Firestorm" },
      { cond: "Fire (patch 8.1)", icon: ICONS.fire, hi: 788, lo: 493, hum: "0%", wind: "Firestorm" },
      { cond: "Still on Fire", icon: ICONS.fire, hi: 749, lo: 471, hum: "0%", wind: "Firestorm" },
      { cond: "More Fire (patch 8.2)", icon: ICONS.fire, hi: 843, lo: 527, hum: "0%", wind: "Inferno" },
      { cond: "Somehow Even More Fire", icon: ICONS.fire, hi: 871, lo: 538, hum: "0%", wind: "Inferno" },
      { cond: "Fire", icon: ICONS.fire, hi: 771, lo: 488, hum: "0%", wind: "Firestorm" },
    ],
    alerts: [
      { type: "danger", label: "FIRE ADVISORY — EXTREME", detail: "Teldrassil burn zone has expanded to all of Darkshore. Cause: Sylvanas-related incident. Insurance claims are being denied. This is not a drill." },
      { type: "danger", label: "AIR QUALITY ALERT", detail: "Air Quality Index: 947 (Hazardous). Breathing is not recommended. Ghost elves report 'it still hurts somehow.'" },
    ],
    specialMetric: { label: "Teldrassil Burn Status", value: "Still Burning", level: "extreme" },
  },

  "elwynn-forest": {
    name: "Elwynn Forest",
    region: "Eastern Kingdoms — Alliance Heartland",
    continent: "Eastern Kingdoms",
    faction: "Alliance",
    currentIcon: ICONS.sunny,
    currentCondition: "Pleasant & Sunny",
    currentTemp: 22,
    feelsLike: 21,
    oldGodProximity: "Very Low (no known Old God activity)",
    oldGodModifier: "-1°C (blessed by the Light)",
    humidity: "45%",
    wind: "W 10 km/h — gentle breeze",
    pressure: "30.1 APU (stable, as always)",
    uvIndex: "5 — Moderate",
    visibility: "Excellent (32 km)",
    dewPoint: "11°C",
    rainChance: "10%",
    forecast: [
      { cond: "Sunny & Pleasant", icon: ICONS.sunny, hi: 23, lo: 12, hum: "42%", wind: "W 8" },
      { cond: "Partly Cloudy", icon: ICONS.partcloud, hi: 22, lo: 11, hum: "48%", wind: "SW 11" },
      { cond: "Sunny", icon: ICONS.sunny, hi: 23, lo: 13, hum: "40%", wind: "W 6" },
      { cond: "Pleasant", icon: ICONS.sunny, hi: 22, lo: 12, hum: "44%", wind: "NW 10" },
      { cond: "Mostly Sunny", icon: ICONS.partcloud, hi: 21, lo: 11, hum: "50%", wind: "W 13" },
      { cond: "Suspiciously Perfect", icon: ICONS.sunny, hi: 23, lo: 12, hum: "43%", wind: "W 8" },
      { cond: "Idyllic (wolf advisory)", icon: ICONS.sunny, hi: 23, lo: 13, hum: "41%", wind: "SW 10" },
    ],
    alerts: [
      { type: "info", label: "WOLF ADVISORY", detail: "Elevated wolf activity near Northshire and Goldshire. Level 5–7 wolves spotted crossing roads. Adventurers below level 10 should use caution." },
    ],
    specialMetric: { label: "Kobold Candle Index", value: "You no take!", level: "medium" },
  },

  westfall: {
    name: "Westfall",
    region: "Eastern Kingdoms — Alliance (barely governed)",
    continent: "Eastern Kingdoms",
    faction: "Alliance",
    currentIcon: ICONS.dust,
    currentCondition: "Dusty with Tornado Watch",
    currentTemp: 31,
    feelsLike: 34,
    oldGodProximity: "Low-Moderate (Twilight's Hammer operatives in area)",
    oldGodModifier: "+3°C paranoia sweat",
    humidity: "12%",
    wind: "SW 35 km/h — gusting to 64 (Harvest Golem turbulence)",
    pressure: "29.4 APU (dropping — storm formation likely)",
    uvIndex: "9 — Very High (no shade, no trees, no hope)",
    visibility: "6 km (dust haze)",
    dewPoint: "Dust",
    rainChance: "3% — and the crops need it desperately",
    forecast: [
      { cond: "Dust & Wind", icon: ICONS.dust, hi: 32, lo: 18, hum: "10%", wind: "SW 40" },
      { cond: "Tornado Watch", icon: ICONS.tornado, hi: 33, lo: 20, hum: "15%", wind: "SW 56" },
      { cond: "Dusty", icon: ICONS.dust, hi: 31, lo: 17, hum: "8%", wind: "W 32" },
      { cond: "Harvest Golem Gale", icon: ICONS.tornado, hi: 33, lo: 19, hum: "11%", wind: "SW 64" },
      { cond: "Blowing Dust", icon: ICONS.dust, hi: 32, lo: 18, hum: "9%", wind: "SW 45" },
      { cond: "Dry & Desolate", icon: ICONS.sunny, hi: 34, lo: 21, hum: "7%", wind: "W 29" },
      { cond: "Tornado Watch (again)", icon: ICONS.tornado, hi: 31, lo: 19, hum: "14%", wind: "SW 61" },
    ],
    alerts: [
      { type: "warning", label: "TORNADO WATCH", detail: "Westfall, Sentinel Hill area. Cause: Harvest Golem malfunction creating localized wind shear. The Defias Brotherhood denies involvement. Nobody believes them." },
      { type: "info", label: "DUST ADVISORY", detail: "Airborne topsoil concentration elevated. Farmers reminded: there is no topsoil left. You are breathing what used to be your field." },
    ],
    specialMetric: { label: "Crop Yield Forecast", value: "Nonexistent", level: "extreme" },
  },

  stranglethorn: {
    name: "Stranglethorn Vale",
    region: "Eastern Kingdoms — Contested Jungle",
    continent: "Eastern Kingdoms",
    faction: "Contested",
    currentIcon: ICONS.storm,
    currentCondition: "Tropical Storm — Heavy Rain",
    currentTemp: 32,
    feelsLike: 41,
    oldGodProximity: "Low (Hakkar was bad enough)",
    oldGodModifier: "+9°C oppressive humidity bonus",
    humidity: "98%",
    wind: "E 48 km/h — tropical storm force",
    pressure: "28.8 APU (tropical depression forming)",
    uvIndex: "3 — Moderate (canopy cover helps)",
    visibility: "1.6 km (rain + jungle canopy)",
    dewPoint: "31°C (the air is soup)",
    rainChance: "100%",
    forecast: [
      { cond: "Tropical Storm", icon: ICONS.storm, hi: 32, lo: 26, hum: "97%", wind: "E 51" },
      { cond: "Heavy Rain", icon: ICONS.rain, hi: 31, lo: 24, hum: "98%", wind: "E 40" },
      { cond: "Thunderstorms", icon: ICONS.storm, hi: 33, lo: 26, hum: "96%", wind: "SE 45" },
      { cond: "Raptor Migration Rain", icon: ICONS.rain, hi: 31, lo: 25, hum: "99%", wind: "E 32" },
      { cond: "Monsoon", icon: ICONS.storm, hi: 32, lo: 26, hum: "100%", wind: "E 56" },
      { cond: "Tropical Downpour", icon: ICONS.rain, hi: 31, lo: 24, hum: "98%", wind: "SE 35" },
      { cond: "Storm (pirate advisory)", icon: ICONS.storm, hi: 32, lo: 26, hum: "97%", wind: "E 48" },
    ],
    alerts: [
      { type: "warning", label: "TROPICAL STORM WARNING", detail: "Tropical Storm 'Hemet' (named after Hemet Nesingwary) making landfall at Booty Bay. All ships in harbor advised to secure moorings." },
      { type: "info", label: "RAPTOR MIGRATION ALERT", detail: "Seasonal raptor migration underway. Raptors do not follow weather advisories. You are in their territory." },
    ],
    specialMetric: { label: "Pirate Threat Level", value: "Elevated", level: "high" },
  },

  tanaris: {
    name: "Tanaris",
    region: "Kalimdor — Steamwheedle Cartel",
    continent: "Kalimdor",
    faction: "Contested",
    currentIcon: ICONS.hot,
    currentCondition: "Extreme Heat — Sandstorm Possible",
    currentTemp: 56,
    feelsLike: 59,
    oldGodProximity: "Low (C'Thun is next door but underground)",
    oldGodModifier: "+3°C sand-madness factor",
    humidity: "2%",
    wind: "SW 24 km/h — sand-laden",
    pressure: "30.4 APU (high pressure dome)",
    uvIndex: "12+ — Extreme (sand reflection adds +3)",
    visibility: "3 km (sand haze) to 0 (during sandstorm)",
    dewPoint: "What's dew?",
    rainChance: "0.1% (recorded once in Year 14)",
    forecast: [
      { cond: "Extreme Heat", icon: ICONS.hot, hi: 57, lo: 37, hum: "2%", wind: "SW 19" },
      { cond: "Sandstorm", icon: ICONS.dust, hi: 53, lo: 35, hum: "5%", wind: "SW 72" },
      { cond: "Scorching", icon: ICONS.hot, hi: 58, lo: 38, hum: "1%", wind: "S 16" },
      { cond: "Extreme Heat", icon: ICONS.sunny, hi: 54, lo: 36, hum: "3%", wind: "SW 23" },
      { cond: "Sandstorm Warning", icon: ICONS.dust, hi: 52, lo: 33, hum: "6%", wind: "W 80" },
      { cond: "Blistering", icon: ICONS.hot, hi: 59, lo: 39, hum: "1%", wind: "S 13" },
      { cond: "Extreme Heat (Gadgetzan melting)", icon: ICONS.hot, hi: 57, lo: 37, hum: "2%", wind: "SW 18" },
    ],
    alerts: [
      { type: "danger", label: "EXTREME HEAT WARNING", detail: "Tanaris Desert experiencing record temperatures. Gadgetzan water prices up 400%. The Bronze Dragonflight swears this is 'normal for the timeline.'" },
      { type: "warning", label: "SANDSTORM WARNING", detail: "Major sandstorm forming west of Gadgetzan. Visibility will drop to zero. Zul'Farrak entrance may be buried again." },
    ],
    specialMetric: { label: "Sand-in-Boots Index", value: "Critical", level: "extreme" },
  },

  ungoro: {
    name: "Un'Goro Crater",
    region: "Kalimdor — Titan Facility (outdoor section)",
    continent: "Kalimdor",
    faction: "Contested",
    currentIcon: ICONS.volcano,
    currentCondition: "Volcanic Haze — Primordial Humidity",
    currentTemp: 35,
    feelsLike: 48,
    oldGodProximity: "Unknown (Titan interference blocks readings)",
    oldGodModifier: "+13°C primordial soup bonus",
    humidity: "88%",
    wind: "Variable 8–24 km/h — volcanic updrafts",
    pressure: "29.6 APU (geothermally unstable)",
    uvIndex: "6 — High (filtered by volcanic haze)",
    visibility: "5 km (steam and volcanic fog)",
    dewPoint: "33°C (prehistoric moisture)",
    rainChance: "40% (acid rain from Fire Plume Ridge)",
    forecast: [
      { cond: "Volcanic Haze", icon: ICONS.volcano, hi: 36, lo: 28, hum: "90%", wind: "Var 16" },
      { cond: "Primordial Steam", icon: ICONS.fog, hi: 34, lo: 27, hum: "92%", wind: "Var 13" },
      { cond: "Eruption Risk", icon: ICONS.volcano, hi: 37, lo: 29, hum: "85%", wind: "S 19" },
      { cond: "Steamy & Prehistoric", icon: ICONS.fog, hi: 35, lo: 27, hum: "88%", wind: "Var 10" },
      { cond: "Volcanic Activity", icon: ICONS.volcano, hi: 37, lo: 29, hum: "86%", wind: "S 24" },
      { cond: "Tar Pit Fog", icon: ICONS.fog, hi: 34, lo: 26, hum: "91%", wind: "Calm" },
      { cond: "Devilsaur Weather", icon: ICONS.volcano, hi: 36, lo: 28, hum: "89%", wind: "Var 18" },
    ],
    alerts: [
      { type: "warning", label: "VOLCANIC ACTIVITY ALERT", detail: "Fire Plume Ridge showing elevated seismic readings. Minor eruptions possible. Devilsaurs are acting more irritable than usual (yes, more)." },
      { type: "info", label: "ACID RAIN ADVISORY", detail: "Precipitation near Fire Plume Ridge has pH of 2.1. Do not drink the rain. Do not collect the rain. The rain is angry." },
    ],
    specialMetric: { label: "Devilsaur Agitation Level", value: "Highly Agitated", level: "high" },
  },

  tirisfal: {
    name: "Tirisfal Glades",
    region: "Eastern Kingdoms — Undead Territory",
    continent: "Eastern Kingdoms",
    faction: "Horde",
    currentIcon: ICONS.plague,
    currentCondition: "Overcast — Plague Wind Advisory",
    currentTemp: 9,
    feelsLike: -1,
    oldGodProximity: "VERY HIGH (something sleeps beneath Tirisfal)",
    oldGodModifier: "-10°C soul-draining cold",
    humidity: "78%",
    wind: "N 19 km/h — carries plague spores",
    pressure: "29.0 APU (unnaturally low — corruption suspected)",
    uvIndex: "1 — Low (perpetual cloud cover)",
    visibility: "3 km (fog and blight mist)",
    dewPoint: "It's not dew. Don't touch it.",
    rainChance: "35% — the rain glows green",
    forecast: [
      { cond: "Overcast & Blighted", icon: ICONS.plague, hi: 9, lo: 1, hum: "80%", wind: "N 16" },
      { cond: "Plague Fog", icon: ICONS.fog, hi: 8, lo: 0, hum: "85%", wind: "NE 13" },
      { cond: "Gloomy", icon: ICONS.cloudy, hi: 10, lo: 2, hum: "75%", wind: "N 19" },
      { cond: "Plague Drizzle", icon: ICONS.plague, hi: 8, lo: 1, hum: "82%", wind: "N 23" },
      { cond: "Overcast (green tint)", icon: ICONS.cloudy, hi: 9, lo: 2, hum: "78%", wind: "NE 16" },
      { cond: "Blight Mist", icon: ICONS.plague, hi: 7, lo: -1, hum: "88%", wind: "N 26" },
      { cond: "Perpetually Gloomy", icon: ICONS.cloudy, hi: 9, lo: 1, hum: "77%", wind: "N 18" },
    ],
    alerts: [
      { type: "danger", label: "PLAGUE WIND ADVISORY", detail: "Northerly winds carrying residual Blight from Undercity ruins. Living beings advised to wear N95 masks (minimum). Undead beings: enjoy the aroma." },
      { type: "warning", label: "PARANORMAL FOG WARNING", detail: "Dense fog with reported whispers. This is normal for Tirisfal. The whispers are not threatening (this time)." },
    ],
    specialMetric: { label: "Plague Spore Count", value: "Lethal", level: "extreme" },
  },

  zangarmarsh: {
    name: "Zangarmarsh",
    region: "Outland — Contested Marshlands",
    continent: "Outland",
    faction: "Contested",
    currentIcon: ICONS.spore,
    currentCondition: "Humid — Spore Storm",
    currentTemp: 20,
    feelsLike: 28,
    oldGodProximity: "N/A (different dimension, but Lady Vashj was creepy enough)",
    oldGodModifier: "+8°C spore-related discomfort",
    humidity: "100%",
    wind: "Calm — spores drift lazily",
    pressure: "29.2 APU (marshy)",
    uvIndex: "2 — Low (bioluminescent mushrooms provide light)",
    visibility: "8 km (spore haze)",
    dewPoint: "20°C (100% saturation)",
    rainChance: "70% — mushroom drip counts as rain",
    forecast: [
      { cond: "Spore Drift", icon: ICONS.spore, hi: 21, lo: 17, hum: "100%", wind: "Calm" },
      { cond: "Mushroom Rain", icon: ICONS.rain, hi: 19, lo: 16, hum: "100%", wind: "E 5" },
      { cond: "Spore Storm", icon: ICONS.spore, hi: 21, lo: 17, hum: "100%", wind: "SE 8" },
      { cond: "Bioluminescent Fog", icon: ICONS.fog, hi: 19, lo: 15, hum: "100%", wind: "Calm" },
      { cond: "Heavy Spores", icon: ICONS.spore, hi: 20, lo: 16, hum: "100%", wind: "Calm" },
      { cond: "Marsh Drizzle", icon: ICONS.rain, hi: 19, lo: 16, hum: "100%", wind: "E 6" },
      { cond: "Spore Bloom", icon: ICONS.spore, hi: 22, lo: 18, hum: "100%", wind: "Calm" },
    ],
    alerts: [
      { type: "warning", label: "SPORE COUNT ALERT", detail: "Airborne spore concentration at 8,400 per cubic meter (safe limit: 200). Draenei allergy sufferers: stay indoors. Everyone else: also stay indoors." },
      { type: "flood", label: "MARSH LEVEL ADVISORY", detail: "Water table has risen 5 cm. This is concerning because the ground was already 100% water." },
    ],
    specialMetric: { label: "Spore Count (per m³)", value: "8,400 (safe: 200)", level: "extreme" },
  },

  nagrand: {
    name: "Nagrand",
    region: "Outland — The Last Paradise",
    continent: "Outland",
    faction: "Contested",
    currentIcon: ICONS.perfect,
    currentCondition: "Absolutely Perfect",
    currentTemp: 23,
    feelsLike: 23,
    oldGodProximity: "None (Nagrand is blessed)",
    oldGodModifier: "±0°C (pure, untouched)",
    humidity: "50%",
    wind: "W 13 km/h — warm and gentle",
    pressure: "30.0 APU (perfect equilibrium)",
    uvIndex: "4 — Moderate (floating islands provide shade)",
    visibility: "Unlimited (seriously, it's gorgeous)",
    dewPoint: "12°C (comfortable)",
    rainChance: "15% — gentle and refreshing when it does",
    forecast: [
      { cond: "Perfect", icon: ICONS.perfect, hi: 24, lo: 14, hum: "48%", wind: "W 11" },
      { cond: "Still Perfect", icon: ICONS.sunny, hi: 23, lo: 14, hum: "50%", wind: "W 13" },
      { cond: "Impossibly Perfect", icon: ICONS.perfect, hi: 24, lo: 15, hum: "46%", wind: "NW 10" },
      { cond: "Perfect (again)", icon: ICONS.sunny, hi: 23, lo: 13, hum: "52%", wind: "W 14" },
      { cond: "Perfect", icon: ICONS.perfect, hi: 24, lo: 14, hum: "49%", wind: "W 11" },
      { cond: "Suspiciously Perfect", icon: ICONS.sunny, hi: 23, lo: 14, hum: "50%", wind: "W 13" },
      { cond: "Utopian", icon: ICONS.perfect, hi: 24, lo: 15, hum: "47%", wind: "NW 10" },
    ],
    alerts: [
      { type: "info", label: "NO ALERTS", detail: "There are no weather alerts for Nagrand. There never are. It's perfect here. We don't know why. Don't question it." },
    ],
    specialMetric: { label: "Clefthoof Grazing Conditions", value: "Ideal", level: "low" },
  },

  icecrown: {
    name: "Icecrown",
    region: "Northrend — Domain of the Lich King (former)",
    continent: "Northrend",
    faction: "Contested",
    currentIcon: ICONS.undead,
    currentCondition: "Death Chill — Undead Storm Front",
    currentTemp: -43,
    feelsLike: -67,
    oldGodProximity: "Extreme (Yogg-Saron, 2 zones south in Ulduar)",
    oldGodModifier: "-24°C Yogg-Saron despair chill",
    humidity: "65% (frozen particulate)",
    wind: "N 89 km/h — howling with undead echoes",
    pressure: "27.5 APU (death magic interference)",
    uvIndex: "0 — None (the sky is always wrong here)",
    visibility: "0.8 km (ice fog + wandering geists)",
    dewPoint: "Frozen souls",
    rainChance: "20% (sleet + bone fragments)",
    forecast: [
      { cond: "Death Chill", icon: ICONS.undead, hi: -41, lo: -56, hum: "60%", wind: "N 80" },
      { cond: "Undead Storm", icon: ICONS.undead, hi: -44, lo: -58, hum: "70%", wind: "NE 97" },
      { cond: "Soul Frost", icon: ICONS.snow, hi: -40, lo: -54, hum: "55%", wind: "N 72" },
      { cond: "Lich Wind", icon: ICONS.undead, hi: -46, lo: -59, hum: "68%", wind: "N 93" },
      { cond: "Bone Sleet", icon: ICONS.blizzard, hi: -42, lo: -57, hum: "72%", wind: "NE 84" },
      { cond: "Death Chill", icon: ICONS.undead, hi: -43, lo: -57, hum: "63%", wind: "N 89" },
      { cond: "Eternal Winter", icon: ICONS.undead, hi: -47, lo: -61, hum: "66%", wind: "N 100" },
    ],
    alerts: [
      { type: "danger", label: "UNDEAD STORM FRONT", detail: "Massive necrotic weather system emanating from Icecrown Citadel. Wind carries the screams of the damned. Dress warmly. Bring holy water." },
      { type: "danger", label: "DEATH CHILL WARNING", detail: "Exposed skin will freeze in 30 seconds. Exposed soul will freeze in 15 seconds. The Lich King's throne still radiates cold despite his defeat." },
    ],
    specialMetric: { label: "Undead Activity Index", value: "Critical", level: "extreme" },
  },

  barrens: {
    name: "The Barrens",
    region: "Kalimdor — Horde Leveling Zone",
    continent: "Kalimdor",
    faction: "Horde",
    currentIcon: ICONS.sunny,
    currentCondition: "Dry — Chat Storm Warning",
    currentTemp: 37,
    feelsLike: 40,
    oldGodProximity: "Low (but Barrens chat might be its own Old God)",
    oldGodModifier: "+3°C Barrens Chat headache factor",
    humidity: "8%",
    wind: "SW 16 km/h — dry and endless",
    pressure: "30.3 APU (tediously stable)",
    uvIndex: "10 — Very High (no shade for miles)",
    visibility: "24 km (flat terrain, nothing to see)",
    dewPoint: "Dew doesn't come here",
    rainChance: "2%",
    forecast: [
      { cond: "Dry & Boring", icon: ICONS.sunny, hi: 37, lo: 22, hum: "7%", wind: "SW 13" },
      { cond: "Chat Storm", icon: ICONS.chat, hi: 38, lo: 23, hum: "6%", wind: "SW 16" },
      { cond: "Dry", icon: ICONS.sunny, hi: 36, lo: 21, hum: "9%", wind: "W 19" },
      { cond: "Dry (where is Mankrik's wife?)", icon: ICONS.sunny, hi: 38, lo: 24, hum: "5%", wind: "SW 13" },
      { cond: "Chat Storm Intensifying", icon: ICONS.chat, hi: 37, lo: 23, hum: "8%", wind: "SW 18" },
      { cond: "Dry & Featureless", icon: ICONS.sunny, hi: 38, lo: 23, hum: "6%", wind: "SW 14" },
      { cond: "Dry (day 4,387)", icon: ICONS.sunny, hi: 37, lo: 22, hum: "7%", wind: "SW 16" },
    ],
    alerts: [
      { type: "warning", label: "CHAT STORM WARNING", detail: "Barrens General Chat experiencing severe storm conditions. Topics include: Chuck Norris, where is Mankrik's wife, and why hunters are terrible. Ear protection recommended." },
      { type: "info", label: "DUST ADVISORY", detail: "Light dust across the central Barrens. Also, someone in chat just asked where Mankrik's wife is for the 47th time today. That's not weather-related but we felt you should know." },
    ],
    specialMetric: { label: "Barrens Chat Intensity", value: "Chuck Norris Level", level: "extreme" },
  },
};

// ---- Ordered zone list for dropdowns ----
const ZONE_LIST = [
  { id: "durotar", name: "Durotar" },
  { id: "winterspring", name: "Winterspring" },
  { id: "thousand-needles", name: "Thousand Needles" },
  { id: "darkshore", name: "Darkshore" },
  { id: "elwynn-forest", name: "Elwynn Forest" },
  { id: "westfall", name: "Westfall" },
  { id: "stranglethorn", name: "Stranglethorn Vale" },
  { id: "tanaris", name: "Tanaris" },
  { id: "ungoro", name: "Un'Goro Crater" },
  { id: "tirisfal", name: "Tirisfal Glades" },
  { id: "zangarmarsh", name: "Zangarmarsh" },
  { id: "nagrand", name: "Nagrand" },
  { id: "icecrown", name: "Icecrown" },
  { id: "barrens", name: "The Barrens" },
];

// ---- ALL alerts across all zones (for alerts page) ----
function getAllAlerts() {
  const all = [];
  const times = [
    "2 minutes ago", "15 minutes ago", "38 minutes ago", "1 hour ago",
    "2 hours ago", "3 hours ago", "5 hours ago", "6 hours ago",
    "8 hours ago", "12 hours ago", "1 day ago", "2 days ago",
    "Ongoing since the Cataclysm", "Ongoing since the Burning of Teldrassil",
    "Ongoing since the Lich King's fall", "Permanent",
  ];

  const severities = {
    danger: "Extreme",
    warning: "Severe",
    flood: "Moderate",
    info: "Advisory",
  };

  let tIdx = 0;
  for (const [zoneId, zone] of Object.entries(ZONES)) {
    for (const alert of zone.alerts) {
      all.push({
        zone: zone.name,
        zoneId: zoneId,
        type: alert.type,
        severity: severities[alert.type] || "Advisory",
        label: alert.label,
        detail: alert.detail,
        time: times[tIdx % times.length],
        body: generateAlertBody(zone.name, alert),
      });
      tIdx++;
    }
  }
  return all;
}

function generateAlertBody(zoneName, alert) {
  return `${alert.detail}\n\nIssued by: Azeroth Weather Service — ${zoneName} Regional Office\n` +
    `Valid until: Further notice (or next expansion)\n` +
    `Action recommended: Consult your local innkeeper for shelter options.`;
}

// ---- Get current zone from URL hash ----
function getCurrentZoneId() {
  const hash = window.location.hash.replace('#', '');
  return ZONES[hash] ? hash : 'durotar';
}

function getCurrentZone() {
  return ZONES[getCurrentZoneId()];
}

// ---- Populate zone dropdowns ----
function populateZoneSelects() {
  const selects = document.querySelectorAll('.zone-select');
  const currentId = getCurrentZoneId();
  selects.forEach(sel => {
    sel.innerHTML = '';
    ZONE_LIST.forEach(z => {
      const opt = document.createElement('option');
      opt.value = z.id;
      opt.textContent = z.name;
      if (z.id === currentId) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', () => {
      window.location.hash = sel.value;
      window.location.reload();
    });
  });
}

// ---- Build ticker content ----
function buildTickerContent() {
  const items = [];
  for (const [, zone] of Object.entries(ZONES)) {
    items.push(`<span class="ticker-normal">${zone.name}: ${zone.currentTemp}°C ${zone.currentCondition}</span>`);
    if (zone.alerts.length > 0) {
      items.push(`<span class="ticker-alert">⚠ ${zone.alerts[0].label}: ${zone.name}</span>`);
    }
  }
  // Duplicate for seamless loop
  return items.join('') + items.join('');
}

// ---- Generate hourly forecast (24 hours) ----
function generateHourly(zone) {
  const hours = [];
  const baseTemp = zone.currentTemp;
  const hi = zone.forecast[0].hi;
  const lo = zone.forecast[0].lo;
  const range = hi - lo;
  for (let i = 0; i < 24; i++) {
    // Simple sine curve: coldest at 5am, hottest at 2pm
    const t = (i + 5) % 24;
    const factor = Math.sin((t - 6) * Math.PI / 12);
    const temp = Math.round(lo + range * (factor * 0.5 + 0.5));
    // Vary wind a bit
    const windBase = parseInt(zone.wind) || 10;
    const windSpeed = Math.max(0, windBase + Math.round(Math.sin(i * 0.8) * windBase * 0.3));
    const humBase = parseInt(zone.humidity) || 50;
    const hum = Math.min(100, Math.max(0, humBase + Math.round(Math.sin(i * 0.5) * 10)));
    hours.push({
      hour: String(i).padStart(2, '0') + ':00',
      temp: temp,
      icon: zone.forecast[0].icon,
      cond: zone.forecast[i % 7].cond,
      wind: windSpeed,
      humidity: hum,
      feelsLike: temp + (zone.feelsLike - zone.currentTemp),
    });
  }
  return hours;
}

// ---- Marine data per zone ----
const MARINE_DATA = {
  durotar: {
    coastal: true, seaName: "The Great Sea (Durotar Coast)",
    seaTemp: 28, waveHeight: "0.3 m", tideStatus: "Low tide",
    currentAdvisory: "Minimal surf. Naga sightings reported near Echo Isles. Swimming not advised (sharks, not waves).",
    visibility: "Excellent", swellDir: "SE", swellPeriod: "6s",
  },
  winterspring: {
    coastal: false,
    currentAdvisory: "Winterspring is landlocked. All bodies of water are frozen solid. No marine forecast applicable. The lake hasn't been liquid since Year 3.",
  },
  "thousand-needles": {
    coastal: true, seaName: "Thousand Needles Inland Sea (post-Cataclysm)",
    seaTemp: 24, waveHeight: "0.1 m", tideStatus: "Permanent high tide (forever)",
    currentAdvisory: "The entire zone IS the marine forecast. Speedbarge operations normal. Watch for piranhas. Underwater ruins create unpredictable currents.",
    visibility: "Good (above surface)", swellDir: "None", swellPeriod: "N/A",
  },
  darkshore: {
    coastal: true, seaName: "The Veiled Sea (Darkshore Coast)",
    seaTemp: 94, waveHeight: "4.5 m", tideStatus: "Erratic (fire affecting tidal patterns)",
    currentAdvisory: "EXTREME DANGER. Coastal waters superheated by burning debris from Teldrassil. Steam plumes reaching 30 m. No vessels permitted within 5 km of shore.",
    visibility: "Zero (smoke + steam)", swellDir: "Chaotic", swellPeriod: "Irregular",
  },
  "elwynn-forest": {
    coastal: false,
    currentAdvisory: "Elwynn Forest is landlocked. Nearest coast: Westfall. Crystal Lake fishing conditions: excellent (level 1 fish only).",
  },
  westfall: {
    coastal: true, seaName: "The Great Sea (Westfall Coast)",
    seaTemp: 18, waveHeight: "1.8 m", tideStatus: "Mid tide, rising",
    currentAdvisory: "Moderate surf along the Westfall coastline. Defias pirates spotted near the Jangolode Mine coast. Lighthouse at Longshore still not operational (budget cuts).",
    visibility: "Fair (dust haze extends over water)", swellDir: "SW", swellPeriod: "8s",
  },
  stranglethorn: {
    coastal: true, seaName: "The South Seas (Booty Bay Harbor)",
    seaTemp: 29, waveHeight: "3.2 m", tideStatus: "High tide",
    currentAdvisory: "TROPICAL STORM WARNING for all South Seas traffic. Booty Bay harbor experiencing 3m swells. Pirate fleet from Bloodsail Buccaneers sighted — may be related to storm or just Thursday.",
    visibility: "Poor (driving rain)", swellDir: "E", swellPeriod: "10s",
  },
  tanaris: {
    coastal: true, seaName: "The South Seas (Tanaris Coast)",
    seaTemp: 31, waveHeight: "0.5 m", tideStatus: "Low tide",
    currentAdvisory: "Calm seas belie the extreme heat. Sand drifts making Steamwheedle Port approach difficult. Sea surface temperature approaching bathwater levels.",
    visibility: "Moderate (sand haze)", swellDir: "S", swellPeriod: "5s",
  },
  ungoro: {
    coastal: false,
    currentAdvisory: "Un'Goro Crater is landlocked (it's a crater). Tar pits do not count as bodies of water. Do not attempt to swim in the tar pits. We cannot stress this enough.",
  },
  tirisfal: {
    coastal: true, seaName: "Lordamere Lake / North Coast",
    seaTemp: 7, waveHeight: "0.4 m", tideStatus: "Stagnant",
    currentAdvisory: "Lordamere Lake waters contaminated with residual Blight. Glowing green. The fish are... different now. North coast waters carry plague runoff. No swimming, fishing, or looking at the water too closely.",
    visibility: "Murky (blight particulate)", swellDir: "None", swellPeriod: "N/A",
  },
  zangarmarsh: {
    coastal: true, seaName: "Zangarmarsh Marshwater System",
    seaTemp: 19, waveHeight: "0 m", tideStatus: "Stagnant (it's a marsh)",
    currentAdvisory: "Water level stable at 'everywhere.' Mushroom root systems creating navigational hazards below surface. Spore count on water surface: catastrophic. Bring a mask if boating.",
    visibility: "Fair (spore film on surface)", swellDir: "None", swellPeriod: "N/A",
  },
  nagrand: {
    coastal: false,
    currentAdvisory: "Nagrand has several rivers and lakes, all of which are as perfect as everything else here. Water temperature: ideal. Currents: gentle. Fish: cooperative. It's disgusting, honestly.",
  },
  icecrown: {
    coastal: false,
    currentAdvisory: "All water in Icecrown is frozen. Permanently. The glaciers occasionally calve but there's no sea to calve into, just more ice. Saronite contamination detected in subsurface meltwater — do NOT drink.",
  },
  barrens: {
    coastal: false,
    currentAdvisory: "The Barrens has the Southfury River along its eastern border. Current status: low (drought, always drought). Fishing conditions: poor. Someone in chat claims there's a rare fish near the Crossroads. They are lying.",
  },
};

// ---- Aviation data per zone ----
const AVIATION_DATA = {
  durotar: {
    metar: "KDUR 311200Z 18007KT CLR 48/M10 A3020 RMK HOT",
    ceiling: "Clear (unlimited)", visibility: "19 km", flightCat: "VFR",
    windShear: "None", turbulence: "Light (thermal updrafts near Razor Hill)",
    advisory: "Wyvern traffic heavy on Orgrimmar approach. Maintain separation from Zeppelin lanes. Dust devils reported below 300 m near Razor Hill.",
  },
  winterspring: {
    metar: "KWSP 311200Z 31045G68KT 0000 +SN BLSN VV002 M33/M36 A2810 RMK WHITEOUT",
    ceiling: "60 m (obscured)", visibility: "5 m", flightCat: "LIFR",
    windShear: "Severe (all altitudes)", turbulence: "Extreme",
    advisory: "AIRFIELD CLOSED. All flight operations suspended indefinitely. Last pilot who attempted landing has not been found. Frostsaber patrols on runway.",
  },
  "thousand-needles": {
    metar: "KTND 311200Z 09003KT SCT040 26/26 A2980 RMK FLOOD",
    ceiling: "1200 m (scattered)", visibility: "Good (above water)", flightCat: "VFR",
    windShear: "None", turbulence: "None",
    advisory: "No landing strip exists (submerged). Speedbarge helipad operational but small. Water landing possible but not recommended (piranhas).",
  },
  darkshore: {
    metar: "KDKS 311200Z VRB80G120KT 0050 FU HZ FEW000 760/M99 RMK FIRE",
    ceiling: "Surface (smoke)", visibility: "15 m", flightCat: "LIFR",
    windShear: "Extreme (firestorm updrafts)", turbulence: "Extreme (unsurvivable)",
    advisory: "AIRSPACE CLOSED. Thermal columns exceeding 800°C. Aircraft structural limits will be exceeded instantly. The hippogryph service has been 'permanently discontinued.'",
  },
  "elwynn-forest": {
    metar: "KELW 311200Z 27006KT SKC 22/11 A3010 RMK PLEASANT",
    ceiling: "Clear (unlimited)", visibility: "32 km", flightCat: "VFR",
    windShear: "None", turbulence: "None",
    advisory: "Perfect flying conditions. Gryphon traffic moderate on Stormwind approach. Student pilots reminded: the Stormwind towers are NOT optional waypoints. Maintain altitude.",
  },
  westfall: {
    metar: "KWFL 311200Z 22022G40KT 6000 HZ DU SCT080 31/M05 A2940 RMK TORNADO",
    ceiling: "2400 m (scattered)", visibility: "6 km (dust)", flightCat: "MVFR",
    windShear: "Moderate (Harvest Golem induced)", turbulence: "Moderate to severe",
    advisory: "TORNADO WATCH in effect. Harvest Golem-generated wind shear unpredictable. Low-altitude flight not recommended. Sentinel Hill tower frequency: 118.3 (if anyone's still manning it).",
  },
  stranglethorn: {
    metar: "KSTV 311200Z 09030G48KT 1600 +TSRA BKN005 32/31 A2880 RMK TS",
    ceiling: "150 m (broken)", visibility: "1.6 km", flightCat: "IFR",
    windShear: "Severe (embedded thunderstorms)", turbulence: "Severe",
    advisory: "Tropical Storm Hemet affecting all approaches. Booty Bay strip closed (flooded). Divert to Grom'gol. Canopy-level flight extremely hazardous (raptors + low ceilings).",
  },
  tanaris: {
    metar: "KTAN 311200Z 22015KT 3000 SA HZ SKC 56/M20 A3040 RMK EXTREME HEAT",
    ceiling: "Clear (unlimited)", visibility: "3 km (sand haze)", flightCat: "MVFR",
    windShear: "Light", turbulence: "Moderate (thermal convection extreme)",
    advisory: "Severe thermal turbulence below 1500 m. Sand ingestion risk to engines. Gadgetzan strip: asphalt softening reported. Land at own risk. Fuel prices: gouged.",
  },
  ungoro: {
    metar: "KUNG 311200Z VRB08KT 5000 FU HZ FEW020 35/33 A2960 RMK VOLCANIC",
    ceiling: "600 m (volcanic haze)", visibility: "5 km", flightCat: "MVFR",
    windShear: "Moderate (volcanic updrafts)", turbulence: "Moderate",
    advisory: "Fire Plume Ridge creating unpredictable convective activity. Devilsaur encounters reported at low altitude (they jump). No established airstrip — use Marshal's Stand clearing.",
  },
  tirisfal: {
    metar: "KTIR 311200Z 36012KT 3000 FG BR OVC003 09/08 A2900 RMK PLAGUE",
    ceiling: "90 m (overcast)", visibility: "3 km (fog)", flightCat: "IFR",
    windShear: "Light", turbulence: "Light",
    advisory: "Perpetual low ceiling and fog. IFR required. Undercity approach crater creates unusual wind patterns. Bat-riders have right of way. Air filters mandatory (plague particulate).",
  },
  zangarmarsh: {
    metar: "KZAN 311200Z 00000KT 8000 HZ FEW015 20/20 A2920 RMK SPORES",
    ceiling: "450 m (few)", visibility: "8 km (spore haze)", flightCat: "VFR",
    windShear: "None", turbulence: "None",
    advisory: "Calm conditions. Giant mushroom caps create obstacle field below 60 m. Spore ingestion may cause engine malfunction. Air filters mandatory. Cenarion Refuge strip: operational.",
  },
  nagrand: {
    metar: "KNAG 311200Z 27008KT CAVOK 23/12 A3000 RMK PERFECT",
    ceiling: "Clear (unlimited)", visibility: "Unlimited", flightCat: "VFR",
    windShear: "None", turbulence: "None",
    advisory: "Perfect flying conditions. Floating islands create unique but non-hazardous terrain. Scenic route recommended. Honestly, just enjoy it.",
  },
  icecrown: {
    metar: "KICE 311200Z 36055G100KT 0800 +SN BLSN FG VV001 M43/M45 A2750 RMK DEATH",
    ceiling: "30 m (obscured)", visibility: "0.8 km", flightCat: "LIFR",
    windShear: "Extreme", turbulence: "Extreme (necrotic storm system)",
    advisory: "AIRSPACE RESTRICTED. Icecrown Citadel generates its own weather system. Frost wyrm encounters likely above 500 m. Anti-aircraft gargoyles reported. Only Argent Tournament-authorized flights permitted.",
  },
  barrens: {
    metar: "KBAR 311200Z 22010KT CAVOK 37/M05 A3030 RMK DRY BORING",
    ceiling: "Clear (unlimited)", visibility: "24 km", flightCat: "VFR",
    windShear: "None", turbulence: "Light (thermals)",
    advisory: "Excellent conditions. Flat terrain with no obstacles for 200 km in any direction. Wind rider traffic on the Crossroads–Camp Taurajo route. Chat interference on frequency 122.0 (Barrens General). Mute recommended.",
  },
};

// ---- Flight routes for aviation page ----
const FLIGHT_ROUTES = [
  { from: "Orgrimmar", to: "Undercity", status: "On Time", delay: "", conditions: "Clear → IFR (plague fog on approach)", icon: "🦇" },
  { from: "Stormwind", to: "Ironforge", status: "On Time", delay: "", conditions: "VFR entire route", icon: "🦅" },
  { from: "Orgrimmar", to: "Thunder Bluff", status: "On Time", delay: "", conditions: "Clear, thermals over Barrens", icon: "🦇" },
  { from: "Stormwind", to: "Booty Bay", status: "Delayed", delay: "2 hr", conditions: "Tropical storm on approach", icon: "🦅" },
  { from: "Dalaran", to: "Icecrown", status: "Cancelled", delay: "—", conditions: "Death chill + gargoyle advisory", icon: "✨" },
  { from: "Orgrimmar", to: "Gadgetzan", status: "On Time", delay: "", conditions: "Sand haze below 1500 m", icon: "🦇" },
  { from: "Exodar", to: "Darkshore", status: "Cancelled", delay: "—", conditions: "Destination on fire (permanently)", icon: "🦅" },
  { from: "Shattrath", to: "Zangarmarsh", status: "Delayed", delay: "30 min", conditions: "Spore advisory — filter replacement", icon: "✨" },
  { from: "Stormwind", to: "Westfall", status: "On Time", delay: "", conditions: "Tornado watch — caution on approach", icon: "🦅" },
  { from: "Dalaran", to: "Winterspring", status: "Cancelled", delay: "—", conditions: "Whiteout — airfield closed since Year 24", icon: "✨" },
];

// ---- Continent grouping helper ----
function getZonesByContinent() {
  const continents = {};
  for (const [id, zone] of Object.entries(ZONES)) {
    if (!continents[zone.continent]) continents[zone.continent] = [];
    continents[zone.continent].push({ id, ...zone });
  }
  return continents;
}

// ---- Continent icons ----
const CONTINENT_ICONS = {
  "Kalimdor": "🌵",
  "Eastern Kingdoms": "🏰",
  "Outland": "🌀",
  "Northrend": "🧊",
};

// ---- SVG graph helpers ----
function svgBarGraph(data, opts) {
  // data: [{label, value, color}], opts: {width, height, maxVal, unit}
  const w = opts.width || 600;
  const h = opts.height || 150;
  const barW = Math.floor((w - 40) / data.length) - 2;
  const maxVal = opts.maxVal || Math.max(...data.map(d => Math.abs(d.value)));
  const hasNeg = data.some(d => d.value < 0);
  const baseline = hasNeg ? h * 0.6 : h - 20;
  const scale = (baseline - 20) / maxVal;

  let bars = '';
  data.forEach((d, i) => {
    const x = 30 + i * (barW + 2);
    const barH = Math.abs(d.value) * scale;
    const y = d.value >= 0 ? baseline - barH : baseline;
    bars += `<rect x="${x}" y="${y}" width="${barW}" height="${Math.max(barH, 1)}" fill="${d.color || '#ffd100'}" rx="1" opacity="0.85"/>`;
    bars += `<text x="${x + barW/2}" y="${y - 4}" fill="#3a5575" font-size="8" text-anchor="middle" font-family="Verdana">${d.value}°</text>`;
    bars += `<text x="${x + barW/2}" y="${h - 2}" fill="#5a7a9a" font-size="7" text-anchor="middle" font-family="Verdana">${d.label}</text>`;
  });

  // Baseline
  bars += `<line x1="28" y1="${baseline}" x2="${w}" y2="${baseline}" stroke="#b0c0d4" stroke-width="1"/>`;

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;width:100%;height:auto;">${bars}</svg>`;
}

function svgLineGraph(data, opts) {
  // data: [{label, value}], opts: {width, height, color, unit, fillBelow}
  const w = opts.width || 600;
  const h = opts.height || 120;
  const color = opts.color || '#ffd100';
  const values = data.map(d => d.value);
  const minV = opts.minVal !== undefined ? opts.minVal : Math.min(...values);
  const maxV = opts.maxVal !== undefined ? opts.maxVal : Math.max(...values);
  const rangeV = maxV - minV || 1;
  const padT = 15, padB = 18;
  const scaleY = (h - padT - padB) / rangeV;

  const points = data.map((d, i) => {
    const x = 30 + i * ((w - 40) / (data.length - 1));
    const y = h - padB - (d.value - minV) * scaleY;
    return { x, y, label: d.label, value: d.value };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  let fillD = '';
  if (opts.fillBelow) {
    fillD = pathD + ` L${points[points.length-1].x},${h-padB} L${points[0].x},${h-padB} Z`;
  }

  let svg = '';
  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const gy = padT + i * (h - padT - padB) / 4;
    const val = Math.round(maxV - i * rangeV / 4);
    svg += `<line x1="28" y1="${gy}" x2="${w}" y2="${gy}" stroke="#c0d0e4" stroke-width="0.5"/>`;
    svg += `<text x="25" y="${gy+3}" fill="#7a8ea5" font-size="7" text-anchor="end" font-family="Verdana">${val}</text>`;
  }
  if (opts.fillBelow) {
    svg += `<path d="${fillD}" fill="${color}" opacity="0.1"/>`;
  }
  svg += `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="2"/>`;
  // Dots & labels
  points.forEach((p, i) => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="${color}"/>`;
    if (i % Math.ceil(data.length / 12) === 0 || data.length <= 12) {
      svg += `<text x="${p.x}" y="${h - 3}" fill="#7a8ea5" font-size="7" text-anchor="middle" font-family="Verdana">${p.label}</text>`;
    }
  });

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;width:100%;height:auto;">${svg}</svg>`;
}

// ---- Formatted update time ----
function getUpdateTime() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `Last Updated: ${hour}:${m} ${ampm} Azeroth Standard Time (AST)`;
}

// ---- Generate 7-day forecast day names starting from today ----
function getForecastDays() {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    days.push({
      label: i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : DAY_NAMES[d.getDay()]),
      short: i === 0 ? 'Today' : DAY_SHORT[d.getDay()],
    });
  }
  return days;
}
