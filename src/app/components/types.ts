export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface BookProps {
  position: [number, number, number];
  color: string;
  index: number;
  title?: string;
  parentCategory?: string; // Added for displaying parent category
  talmudType?: string; // Added to identify Bavli or Yerushalmi
}

export interface BookData {
  position: [number, number, number];
  color: string;
  title: string;
  index: number;
  parentCategory?: string; // Added for displaying parent category
  talmudType?: string; // Added to identify Bavli or Yerushalmi
}

export interface BookCategory {
  name: string;
  baseHue: number;
  count: number;
}

export interface TableProps {
  position?: [number, number, number];
  size?: [number, number, number];
  color?: string;
}

export interface ChairProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

// Interface for Sefaria book data
export interface SefariaBook {
  title?: string;
  heTitle?: string;
  category?: string;
  primary_category?: string;
  contents?: SefariaBook[];
  talmudType?: string; // Added for Talmud books to identify as Bavli or Yerushalmi
  parentCategory?: string; // Added to store the parent category (e.g., Seder Zeraim)
  enShortDesc?: string; // Description in English
  heShortDesc?: string; // Description in Hebrew
}