'use client';

import type {
  Building,
  DisciplineView,
  NormalizedData,
  Project,
} from '@/types';
import AppShell from './AppShell';

export interface SerializedProps {
  project: Project;
  buildings: Building[];
  siteMap: Building;
  allDisciplineNames: string[];
  serializedDisciplineMap: Record<string, Record<string, DisciplineView>>;
}

export default function AppShellWrapper({
  project,
  buildings,
  siteMap,
  allDisciplineNames,
  serializedDisciplineMap,
}: SerializedProps) {
  const disciplineMap = new Map<string, Map<string, DisciplineView>>();

  for (const [drawingId, discObj] of Object.entries(serializedDisciplineMap)) {
    const innerMap = new Map<string, DisciplineView>();
    for (const [discName, discView] of Object.entries(discObj)) {
      const reconstructed: DisciplineView = {
        ...discView,
        revisions: discView.revisions.map((r) => ({
          ...r,
          date: new Date(r.date),
        })),
        regions: discView.regions.map((reg) => ({
          ...reg,
          revisions: reg.revisions.map((r) => ({
            ...r,
            date: new Date(r.date),
          })),
          latestRevision: reg.latestRevision
            ? {
                ...reg.latestRevision,
                date: new Date(reg.latestRevision.date),
              }
            : null,
        })),
        latestRevision: discView.latestRevision
          ? {
              ...discView.latestRevision,
              date: new Date(discView.latestRevision.date),
            }
          : null,
      };
      innerMap.set(discName, reconstructed);
    }
    disciplineMap.set(drawingId, innerMap);
  }

  const data: NormalizedData = {
    project,
    buildings,
    siteMap,
    allDisciplineNames,
    disciplineMap,
  };

  return <AppShell data={data} />;
}
