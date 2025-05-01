"use client"

import { useRef } from 'react'
import { Group } from 'three'
import { ChairProps } from './types'

export function Chair({
  position = [0, 0.45, -0.2],
  rotation = [0, 0, 0],
  color = "#5d4037"
}: ChairProps) {
  const groupRef = useRef<Group>(null)
  const darkColor = "#4e342e" // Slightly darker color for legs
  
  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Back */}
      <mesh position={[0, -0.225, -0.225]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Chair legs */}
      <mesh position={[0.2, -0.225, 0.2]} castShadow>
        <boxGeometry args={[0.04, 0.45, 0.04]} />
        <meshStandardMaterial color={darkColor} roughness={0.7} />
      </mesh>
      
      <mesh position={[-0.2, -0.225, 0.2]} castShadow>
        <boxGeometry args={[0.04, 0.45, 0.04]} />
        <meshStandardMaterial color={darkColor} roughness={0.7} />
      </mesh>
      
      <mesh position={[0.2, -0.225, -0.225]} castShadow>
        <boxGeometry args={[0.04, 0.45, 0.04]} />
        <meshStandardMaterial color={darkColor} roughness={0.7} />
      </mesh>
      
      <mesh position={[-0.2, -0.225, -0.225]} castShadow>
        <boxGeometry args={[0.04, 0.45, 0.04]} />
        <meshStandardMaterial color={darkColor} roughness={0.7} />
      </mesh>
    </group>
  )
}