"use client"

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Suspense } from 'react'
import { Environment, OrbitControls } from "@react-three/drei"

// Import our refactored components
import { Bookshelf } from './Bookshelf'
import { Table } from './Table'
import { Chair } from './Chair'

// Create store just like in your Test component
const store = createXRStore()

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
            <Table />
            <Chair />
          </Suspense>
        </XR>
        <OrbitControls target={[0, 1.5, -2]} />
      </Canvas>
    </div>
  )
}
