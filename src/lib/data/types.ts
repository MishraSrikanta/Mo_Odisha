/** Shared content types. Every record carries an Odia name so the UI can
 *  present authentic bilingual labels regardless of the active locale. */

export type MotifKind = "temple" | "wave" | "forest" | "wheel" | "lotus" | "tribal" | "flame" | "loom";

export type Fact = { label: string; value: string };

export type TourismCategory =
  | "beaches"
  | "temples"
  | "waterfalls"
  | "forests"
  | "wildlife"
  | "lakes"
  | "heritage"
  | "eco"
  | "hills"
  | "museums"
  | "adventure"
  | "tribal"
  | "pilgrimage";

export interface Destination {
  id: string;
  name: string;
  nameOr: string;
  category: TourismCategory;
  district: string;
  blurb: string;
  description: string;
  season: string;
  facts: Fact[];
  gallery: string[];
  motif: MotifKind;
  /** [latitude, longitude] — powers the "Open in Maps" action. */
  coords: [number, number];
}

export interface HistoryEra {
  id: string;
  period: string;
  title: string;
  titleOr: string;
  summary: string;
  detail: string;
  highlights: string[];
  motif: MotifKind;
}

export interface CultureEntry {
  id: string;
  name: string;
  nameOr: string;
  group: "dance" | "music" | "craft" | "cuisine" | "language" | "folk" | "festival";
  blurb: string;
  description: string;
  facts: Fact[];
  motif: MotifKind;
}

export interface Temple {
  id: string;
  name: string;
  nameOr: string;
  deity: string;
  builtIn: string;
  district: string;
  style: string;
  height: string;
  blurb: string;
  description: string;
  facts: Fact[];
  coords: [number, number];
}

export interface WildlifeSite {
  id: string;
  name: string;
  nameOr: string;
  type: string;
  district: string;
  area: string;
  blurb: string;
  description: string;
  species: string[];
  season: string;
  motif: MotifKind;
  coords: [number, number];
}

export interface Dish {
  id: string;
  name: string;
  nameOr: string;
  kind: "staple" | "sweet" | "snack" | "curry" | "prasad";
  blurb: string;
  description: string;
  ingredients: string[];
  servedWith: string;
  region: string;
}

export interface Festival {
  id: string;
  name: string;
  nameOr: string;
  month: number;
  monthLabel: string;
  place: string;
  blurb: string;
  description: string;
  highlights: string[];
  motif: MotifKind;
}

export interface ArtForm {
  id: string;
  name: string;
  nameOr: string;
  medium: string;
  origin: string;
  blurb: string;
  description: string;
  motif: MotifKind;
}

export type DistrictTheme = "nature" | "history" | "temple" | "beach" | "wildlife" | "culture" | "adventure";

export interface District {
  id: string;
  name: string;
  nameOr: string;
  headquarters: string;
  population: string;
  area: string;
  region: "coastal" | "central" | "north" | "south" | "west";
  themes: DistrictTheme[];
  knownFor: string;
  attractions: string[];
  cuisine: string[];
  festival: string;
  people: string[];
  /** Position on the stylised tile map, in grid units. */
  cell: { col: number; row: number };
}
