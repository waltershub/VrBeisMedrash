"use client"

import { useRef } from 'react'
import { Text } from "@react-three/drei"
import { Mesh } from 'three'
import { useSpring, a } from '@react-spring/three'
import { BookProps } from './types'
import { useBookContext } from './BookContext'
import Pages from './Pages'

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
  
  // New handler specifically for dismissing the book
  const handleDismissClick = (event: React.MouseEvent) => {
    // Stop event propagation to prevent triggering the book click
    event.stopPropagation();
    
    // Close book and return to shelf
    setIsBookOpen(false);
    setSelectedBook(null);
  };
  
  // Calculate PDF URL based on book title
  const getPdfUrl = () => {
    return '/pdfs/Hebrewbooks_org_37952.pdf';
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
        <mesh ref={meshRef} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.4, 0.05]} />
          <meshStandardMaterial color={color} roughness={0.7} />
          
          {/* Book title on the spine */}
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
          
          {/* Display category if the book is selected */}
          {isSelected && parentCategory && (
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
          )}
          
          {/* Dismiss button - only visible when the book is selected */}
          {isSelected && (
            <group position={[0, -0.65, 0]} onClick={handleDismissClick}>
              {/* Button background */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.25, 0.08, 0.02]} />
                <meshStandardMaterial color="red" roughness={0.5} />
              </mesh>
              
              {/* Button text */}
              <Text
                position={[0, 0, 0.011]}
                rotation={[0, 0, 0]}
                fontSize={0.03}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                Dismiss
              </Text>
            </group>
          )}
        </mesh>
      )}
      
      {/* OPEN BOOK - only visible when selected and opened */}
      {isSelected && isBookOpen && (
        <>
          <Pages 
            pdfUrl={getPdfUrl()}
            position={[0, 0, 0]}
            pageScale={0.707}
          />
          
          {/* Dismiss button for open book - positioned below the open book */}
          <group position={[0, -0.8, 0]} onClick={handleDismissClick}>
            {/* Button background */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.4, 0.1, 0.02]} />
              <meshStandardMaterial color="red" roughness={0.5} />
            </mesh>
            
            {/* Button text */}
            <Text
              position={[0, 0, 0.011]}
              rotation={[0, 0, 0]}
              fontSize={0.04}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Dismiss
            </Text>
          </group>
        </>
      )}
    </a.group>
  )
}