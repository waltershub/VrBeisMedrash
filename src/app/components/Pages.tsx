"use client"

import { useFrame } from '@react-three/fiber';
import { animated, useSpring } from '@react-spring/three';
import { useRef, useState } from 'react';
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

// Navigation button component
const NavigationButton = ({ 
  position, 
  text, 
  visible = true 
}: { 
  position: [number, number, number], 
  text: string, 
  visible: boolean 
}) => {
  if (!visible) return null;
  
  return (
    <group position={position}>
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
        {text}
      </Text>
    </group>
  );
};

// Book page component (single page)
const BookPage = ({ 
  side, 
  pageNumber, 
  textContent,
  rotation, 
  width,
  height,
  onNavigate,
  onPointerEnter,
  onPointerLeave
}: { 
  side: 'left' | 'right',
  pageNumber: number,
  textContent: string,
  rotation: any,
  width: number,
  height: number,
  onNavigate: () => void,
  onPointerEnter: () => void,
  onPointerLeave: () => void
}) => {
  return (
    <group position={[side === 'left' ? -width/2 : width/2, 0, 0]}>
      <animated.mesh
        rotation-y={rotation}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onNavigate}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.5}
          metalness={0.1}
          side={DoubleSide}
        />
      </animated.mesh>
      
      {/* Hebrew text on page */}
      <Text
        position={[0, 0.1, 0.01]}
        rotation={[0, 0, 0]}
        fontSize={0.04}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={width * 0.8}
        lineHeight={1.5}
        textAlign="right"
      >
        {textContent}
      </Text>
      
      {/* Page number */}
      <Text
        position={[0, -height/2 + 0.05, 0.01]}
        rotation={[0, 0, 0]}
        fontSize={0.035}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {pageNumber}
      </Text>
    </group>
  );
};

// Book binding component
const BookBinding = ({ height }: { height: number }) => (
  <mesh position={[0, 0, -0.01]}>
    <boxGeometry args={[0.08, height, 0.04]} />
    <meshStandardMaterial color="#8d6e63" roughness={0.8} />
  </mesh>
);

// Book edge component
const BookEdge = ({ width, height, position }: { width: number, height: number, position: [number, number, number] }) => (
  <mesh position={position}>
    <boxGeometry args={[width, height, 0.02]} />
    <meshStandardMaterial color="#6d4c41" roughness={0.8} />
  </mesh>
);

// Page counter component
const PageCounter = ({ currentPage, totalPages, position }: { currentPage: number, totalPages: number, position: [number, number, number] }) => (
  <Text
    position={position}
    fontSize={0.05}
    color="black"
    anchorX="center"
    anchorY="top"
  >
    {`Page ${currentPage}-${currentPage+1} of ${totalPages}`}
  </Text>
);

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

  // Book dimensions
  const pageWidth = 0.5;
  const pageHeight = pageWidth / pageScale;
  
  return (
    <group position={position}>
      {/* Left Page */}
      <BookPage
        side="left"
        pageNumber={currentPage-1}
        textContent={hebrewTexts[(currentPage-1) % hebrewTexts.length]}
        rotation={leftRotation}
        width={pageWidth}
        height={pageHeight}
        onNavigate={handlePrevPage}
        onPointerEnter={() => setHoveredSide('left')}
        onPointerLeave={() => setHoveredSide(null)}
      />
      
      {/* Left Navigation Hint */}
      <NavigationButton 
        position={[-pageWidth/2 - 0.15, 0, 0.01]} 
        text="◀ Prev" 
        visible={hoveredSide === 'left' && currentPage > 1}
      />
      
      {/* Right Page */}
      <BookPage
        side="right"
        pageNumber={currentPage}
        textContent={hebrewTexts[currentPage % hebrewTexts.length]}
        rotation={rightRotation}
        width={pageWidth}
        height={pageHeight}
        onNavigate={handleNextPage}
        onPointerEnter={() => setHoveredSide('right')}
        onPointerLeave={() => setHoveredSide(null)}
      />
      
      {/* Right Navigation Hint */}
      <NavigationButton 
        position={[pageWidth/2 + 0.15, 0, 0.01]} 
        text="Next ▶" 
        visible={hoveredSide === 'right' && currentPage < totalPages}
      />
      
      {/* Book Structure Components */}
      <BookBinding height={pageHeight} />
      
      {/* Bottom Edge */}
      <BookEdge 
        width={pageWidth*2 + 0.08} 
        height={0.04} 
        position={[0, -pageHeight/2 - 0.02, 0]} 
      />
      
      {/* Top Edge */}
      <BookEdge 
        width={pageWidth*2 + 0.08} 
        height={0.04} 
        position={[0, pageHeight/2 + 0.02, 0]} 
      />
      
      {/* Page Counter */}
      <PageCounter 
        currentPage={currentPage} 
        totalPages={totalPages} 
        position={[0, -pageHeight/2 - 0.08, 0]}
      />
    </group>
  );
}