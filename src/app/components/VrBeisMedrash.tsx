"use client"

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { useState, Suspense, useRef } from 'react'
import { Environment, OrbitControls, Text } from "@react-three/drei"
import * as THREE from 'three'

// Create store just like in your Test component
const store = createXRStore()

// Book component with interaction
function Book({ position, color, index, title = "Sefer" }) {
  const [lifted, setLifted] = useState(false)
  const meshRef = useRef()
  
  return (
    <mesh 
      ref={meshRef}
      position={[position[0], lifted ? position[1] + 0.3 : position[1], position[2]]} 
      onClick={() => setLifted(!lifted)}
      rotation={[0, 0, 0]}
    >
      <boxGeometry args={[0.15, 0.4, 0.05]} />
      <meshStandardMaterial color={color} roughness={0.7} />
      
      {/* Book title on the spine */}
      <Text
        position={[0, 0, -0.026]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.025}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.13}
      >
        {`${title} ${index+1}`}
      </Text>
    </mesh>
  )
}

// Bookshelf component with a proper wooden structure
function Bookshelf() {
  // Define book categories with distinctive colors
  const bookCategories = [
    { name: "Torah", baseHue: 200, count: 5 }, // Blues
    { name: "Neviim", baseHue: 120, count: 5 }, // Greens
    { name: "Ketuvim", baseHue: 300, count: 5 }, // Purples
    { name: "Talmud", baseHue: 0, count: 5 }, // Reds
    { name: "Midrash", baseHue: 40, count: 5 }, // Oranges/Browns
  ];
  
  // Create an array for all books with their properties
  const books = [];
  let bookIndex = 0;
  
  bookCategories.forEach((category, categoryIndex) => {
    for (let i = 0; i < category.count; i++) {
      books.push({
        position: [bookIndex * 0.18 - 2.2, 1.6, -1.95 + Math.random() * 0.05],
        color: `hsl(${category.baseHue + i * 5}, ${65 + Math.random() * 15}%, ${40 + Math.random() * 20}%)`,
        title: category.name,
        index: i
      });
      bookIndex++;
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
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
      
      {/* Additional beis medrash elements */}
      {/* Table */}
      <mesh position={[0, 0.4, -1]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.7} />
      </mesh>
      
      {/* Chair */}
      <group position={[0, 0.45, -0.2]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.225, -0.225]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} />
        </mesh>
        {/* Chair legs */}
        <mesh position={[0.2, -0.225, 0.2]} castShadow>
          <boxGeometry args={[0.04, 0.45, 0.04]} />
          <meshStandardMaterial color="#4e342e" roughness={0.7} />
        </mesh>
        <mesh position={[-0.2, -0.225, 0.2]} castShadow>
          <boxGeometry args={[0.04, 0.45, 0.04]} />
          <meshStandardMaterial color="#4e342e" roughness={0.7} />
        </mesh>
        <mesh position={[0.2, -0.225, -0.225]} castShadow>
          <boxGeometry args={[0.04, 0.45, 0.04]} />
          <meshStandardMaterial color="#4e342e" roughness={0.7} />
        </mesh>
        <mesh position={[-0.2, -0.225, -0.225]} castShadow>
          <boxGeometry args={[0.04, 0.45, 0.04]} />
          <meshStandardMaterial color="#4e342e" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

export default function VrBeisMedrash() {
  return (
    <div className="relative h-full w-full">
      <button 
        onClick={() => store.enterVR()}
        className="absolute top-2 left-2 z-10 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Enter VR
      </button>
      <Canvas shadows camera={{ position: [0, 1.6, 1], fov: 60 }}>
        <XR store={store}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          <spotLight
            position={[0, 3, 0]}
            angle={0.6}
            penumbra={0.5}
            intensity={0.8}
            castShadow
            shadow-bias={-0.0001}
          />
          
          <Suspense fallback={null}>
            <Environment preset="apartment" />
            <Bookshelf />
          </Suspense>
        </XR>
        <OrbitControls target={[0, 1.5, -2]} />
      </Canvas>
    </div>
  )
}
