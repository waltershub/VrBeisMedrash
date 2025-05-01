import { Vector3 } from 'three';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface BookProps {
  position: [number, number, number];
  color: string;
  index: number;
  title?: string;
}

export interface BookData {
  position: [number, number, number];
  color: string;
  title: string;
  index: number;
}

export interface BookCategory {
  name: string;
  baseHue: number;
  count: number;
}

export interface TableProps {
  position?: [number, number, number];
  size?: [number, number, number];
  color?: string;
}

export interface ChairProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}