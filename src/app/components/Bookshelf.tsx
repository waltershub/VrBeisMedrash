"use client"

import { useRef, useEffect, useState } from 'react'
import { Group } from 'three'
import { Book } from './Book'
import { BookData, SefariaBook } from './types'
import { getFiveBooksOfMoses, getTalmudBooks, getTalmudCategoryColors } from '../../books/sefaria'

export function Bookshelf() {
  const groupRef = useRef<Group>(null)
  const [books, setBooks] = useState<BookData[]>([])
  const talmudCategoryColors = getTalmudCategoryColors();
  
  useEffect(() => {
    // Fetch the books data
    const torahBooks = getFiveBooksOfMoses() || [];
    const talmudBooks = getTalmudBooks() || [];
    
    const bookData: BookData[] = [];
    let bookIndex = 0;
    
    // Add Torah books (Five Books of Moses) - Blue color scheme
    torahBooks.forEach((book: SefariaBook, i: number) => {
      bookData.push({
        position: [bookIndex * 0.18 - 2.2, 1.6, -1.95 + Math.random() * 0.05] as [number, number, number],
        color: `hsl(200, ${65 + Math.random() * 15}%, ${40 + Math.random() * 20}%)`, // Blues
        title: book.title || book.heTitle || 'Torah Book',
        index: i,
        parentCategory: "Torah"
      });
      bookIndex++;
    });
    
    // Group Talmud books by their type and parent category (Seder)
    const groupedTalmudBooks: { [key: string]: { [key: string]: SefariaBook[] } } = {
      Bavli: {},
      Yerushalmi: {}
    };
    
    talmudBooks.forEach((book: SefariaBook) => {
      const talmudType = book.talmudType || "Bavli"; // Default to Bavli if not specified
      const category = book.parentCategory || "Unknown";
      
      if (!groupedTalmudBooks[talmudType]) {
        groupedTalmudBooks[talmudType] = {};
      }
      
      if (!groupedTalmudBooks[talmudType][category]) {
        groupedTalmudBooks[talmudType][category] = [];
      }
      
      groupedTalmudBooks[talmudType][category].push(book);
    });
    
    // Add Bavli Talmud books first, arranged by category
    Object.entries(groupedTalmudBooks.Bavli).forEach(([category, books]) => {
      // Use category-specific color or default if not found
      const baseColor = talmudCategoryColors[category] || "#795548"; // Default brown
      
      books.forEach((book: SefariaBook, i: number) => {
        // Add a slight variation to the base color
        const hue = parseInt(baseColor.substring(1, 3), 16);
        const saturation = parseInt(baseColor.substring(3, 5), 16);
        const lightness = parseInt(baseColor.substring(5, 7), 16);
        
        bookData.push({
          position: [bookIndex * 0.18 - 2.2, 1.6, -1.95 + Math.random() * 0.05] as [number, number, number],
          color: baseColor, // Color based on Talmud category
          title: `${book.title || book.heTitle || 'Talmud Book'} (Bavli)`,
          index: torahBooks.length + bookIndex - books.length,
          parentCategory: category,
          talmudType: "Bavli"
        });
        bookIndex++;
      });
    });
    
    // Then add Yerushalmi Talmud books, arranged by category
    Object.entries(groupedTalmudBooks.Yerushalmi).forEach(([category, books]) => {
      // Use category-specific color but lighten it for Yerushalmi to differentiate
      let baseColor = talmudCategoryColors[category] || "#795548"; // Default brown
      
      // Convert hex to HSL and lighten for Yerushalmi
      const r = parseInt(baseColor.slice(1, 3), 16) / 255;
      const g = parseInt(baseColor.slice(3, 5), 16) / 255;
      const b = parseInt(baseColor.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      // Convert the base color to a lighter version for Yerushalmi
      const lighterColor = `hsl(${h}, ${s*100}%, ${Math.min(l*100 + 15, 90)}%)`;
      
      books.forEach((book: SefariaBook, i: number) => {
        bookData.push({
          position: [bookIndex * 0.18 - 2.2, 1.6, -1.95 + Math.random() * 0.05] as [number, number, number],
          color: baseColor, // Lightened color for Yerushalmi
          title: `${book.title || book.heTitle || 'Talmud Book'} (Yerushalmi)`,
          index: torahBooks.length + bookIndex - books.length,
          parentCategory: category,
          talmudType: "Yerushalmi"
        });
        bookIndex++;
      });
    });
    
    // Limit to avoid overcrowding
    setBooks(bookData.slice(0, 30));
  }, []);
  
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
      
      {/* Main bookshelf structure */}
      <group>
        {/* Bookshelf back panel */}
        <mesh position={[0, 1.6, -2.1]} receiveShadow castShadow>
          <boxGeometry args={[5, 1.2, 0.1]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} />
        </mesh>
        
        {/* Bottom shelf */}
        <mesh position={[0, 1.05, -1.95]} receiveShadow castShadow>
          <boxGeometry args={[5, 0.05, 0.4]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.7} />
        </mesh>
        
        {/* Top shelf */}
        <mesh position={[0, 2.15, -1.95]} receiveShadow castShadow>
          <boxGeometry args={[5, 0.05, 0.4]} />
          <meshStandardMaterial color="#6d4c41" roughness={0.7} />
        </mesh>
        
        {/* Left side panel */}
        <mesh position={[-2.475, 1.6, -1.95]} receiveShadow castShadow>
          <boxGeometry args={[0.05, 1.2, 0.4]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} />
        </mesh>
        
        {/* Right side panel */}
        <mesh position={[2.475, 1.6, -1.95]} receiveShadow castShadow>
          <boxGeometry args={[0.05, 1.2, 0.4]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} />
        </mesh>
        
        {/* Middle dividers */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 1.6, -1.95]} receiveShadow castShadow>
            <boxGeometry args={[0.04, 1.1, 0.38]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
        ))}
      </group>
      
      {/* Ambient decorations */}
      <mesh position={[0, 3, -2]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} emissive="#FFA500" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#212121" roughness={0.9} />
      </mesh>
    </group>
  )
}