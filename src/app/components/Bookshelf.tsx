"use client"

import { useRef } from 'react'
import { Group } from 'three'
import { Book } from './Book'
import { BookCategory, BookData } from './types'

export function Bookshelf() {
  const groupRef = useRef<Group>(null)
  
  // Define book categories with distinctive colors
  const bookCategories: BookCategory[] = [
    { name: "Torah", baseHue: 200, count: 5 }, // Blues
    { name: "Neviim", baseHue: 120, count: 5 }, // Greens
    { name: "Ketuvim", baseHue: 300, count: 5 }, // Purples
    { name: "Talmud", baseHue: 0, count: 5 }, // Reds
    { name: "Midrash", baseHue: 40, count: 5 }, // Oranges/Browns
  ];
  
  // Create an array for all books with their properties
  const books: BookData[] = [];
  let bookIndex = 0;
  
  bookCategories.forEach((category, categoryIndex) => {
    for (let i = 0; i < category.count; i++) {
      books.push({
        position: [bookIndex * 0.18 - 2.2, 1.6, -1.95 + Math.random() * 0.05] as [number, number, number],
        color: `hsl(${category.baseHue + i * 5}, ${65 + Math.random() * 15}%, ${40 + Math.random() * 20}%)`,
        title: category.name,
        index: i
      });
      bookIndex++;
    }
  });
  
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