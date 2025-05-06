import { SefariaBook } from '../app/components/types';

// Need to declare the module to correctly import the JSON file

import sefaria_index from './sefaria_index.json';

export const getTableOfContents = (): SefariaBook[] => {
   try {
    // Using the local JSON file instead of API call
    const tableOfContents = sefaria_index as SefariaBook[];
    return tableOfContents;
   } catch (error) {
    console.error("Error fetching table of contents:", error);
    return [];
   }
}

export const getFiveBooksOfMoses = (): SefariaBook[] => {
   try {
     const tableOfContents = sefaria_index as SefariaBook[];
     // Find the Tanakh section
     const tanakhSection = tableOfContents.find((section: SefariaBook) => section.category === "Tanakh");
     if (!tanakhSection || !tanakhSection.contents) {
       throw new Error("Tanakh section not found");
     }
     
     // Find the Torah (Five Books of Moses) subsection
     const torahSection = tanakhSection.contents.find((subsection: SefariaBook) => subsection.category === "Torah");
     if (!torahSection || !torahSection.contents) {
       throw new Error("Torah section not found");
     }
     
     return torahSection.contents;
   } catch (error) {
     console.error("Error fetching Five Books of Moses:", error);
     return [];
   }
}

export const getTalmudBooks = (): SefariaBook[] => {
   try {
     const tableOfContents = sefaria_index as SefariaBook[];
     // Find the Talmud section
     const talmudSection = tableOfContents.find((section: SefariaBook) => section.category === "Talmud");
     if (!talmudSection || !talmudSection.contents) {
       throw new Error("Talmud section not found");
     }
     
     // Process all Talmud tractates properly by going through the sedarim (categories)
     const talmudBooks: SefariaBook[] = [];
     
     // Process each type of Talmud (Bavli and Yerushalmi)
     talmudSection.contents.forEach((talmudType: SefariaBook) => {
       if (talmudType.category && talmudType.contents) {
         const isBavli = talmudType.category === "Bavli";
         const isYerushalmi = talmudType.category === "Yerushalmi";
         
         if (isBavli || isYerushalmi) {
           // For each Seder (Zeraim, Moed, etc.) in this Talmud type
           talmudType.contents.forEach((seder: SefariaBook) => {
             if (seder.category && seder.contents) {
               // For each tractate in the seder (e.g., Berakhot in Zeraim)
               seder.contents.forEach((tractate) => {
                 if (tractate.title) {
                   // Add parent category information
                   talmudBooks.push({
                     ...tractate,
                     parentCategory: seder.category, // Store the parent Seder
                     talmudType: isBavli ? "Bavli" : "Yerushalmi" // Mark which Talmud type
                   });
                 }
               });
             }
           });
         }
       }
     });
     
     return talmudBooks;
   } catch (error) {
     console.error("Error fetching Talmud books:", error);
     return [];
   }
}

export const getTalmudCategoryColors = () => {
  return {
    "Seder Zeraim": "#8BC34A",  // Light Green
    "Zeraim": "#8BC34A",        // Light Green (without prefix)
    "Seder Moed": "#FF9800",    // Orange
    "Moed": "#FF9800",          // Orange (without prefix)
    "Seder Nashim": "#E91E63",  // Pink
    "Nashim": "#E91E63",        // Pink (without prefix)
    "Seder Nezikin": "#F44336", // Red
    "Nezikin": "#F44336",       // Red (without prefix)
    "Seder Kodashim": "#9C27B0", // Purple
    "Kodashim": "#9C27B0",       // Purple (without prefix)
    "Seder Tahorot": "#2196F3",  // Blue
    "Tahorot": "#2196F3"         // Blue (without prefix)
  } as Record<string, string>;  // Add index signature to allow string indexing
}

