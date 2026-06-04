/**
 * Greater Accra neighbourhoods, towns, and municipal areas.
 * Sourced from Wikipedia “Neighbourhoods of Accra”, AMA sub-metros,
 * and Greater Accra district capitals (CoverGhana / MMDA list).
 */
export type AccraArea = { id: string; label: string };

export type AccraAreaGroup = { label: string; areas: AccraArea[] };

export const accraAreaGroups: AccraAreaGroup[] = [
  {
    label: "Central Accra",
    areas: [
      { id: "accra-central", label: "Accra Central" },
      { id: "adabraka", label: "Adabraka" },
      { id: "agbogbloshie", label: "Agbogbloshie" },
      { id: "asylum-down", label: "Asylum Down" },
      { id: "christiansborg", label: "Christiansborg" },
      { id: "circle", label: "Circle" },
      { id: "jamestown", label: "Jamestown" },
      { id: "makola", label: "Makola" },
      { id: "ministries", label: "Ministries" },
      { id: "north-ridge", label: "North Ridge" },
      { id: "osu", label: "Osu" },
      { id: "ringway-estates", label: "Ringway Estates" },
      { id: "swalaba", label: "Swalaba" },
      { id: "tudu", label: "Tudu" },
      { id: "ussher-town", label: "Usshertown" },
      { id: "victoriaborg", label: "Victoriaborg" },
      { id: "west-ridge", label: "West Ridge" },
    ],
  },
  {
    label: "North Accra",
    areas: [
      { id: "abeblemkpe", label: "Abelemkpe" },
      { id: "abeka", label: "Abeka" },
      { id: "accra-new-town", label: "Accra New Town" },
      { id: "achimota", label: "Achimota" },
      { id: "adenta", label: "Adenta" },
      { id: "airport-city", label: "Airport City" },
      { id: "airport-hills", label: "Airport Hills" },
      { id: "airport-residential", label: "Airport Residential Area" },
      { id: "alajo", label: "Alajo" },
      { id: "apenkwa", label: "Apenkwa" },
      { id: "avenor", label: "Avenor" },
      { id: "awoshie", label: "Awoshie" },
      { id: "bawaleshie", label: "Bawaleshie" },
      { id: "bubiashie", label: "Bubiashie" },
      { id: "christian-village", label: "Christian Village" },
      { id: "darkuman", label: "Darkuman" },
      { id: "dome", label: "Dome" },
      { id: "dzorwulu", label: "Dzorwulu" },
      { id: "east-legon", label: "East Legon" },
      { id: "haatso", label: "Haatso" },
      { id: "kanda", label: "Kanda" },
      { id: "kaneshie", label: "Kaneshie" },
      { id: "kokomlemle", label: "Kokomlemle" },
      { id: "kotobabi", label: "Kotobabi" },
      { id: "kwashieman", label: "Kwashieman" },
      { id: "legon", label: "Legon" },
      { id: "maamobi", label: "Maamobi" },
      { id: "madina", label: "Madina" },
      { id: "mccarthy-hill", label: "McCarthy Hill" },
      { id: "nima", label: "Nima" },
      { id: "north-kaneshie", label: "North Kaneshie" },
      { id: "ofankor", label: "Ofankor" },
      { id: "oyarifa", label: "Oyarifa" },
      { id: "pokuase", label: "Pokuase" },
      { id: "roman-ridge", label: "Roman Ridge" },
      { id: "shiashie", label: "Shiashie" },
      { id: "spintex", label: "Spintex" },
      { id: "tesano", label: "Tesano" },
      { id: "west-legon", label: "West Legon / Westlands" },
    ],
  },
  {
    label: "West Accra",
    areas: [
      { id: "abossey-okai", label: "Abossey Okai" },
      { id: "ablekuma", label: "Ablekuma" },
      { id: "awudome", label: "Awudome" },
      { id: "chorkor", label: "Chorkor" },
      { id: "dansoman", label: "Dansoman" },
      { id: "gbawe", label: "Gbawe" },
      { id: "korle-bu", label: "Korle Bu" },
      { id: "korle-gonno", label: "Korle Gonno" },
      { id: "lartebiokorshie", label: "Lartebiokorshie" },
      { id: "mamprobi", label: "Mamprobi" },
      { id: "mataheko", label: "Mataheko" },
      { id: "mpoase", label: "Mpoase" },
      { id: "ngleshie-amanfro", label: "Ngleshie Amanfro" },
      { id: "odorkor", label: "Odorkor" },
      { id: "santa-maria", label: "Santa Maria" },
      { id: "sowutuom", label: "Sowutuom" },
      { id: "sukura", label: "Sukura" },
      { id: "weija", label: "Weija" },
    ],
  },
  {
    label: "East Accra",
    areas: [
      { id: "burma-camp", label: "Burma Camp" },
      { id: "cantonments", label: "Cantonments" },
      { id: "east-ridge", label: "East Ridge" },
      { id: "el-wak", label: "El-Wak" },
      { id: "kisseman", label: "Kisseman" },
      { id: "la", label: "La" },
      { id: "labadi", label: "Labadi" },
      { id: "nungua", label: "Nungua" },
      { id: "sakumono", label: "Sakumono" },
      { id: "teshie", label: "Teshie" },
    ],
  },
  {
    label: "Tema & coastal east",
    areas: [
      { id: "ashaiman", label: "Ashaiman" },
      { id: "kpone", label: "Kpone" },
      { id: "prampram", label: "Prampram" },
      { id: "tema", label: "Tema" },
      { id: "tema-community-1", label: "Tema Community 1" },
      { id: "tema-community-2", label: "Tema Community 2" },
      { id: "tema-community-4", label: "Tema Community 4" },
      { id: "tema-community-18", label: "Tema Community 18" },
      { id: "tema-new-town", label: "Tema New Town" },
    ],
  },
  {
    label: "Ga & outer Accra",
    areas: [
      { id: "abokobi", label: "Abokobi" },
      { id: "ada-foah", label: "Ada Foah" },
      { id: "amasaman", label: "Amasaman" },
      { id: "dodowa", label: "Dodowa" },
      { id: "kasoa-border", label: "Kasoa / Mallam area" },
      { id: "medina", label: "Medina" },
      { id: "sege", label: "Sege" },
      { id: "shai-hills", label: "Shai Hills / Dodowa corridor" },
    ],
  },
];

export const accraAreas: AccraArea[] = accraAreaGroups.flatMap(
  (group) => group.areas,
);

export const accraAreaIds = new Set(accraAreas.map((area) => area.id));

export function findAccraArea(id: string): AccraArea | undefined {
  return accraAreas.find((area) => area.id === id);
}
