"use client"

import { useState, useRef } from 'react'
import { Text } from "@react-three/drei"
import { Mesh } from 'three'
import { BookProps } from './types'

export function Book({ position, color, index, title = "Sefer" }: BookProps) {
  const [lifted, setLifted] = useState(false)
  const meshRef = useRef<Mesh>(null)
  
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