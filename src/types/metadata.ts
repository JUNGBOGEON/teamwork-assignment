/** Raw types matching metadata.json structure exactly */

export interface RawMetadata {
  project: RawProject;
  disciplines: RawDisciplineRef[];
  drawings: Record<string, RawDrawing>;
}

export interface RawProject {
  name: string;
  unit: string;
}

export interface RawDisciplineRef {
  name: string;
}

export interface RawDrawing {
  id: string;
  name: string;
  image: string;
  parent: string | null;
  position: RawPosition | null;
  disciplines?: Record<string, RawDisciplineData>;
}

export interface RawPosition {
  vertices: [number, number][];
  imageTransform: RawImageTransform;
}

export interface RawImageTransform {
  relativeTo?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface RawPolygonTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface RawPolygon {
  vertices: [number, number][];
  polygonTransform: RawPolygonTransform;
}

export interface RawDisciplineData {
  image?: string;
  imageTransform?: RawImageTransform;
  polygon?: RawPolygon;
  regions?: Record<string, RawRegion>;
  revisions: RawRevision[];
}

export interface RawRegion {
  polygon: RawPolygon;
  revisions: RawRevision[];
}

export interface RawRevision {
  version: string;
  image: string;
  date: string;
  description: string;
  changes: string[];
  imageTransform?: RawImageTransform;
  polygon?: RawPolygon;
}
