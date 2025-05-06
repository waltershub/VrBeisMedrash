"use client"

import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import { useEffect, useRef, useState } from 'react';
import { DoubleSide } from 'three';
import { Text } from "@react-three/drei";

// Hebrew sample texts
const hebrewTexts = [
  "בראשית ברא אלהים את השמים ואת הארץ׃ והארץ היתה תהו ובהו וחשך על־פני תהום ורוח אלהים מרחפת על־פני המים׃",
  "ויאמר אלהים יהי אור ויהי־אור׃ וירא אלהים את־האור כי־טוב ויבדל אלהים בין האור ובין החשך׃",
  "אָמַר רַבִּי שִׁמְעוֹן: לָא תֵּימָא דְּעַלְמָא אִתְבְּרֵי בְּמַאֲמָר, אֶלָּא בַּעֲשָׂרָה מַאֲמָרוֹת אִתְבְּרֵי.",
  "אָמַר רַבִּי אֶלְעָזָר אָמַר רַבִּי חֲנִינָא: תַּלְמִידֵי חֲכָמִים מַרְבִּים שָׁלוֹם בָּעוֹלָם",
  "הִלֵּל אוֹמֵר: אַל תִּפְרֹשׁ מִן הַצִּבּוּר. וְאַל תַּאֲמִין בְּעַצְמְךָ עַד יוֹם מוֹתְךָ.",
  "אִם אֵין אֲנִי לִי, מִי לִי. וּכְשֶׁאֲנִי לְעַצְמִי, מָה אֲנִי. וְאִם לֹא עַכְשָׁיו, אֵימָתַי"
];

const bookTitles = {
  "default": "ספר קודש"
};

type PagesProps = {
  position?: [number, number, number];
  pageScale?: number;
};

export default function Pages({
  position = [0, 0, 0],
  pageScale = 0.707,
}: PagesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const flippingRef = useRef(false);
  
  // Page turning animation
  const [{ leftRotation, rightRotation }, api] = useSpring(() => ({ 
    leftRotation: 0, 
    rightRotation: 0, 
    config: { mass: 1, tension: 180, friction: 12 } 
  }));

  // Handle next page
  const handleNextPage = () => {
    if (flippingRef.current || currentPage >= totalPages) return;
    flippingRef.current = true;
    
    api.start({
      from: { leftRotation: 0 },
      to: { leftRotation: Math.PI },
      onRest: () => {
        setCurrentPage(page => Math.min(page + 2, totalPages));
        api.set({ leftRotation: 0 });
        flippingRef.current = false;
      },
    });
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (flippingRef.current || currentPage <= 1) return;
    flippingRef.current = true;
    
    api.start({
      from: { rightRotation: 0 },
      to: { rightRotation: -Math.PI },
      onRest: () => {
        setCurrentPage(page => Math.max(page - 2, 1));
        api.set({ rightRotation: 0 });
        flippingRef.current = false;
      },
    });
  };

  // Handle hover interactions
  const handlePointerEnter = (side: 'left' | 'right') => {
    setHoveredSide(side);
  };

  const handlePointerLeave = () => {
    setHoveredSide(null);
  };

  // Book dimensions - larger for better visibility
  const pageWidth = 0.5;
  const pageHeight = pageWidth / pageScale;

  return (
    <group position={position}>
      {/* LEFT PAGE */}
      <group position={[-pageWidth/2, 0, 0]}>
        <animated.mesh
          rotation-y={leftRotation}
          onPointerEnter={() => handlePointerEnter('left')}
          onPointerLeave={handlePointerLeave}
          onClick={handlePrevPage}
        >
          <planeGeometry args={[pageWidth, pageHeight]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.5}
            metalness={0.1}
            side={DoubleSide}
          />
        </animated.mesh>
        
        {/* Hebrew text directly on the page surface */}
        <Text
          position={[0, 0.1, 0.01]}
          rotation={[0, 0, 0]}
          fontSize={0.04}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          maxWidth={pageWidth * 0.8}
          lineHeight={1.5}
          textAlign="right"
        >
          {hebrewTexts[(currentPage-1) % hebrewTexts.length]}
        </Text>
        
        {/* Page number on the left page */}
        <Text
          position={[0, -pageHeight/2 + 0.05, 0.01]}
          rotation={[0, 0, 0]}
          fontSize={0.035}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {currentPage-1}
        </Text>
        
        {/* Left navigation hint */}
        {hoveredSide === 'left' && currentPage > 1 && (
          <group position={[-0.15, 0, 0.01]}>
            <mesh>
              <planeGeometry args={[0.2, 0.2]} />
              <meshBasicMaterial color="#0000ff" transparent opacity={0.6} />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.05}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              ◀ Prev
            </Text>
          </group>
        )}
      </group>
      
      {/* RIGHT PAGE */}
      <group position={[pageWidth/2, 0, 0]}>
        <animated.mesh
          rotation-y={rightRotation}
          onPointerEnter={() => handlePointerEnter('right')}
          onPointerLeave={handlePointerLeave}
          onClick={handleNextPage}
        >
          <planeGeometry args={[pageWidth, pageHeight]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.5}
            metalness={0.1}
            side={DoubleSide}
          />
        </animated.mesh>
        
        {/* Hebrew text directly on the page surface */}
        <Text
          position={[0, 0.1, 0.01]}
          rotation={[0, 0, 0]}
          fontSize={0.04}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          maxWidth={pageWidth * 0.8}
          lineHeight={1.5}
          textAlign="right"
        >
          {hebrewTexts[currentPage % hebrewTexts.length]}
        </Text>
        
        {/* Page number on the right page */}
        <Text
          position={[0, -pageHeight/2 + 0.05, 0.01]}
          rotation={[0, 0, 0]}
          fontSize={0.035}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {currentPage}
        </Text>
        
        {/* Right navigation hint */}
        {hoveredSide === 'right' && currentPage < totalPages && (
          <group position={[0.15, 0, 0.01]}>
            <mesh>
              <planeGeometry args={[0.2, 0.2]} />
              <meshBasicMaterial color="#0000ff" transparent opacity={0.6} />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.05}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Next ▶
            </Text>
          </group>
        )}
      </group>
      
      {/* BOOK BINDING */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.08, pageHeight, 0.04]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.8} />
      </mesh>
      
      {/* BOOK COVER EDGES */}
      {/* Cover edge at bottom */}
      <mesh position={[0, -pageHeight/2 - 0.02, 0]}>
        <boxGeometry args={[pageWidth*2 + 0.08, 0.04, 0.02]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.8} />
      </mesh>
      
      {/* Cover edge at top */}
      <mesh position={[0, pageHeight/2 + 0.02, 0]}>
        <boxGeometry args={[pageWidth*2 + 0.08, 0.04, 0.02]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.8} />
      </mesh>
      
      {/* Page count indicator */}
      <Text
        position={[0, -pageHeight/2 - 0.08, 0]}
        fontSize={0.05}
        color="black"
        anchorX="center"
        anchorY="top"
      >
        {`Page ${currentPage}-${currentPage+1} of ${totalPages}`}
      </Text>
    </group>
  );
}