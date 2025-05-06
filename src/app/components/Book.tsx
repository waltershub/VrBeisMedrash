"use client"

import { useRef } from 'react'
import { Text } from "@react-three/drei"
import { Mesh } from 'three'
import { useSpring, a } from '@react-spring/three'
import { BookProps } from './types'
import { useBookContext } from './BookContext'
import Pages from './Pages'

// Book Title component for rendering text on spine
const BookTitle = ({ title }: { title: string }) => (
  <Text
    position={[0, 0, 0.026]}
    rotation={[0, 0, 0]}
    fontSize={0.025}
    color="#000"
    anchorX="center"
    anchorY="middle"
    maxWidth={0.13}
  >
    {title}
  </Text>
)

// Book Category component to display when book is selected
const BookCategory = ({ parentCategory, talmudType }: { parentCategory?: string, talmudType?: string }) => (
  <Text
    position={[0, -0.5, 0]} 
    rotation={[0, 0, 0]}
    fontSize={0.04}
    color="white"
    anchorX="center"
    anchorY="middle"
    maxWidth={0.5}
  >
    {parentCategory}
    {talmudType ? ` (${talmudType})` : ''}
  </Text>
)

// Dismiss Button component
const DismissButton = ({ position, fontSize, width, height, onDismiss }: { 
  position: [number, number, number], 
  fontSize: number, 
  width: number, 
  height: number,
  onDismiss: (event: React.MouseEvent) => void 
}) => (
  <group position={position} onClick={onDismiss}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[width, height, 0.02]} />
      <meshStandardMaterial color="red" roughness={0.5} />
    </mesh>
    <Text
      position={[0, 0, 0.011]}
      rotation={[0, 0, 0]}
      fontSize={fontSize}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      Dismiss
    </Text>
  </group>
)

// Closed Book View component
const ClosedBookView = ({ 
  meshRef, 
  color, 
  title, 
  isSelected, 
  parentCategory,
  talmudType,
  onDismiss 
}: {
  meshRef: React.RefObject<Mesh | null>,  // Updated to allow null values
  color: string,
  title: string,
  isSelected: boolean,
  parentCategory?: string,
  talmudType?: string,
  onDismiss: (event: React.MouseEvent) => void
}) => (
  <mesh ref={meshRef as React.RefObject<Mesh>} castShadow receiveShadow>
    <boxGeometry args={[0.15, 0.4, 0.05]} />
    <meshStandardMaterial color={color} roughness={0.7} />
    
    {/* Book title on the spine */}
    <BookTitle title={title} />
    
    {/* Display category if the book is selected */}
    {isSelected && parentCategory && (
      <BookCategory parentCategory={parentCategory} talmudType={talmudType} />
    )}
    
    {/* Dismiss button - only visible when the book is selected */}
    {isSelected && (
      <DismissButton 
        position={[0, -0.65, 0]} 
        fontSize={0.03} 
        width={0.25} 
        height={0.08} 
        onDismiss={onDismiss} 
      />
    )}
  </mesh>
)

// Open Book View component
const OpenBookView = ({ onDismiss }: { onDismiss: (event: React.MouseEvent) => void }) => (
  <>
    <Pages 
      position={[0, 0, 0]}
      pageScale={0.707}
    />
    
    {/* Dismiss button for open book - positioned below the open book */}
    <DismissButton 
      position={[0, -0.8, 0]} 
      fontSize={0.04} 
      width={0.4} 
      height={0.1} 
      onDismiss={onDismiss} 
    />
  </>
)

export function Book({ position, color, index, title = "Sefer", parentCategory, talmudType }: BookProps) {
  const { selectedBook, setSelectedBook, isBookOpen, setIsBookOpen } = useBookContext();
  const meshRef = useRef<Mesh>(null);
  const isSelected = selectedBook?.index === index && selectedBook?.title === title;
  
  // Calculate positions
  const shelfPosition = position;
  // Position selected book in front of the user
  const selectedPosition: [number, number, number] = [0, 1.5, -1.5];
  
  // Animation springs for smooth transitions
  const { bookPosition, bookRotation, bookScale } = useSpring({
    bookPosition: isSelected ? selectedPosition : shelfPosition,
    // When selected, rotate and scale the book
    bookRotation: isSelected ? [0, isBookOpen ? 0 : Math.PI / 6, 0] : [0, 0, 0],
    bookScale: isSelected ? 1.5 : 1,
    config: { mass: 1, tension: 180, friction: 12 }
  });
  
  // Handle book selection
  const handleBookClick = () => {
    if (!isSelected) {
      // Select this book and move it in front of the user
      setSelectedBook({ position, color, title, index, parentCategory, talmudType });
      setIsBookOpen(false);
    } else if (!isBookOpen) {
      // Book is selected but not open, so open it
      setIsBookOpen(true);
    }
  };
  
  // Handler specifically for dismissing the book
  const handleDismissClick = (event: React.MouseEvent) => {
    // Stop event propagation to prevent triggering the book click
    event.stopPropagation();
    
    // Close book and return to shelf
    setIsBookOpen(false);
    setSelectedBook(null);
  };
  
  return (
    <a.group 
      position={bookPosition}
      rotation={bookRotation}
      scale={bookScale}
      onClick={handleBookClick}
    >
      {/* CLOSED BOOK - shown on shelf or when selected but not open */}
      {(!isBookOpen || !isSelected) && (
        <ClosedBookView
          meshRef={meshRef}
          color={color}
          title={title}
          isSelected={isSelected}
          parentCategory={parentCategory}
          talmudType={talmudType}
          onDismiss={handleDismissClick}
        />
      )}
      
      {/* OPEN BOOK - only visible when selected and opened */}
      {isSelected && isBookOpen && <OpenBookView onDismiss={handleDismissClick} />}
    </a.group>
  )
}