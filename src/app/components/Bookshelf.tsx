"use client"

import { useRef, useEffect, useState } from 'react'
import { Group } from 'three'
import { Book } from './Book'
import { BookData, SefariaBook } from './types'
import { getFiveBooksOfMoses, getTalmudBooks, getTalmudCategoryColors } from '../../books/sefaria'

// Constants for shelf dimensions and book placement
const SHELF_WIDTH = 5; // Width of the shelf
const SHELF_HALF_WIDTH = SHELF_WIDTH / 2;
const SIDE_PANEL_WIDTH = 0.05;
const DIVIDER_WIDTH = 0.04;
const BOOK_WIDTH = 0.15; // Book width
const BOOK_SPACING = 0.03; // Space between books
const SECTION_COUNT = 5; // Number of sections per shelf
const MAX_ROWS_PER_BOOKSHELF = 3; // Maximum number of rows/shelves per bookshelf unit
const BOOKSHELF_HORIZONTAL_SPACING = 6; // Horizontal spacing between bookshelf units

// Shelf dimensions
const SHELF_HEIGHT = 1.2; // Height of the shelf unit
const SHELF_DEPTH = 0.4; // Depth of the shelf
const SHELF_THICKNESS = 0.05; // Thickness of the shelf board
const SHELF_Z_POSITION = -1.95; // Z position of the shelf
const WALL_Z_POSITION = -2.1; // Z position of the wall/back panel
const SHELF_Y_POSITION = 1.6; // Y position of the first shelf center
const SHELF_VERTICAL_SPACING = 1.3; // Vertical space between shelves

/**
 * Helper component to create a single shelf row
 */
const ShelfRow = ({ 
  yPosition, 
  xPosition, 
  rowIndex 
}: { 
  yPosition: number, 
  xPosition: number,
  rowIndex: number 
}) => {
  // Generate divider positions for this shelf
  const dividerPositions = [-1.5, -0.5, 0.5, 1.5]; // Horizontal positions for dividers
  
  return (
    <group position={[xPosition, 0, 0]}>
      {/* Back panel */}
      <mesh position={[0, yPosition, WALL_Z_POSITION]} receiveShadow castShadow>
        <boxGeometry args={[SHELF_WIDTH, SHELF_HEIGHT, 0.1]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>
      
      {/* Bottom shelf */}
      <mesh position={[0, yPosition - SHELF_HEIGHT/2 + SHELF_THICKNESS/2, SHELF_Z_POSITION]} receiveShadow castShadow>
        <boxGeometry args={[SHELF_WIDTH, SHELF_THICKNESS, SHELF_DEPTH]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.7} />
      </mesh>
      
      {/* Top shelf */}
      <mesh position={[0, yPosition + SHELF_HEIGHT/2 - SHELF_THICKNESS/2, SHELF_Z_POSITION]} receiveShadow castShadow>
        <boxGeometry args={[SHELF_WIDTH, SHELF_THICKNESS, SHELF_DEPTH]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.7} />
      </mesh>
      
      {/* Left side panel */}
      <mesh position={[-SHELF_HALF_WIDTH + SIDE_PANEL_WIDTH/2, yPosition, SHELF_Z_POSITION]} receiveShadow castShadow>
        <boxGeometry args={[SIDE_PANEL_WIDTH, SHELF_HEIGHT, SHELF_DEPTH]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>
      
      {/* Right side panel */}
      <mesh position={[SHELF_HALF_WIDTH - SIDE_PANEL_WIDTH/2, yPosition, SHELF_Z_POSITION]} receiveShadow castShadow>
        <boxGeometry args={[SIDE_PANEL_WIDTH, SHELF_HEIGHT, SHELF_DEPTH]} />
        <meshStandardMaterial color="#5d4037" roughness={0.8} />
      </mesh>
      
      {/* Middle dividers */}
      {dividerPositions.map((x, i) => (
        <mesh key={`divider-${rowIndex}-${i}`} position={[x, yPosition, SHELF_Z_POSITION]} receiveShadow castShadow>
          <boxGeometry args={[DIVIDER_WIDTH, SHELF_HEIGHT - SHELF_THICKNESS*2, SHELF_DEPTH - 0.02]} />
          <meshStandardMaterial color="#5d4037" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

export function Bookshelf() {
  const groupRef = useRef<Group>(null);
  const [books, setBooks] = useState<BookData[]>([]);
  const [shelfLayout, setShelfLayout] = useState<{ rows: number, columns: number }>({
    rows: 1,
    columns: 1
  });
  const talmudCategoryColors = getTalmudCategoryColors();
  
  useEffect(() => {
    // Fetch the books data
    const torahBooks = getFiveBooksOfMoses() || [];
    const talmudBooks = getTalmudBooks() || [];
    
    const bookData: BookData[] = [];
    
    // Define section boundaries (5 sections per shelf)
    const dividerPositions = [-SHELF_HALF_WIDTH, -1.5, -0.5, 0.5, 1.5, SHELF_HALF_WIDTH];
    
    // Function to calculate book position within a section
    const calculateBookPosition = (sectionIndex: number, positionInSection: number, shelfIndex: number) => {
      // Calculate which bookshelf unit this shelf belongs to
      const bookshelfColumn = Math.floor(shelfIndex / MAX_ROWS_PER_BOOKSHELF);
      const shelfRow = shelfIndex % MAX_ROWS_PER_BOOKSHELF;
      
      // Calculate horizontal position - simply place books from left to right
      const sectionStartX = dividerPositions[sectionIndex];
      const sectionEndX = dividerPositions[sectionIndex + 1];
      const sectionWidth = sectionEndX - sectionStartX;
      
      // Account for dividers/side panels width
      const paddingLeft = sectionIndex === 0 ? SIDE_PANEL_WIDTH : DIVIDER_WIDTH/2;
      const paddingRight = sectionIndex === SECTION_COUNT - 1 ? SIDE_PANEL_WIDTH : DIVIDER_WIDTH/2;
      const usableWidth = sectionWidth - paddingLeft - paddingRight;
      
      // Calculate how many books can fit horizontally in this section
      const maxBooksPerRow = Math.floor(usableWidth / (BOOK_WIDTH + BOOK_SPACING));
      
      // Calculate x position - distribute evenly within section's usable width
      const totalBooksWidth = maxBooksPerRow * (BOOK_WIDTH + BOOK_SPACING) - BOOK_SPACING;
      const leftoverSpace = usableWidth - totalBooksWidth;
      const startOffset = paddingLeft + (leftoverSpace / 2);
      
      // Add the bookshelf column offset to the x position
      const bookshelfXOffset = bookshelfColumn * BOOKSHELF_HORIZONTAL_SPACING;
      const x = sectionStartX + startOffset + (positionInSection * (BOOK_WIDTH + BOOK_SPACING)) + (BOOK_WIDTH / 2) + bookshelfXOffset;
      
      // Calculate y position - centered vertically within the shelf
      const y = SHELF_Y_POSITION + (shelfRow * SHELF_VERTICAL_SPACING);
      
      // Add a small random offset to z for natural look, but keep books close to back of shelf
      const z = SHELF_Z_POSITION + (Math.random() * 0.03);
      
      return [x, y, z] as [number, number, number];
    };
    
    // Track book placement
    let currentShelf = 0;
    let currentSection = 0;
    let positionInSection = 0;
    
    // Helper function to move to next position and handle overflow
    const moveToNextPosition = () => {
      positionInSection++;
      
      // Calculate how many books can fit in a section
      const sectionWidth = dividerPositions[currentSection + 1] - dividerPositions[currentSection];
      const paddingLeft = currentSection === 0 ? SIDE_PANEL_WIDTH : DIVIDER_WIDTH/2;
      const paddingRight = currentSection === SECTION_COUNT - 1 ? SIDE_PANEL_WIDTH : DIVIDER_WIDTH/2;
      const usableWidth = sectionWidth - paddingLeft - paddingRight;
      const maxBooksPerSection = Math.floor(usableWidth / (BOOK_WIDTH + BOOK_SPACING));
      
      // If section is full, move to next section
      if (positionInSection >= maxBooksPerSection) {
        positionInSection = 0;
        currentSection++;
        
        // If we've filled all sections in this shelf, move to next shelf
        if (currentSection >= SECTION_COUNT) {
          currentSection = 0;
          currentShelf++;
        }
      }
    };
    
    // Group books by category for better organization
    const bookGroups: { [key: string]: SefariaBook[] } = {
      "Torah": torahBooks,
    };
    
    // Group Talmud books by category and type
    talmudBooks.forEach((book: SefariaBook) => {
      const talmudType = book.talmudType || "Bavli"; // Default to Bavli if not specified
      const category = book.parentCategory || "Unknown";
      const groupKey = `${category}-${talmudType}`;
      
      if (!bookGroups[groupKey]) {
        bookGroups[groupKey] = [];
      }
      
      bookGroups[groupKey].push(book);
    });
    
    // Add books grouped by category - this ensures similar books are together
    let globalBookIndex = 0;
    
    Object.entries(bookGroups).forEach(([categoryKey, booksInCategory]) => {
      // Get appropriate base color for this category
      let baseColor;
      
      if (categoryKey === "Torah") {
        baseColor = "hsl(200, 70%, 50%)"; // Blue for Torah
      } else {
        // Extract the category from the compound key for Talmud
        const [category, talmudType] = categoryKey.split('-');
        baseColor = talmudCategoryColors[category] || "#795548"; // Use category color or default brown
        
        // Lighten color for Yerushalmi
        if (talmudType === "Yerushalmi") {
          // Simple lightening by using HSL adjustment
          baseColor = lightenColor(baseColor, 15);
        }
      }
      
      // Position all books from this category together
      booksInCategory.forEach((book: SefariaBook, i: number) => {
        const isTorah = categoryKey === "Torah";
        const isTalmud = !isTorah;
        let talmudType, category;
        
        if (isTalmud) {
          [category, talmudType] = categoryKey.split('-');
        }
        
        // Create slightly varied colors for visual interest within a category
        let bookColor;
        if (isTorah) {
          // Coral/salmon color for Torah (like in the image)
          bookColor = `hsl(15, ${70 + Math.random() * 10}%, ${65 + Math.random() * 10}%)`;
        } else if (category === "Zeraim") {
          // Purple for Zeraim (like in the image)
          bookColor = `hsl(280, ${70 + Math.random() * 10}%, ${65 + Math.random() * 10}%)`;
        } else if (category === "Nashim") {
          // Light blue for some category
          bookColor = `hsl(195, ${60 + Math.random() * 10}%, ${70 + Math.random() * 10}%)`;
        } else if (category === "Nezikin") {
          // Beige/tan for some category
          bookColor = `hsl(45, ${50 + Math.random() * 10}%, ${75 + Math.random() * 10}%)`;
        } else if (category === "Kodashim") {
          // Pink for some category
          bookColor = `hsl(340, ${60 + Math.random() * 10}%, ${75 + Math.random() * 10}%)`;
        } else if (category === "Taharot") {
          // Yellow/golden for some category
          bookColor = `hsl(50, ${70 + Math.random() * 10}%, ${80 + Math.random() * 5}%)`;
        } else {
          // Slight variations on the base color for other categories
          bookColor = varyColor(baseColor, 10);
        }
        
        // Create the book data
        bookData.push({
          position: calculateBookPosition(currentSection, positionInSection, currentShelf),
          color: bookColor,
          title: isTorah 
            ? book.title || book.heTitle || 'Torah Book'
            : `${book.title || book.heTitle || 'Talmud Book'} (${talmudType})`,
          index: globalBookIndex++,
          parentCategory: isTorah ? "Torah" : category,
          talmudType: isTalmud ? talmudType : undefined
        });
        
        moveToNextPosition();
      });
      
      // After each category group, ensure we start a new section for visual separation
      // unless we're already at the start of a section
      if (positionInSection > 0) {
        // Fill the rest of the current section with empty spaces to start fresh
        positionInSection = 0;
        currentSection++;
        
        // If we've filled all sections in this shelf
        if (currentSection >= SECTION_COUNT) {
          currentSection = 0;
          currentShelf++;
        }
      }
    });
    
    // Calculate the layout dimensions
    const totalShelves = currentShelf + 1; // Add 1 because currentShelf is 0-indexed
    const columns = Math.ceil(totalShelves / MAX_ROWS_PER_BOOKSHELF);
    const rows = Math.min(MAX_ROWS_PER_BOOKSHELF, totalShelves);
    
    setShelfLayout({
      rows: rows,
      columns: columns
    });
    
    // Set all books
    setBooks(bookData);
  }, []);
  
  // Helper function to lighten a hex color
  function lightenColor(hex: string, percent: number): string {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Lighten
    r = Math.min(255, r + Math.floor(percent / 100 * 255));
    g = Math.min(255, g + Math.floor(percent / 100 * 255));
    b = Math.min(255, b + Math.floor(percent / 100 * 255));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  // Helper function to vary a color slightly for visual interest
  function varyColor(hex: string, variance: number): string {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Add slight variation
    r = Math.min(255, Math.max(0, r + (Math.random() * variance * 2 - variance)));
    g = Math.min(255, Math.max(0, g + (Math.random() * variance * 2 - variance)));
    b = Math.min(255, Math.max(0, b + (Math.random() * variance * 2 - variance)));
    
    // Convert back to hex
    return `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`;
  }
  
  // Generate shelf row components based on layout
  const generateShelfRows = () => {
    const shelves = [];
    
    // For each column
    for (let colIndex = 0; colIndex < shelfLayout.columns; colIndex++) {
      // For each row in the column
      for (let rowIndex = 0; rowIndex < shelfLayout.rows; rowIndex++) {
        // Calculate the shelf index
        const shelfIndex = colIndex * MAX_ROWS_PER_BOOKSHELF + rowIndex;
        
        // Calculate position
        const xPosition = colIndex * BOOKSHELF_HORIZONTAL_SPACING;
        const yPosition = SHELF_Y_POSITION + (rowIndex * SHELF_VERTICAL_SPACING);
        
        shelves.push(
          <ShelfRow
            key={`shelf-${shelfIndex}`}
            xPosition={xPosition}
            yPosition={yPosition}
            rowIndex={shelfIndex}
          />
        );
      }
    }
    
    return shelves;
  };
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Books on shelves */}
      {books.map((book, i) => (
        <Book 
          key={i} 
          position={book.position}
          color={book.color}
          index={book.index}
          title={book.title}
          parentCategory={book.parentCategory}
          talmudType={book.talmudType}
        />
      ))}
      
      {/* Generate shelf rows based on layout */}
      {generateShelfRows()}
      
      {/* Ambient decorations - positioned above the rightmost bookshelf */}
      <mesh position={[(shelfLayout.columns - 1) * BOOKSHELF_HORIZONTAL_SPACING / 2, 4, -2]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} emissive="#FFA500" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#212121" roughness={0.9} />
      </mesh>
    </group>
  )
}