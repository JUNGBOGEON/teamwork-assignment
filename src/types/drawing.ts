/** Normalized types for UI consumption */

export interface Project {
  name: string;
  unit: string;
}

export interface ImageTransform {
  relativeTo?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface PolygonTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface PolygonData {
  vertices: [number, number][];
  transform: PolygonTransform;
}

export interface Position {
  vertices: [number, number][];
  imageTransform: ImageTransform;
}

export interface Building {
  id: string;
  name: string;
  image: string;
  parentId: string | null;
  position: Position | null;
  disciplines: string[];
}

export interface RegionView {
  name: string;
  polygon: PolygonData;
  revisions: RevisionView[];
  latestRevision: RevisionView | null;
}

export interface DisciplineView {
  drawingId: string;
  name: string;
  image?: string;
  imageTransform?: ImageTransform;
  polygon?: PolygonData;
  hasRegions: boolean;
  regions: RegionView[];
  revisions: RevisionView[];
  latestRevision: RevisionView | null;
}

export interface RevisionView {
  version: string;
  image: string;
  date: Date;
  dateString: string;
  description: string;
  changes: string[];
  isInitial: boolean;
  imageTransform?: ImageTransform;
  polygon?: PolygonData;
  regionName?: string;
}

export type ViewerMode = 'single' | 'compare' | 'overlay';

export interface OverlayDiscipline {
  name: string;
  opacity: number;
  visible: boolean;
}

export type CompareStyle = 'side-by-side' | 'slider';

export interface NormalizedData {
  project: Project;
  buildings: Building[];
  siteMap: Building;
  disciplineMap: Map<string, Map<string, DisciplineView>>;
  allDisciplineNames: string[];
}
