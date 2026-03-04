import type {
  RawMetadata,
  RawDisciplineData,
  RawRevision,
  RawPolygon,
  RawImageTransform,
} from '@/types/metadata';
import type {
  NormalizedData,
  Building,
  DisciplineView,
  RegionView,
  RevisionView,
  PolygonData,
  ImageTransform,
  Position,
} from '@/types/drawing';

function normalizeImageTransform(raw: RawImageTransform): ImageTransform {
  return {
    relativeTo: raw.relativeTo,
    x: raw.x,
    y: raw.y,
    scale: raw.scale,
    rotation: raw.rotation,
  };
}

function normalizePolygon(raw: RawPolygon): PolygonData {
  return {
    vertices: raw.vertices,
    transform: {
      x: raw.polygonTransform.x,
      y: raw.polygonTransform.y,
      scale: raw.polygonTransform.scale,
      rotation: raw.polygonTransform.rotation,
    },
  };
}

function normalizeRevision(
  raw: RawRevision,
  regionName?: string,
): RevisionView {
  return {
    version: raw.version,
    image: raw.image,
    date: new Date(raw.date),
    dateString: raw.date,
    description: raw.description,
    changes: raw.changes,
    isInitial: raw.changes.length === 0,
    imageTransform: raw.imageTransform
      ? normalizeImageTransform(raw.imageTransform)
      : undefined,
    polygon: raw.polygon ? normalizePolygon(raw.polygon) : undefined,
    regionName,
  };
}

function normalizeDiscipline(
  drawingId: string,
  name: string,
  raw: RawDisciplineData,
): DisciplineView {
  const hasRegions = !!raw.regions && Object.keys(raw.regions).length > 0;

  const regions: RegionView[] = hasRegions
    ? Object.entries(raw.regions!).map(([regionName, regionData]) => {
        const revisions = regionData.revisions.map((r) =>
          normalizeRevision(r, regionName),
        );
        return {
          name: regionName,
          polygon: normalizePolygon(regionData.polygon),
          revisions,
          latestRevision: revisions.length > 0 ? revisions[revisions.length - 1] : null,
        };
      })
    : [];

  const revisions = (raw.revisions ?? []).map((r) => normalizeRevision(r));

  return {
    drawingId,
    name,
    image: raw.image,
    imageTransform: raw.imageTransform
      ? normalizeImageTransform(raw.imageTransform)
      : undefined,
    polygon: raw.polygon ? normalizePolygon(raw.polygon) : undefined,
    hasRegions,
    regions,
    revisions,
    latestRevision:
      revisions.length > 0 ? revisions[revisions.length - 1] : null,
  };
}

export function normalizeMetadata(raw: RawMetadata): NormalizedData {
  const buildings: Building[] = [];
  let siteMap: Building | null = null;
  const disciplineMap = new Map<string, Map<string, DisciplineView>>();
  const allDisciplineNames = raw.disciplines.map((d) => d.name);

  for (const [, drawing] of Object.entries(raw.drawings)) {
    const position: Position | null = drawing.position
      ? {
          vertices: drawing.position.vertices,
          imageTransform: normalizeImageTransform(
            drawing.position.imageTransform,
          ),
        }
      : null;

    const disciplineNames = drawing.disciplines
      ? Object.keys(drawing.disciplines)
      : [];

    const building: Building = {
      id: drawing.id,
      name: drawing.name,
      image: drawing.image,
      parentId: drawing.parent,
      position,
      disciplines: disciplineNames,
    };

    if (drawing.parent === null) {
      siteMap = building;
    } else {
      buildings.push(building);
    }

    if (drawing.disciplines) {
      const discMap = new Map<string, DisciplineView>();
      for (const [discName, discData] of Object.entries(
        drawing.disciplines,
      )) {
        discMap.set(
          discName,
          normalizeDiscipline(drawing.id, discName, discData),
        );
      }
      disciplineMap.set(drawing.id, discMap);
    }
  }

  if (!siteMap) {
    throw new Error('Site map (drawing 00) not found in metadata');
  }

  return {
    project: { name: raw.project.name, unit: raw.project.unit },
    buildings,
    siteMap,
    disciplineMap,
    allDisciplineNames,
  };
}
