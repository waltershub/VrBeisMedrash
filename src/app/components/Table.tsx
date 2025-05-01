"use client"

import { useRef } from 'react'
import { Mesh } from 'three'
import { TableProps } from './types'

export function Table({
  position = [0, 0.4, -1],
  size = [1.2, 0.8, 0.8],
  color = "#8d6e63"
}: TableProps) {
  const meshRef = useRef<Mesh>(null)
  
  return (
    <mesh 
      ref={meshRef}
      position={position} 
      receiveShadow 
      castShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}