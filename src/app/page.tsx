import { loadMetadata } from '@/lib/metadata';
import { normalizeMetadata } from '@/lib/normalize';
import AppShellWrapper from '@/components/layout/AppShellWrapper';
import type { DisciplineView } from '@/types';

export default function Home() {
  const raw = loadMetadata();
  const data = normalizeMetadata(raw);

  // Serialize Maps to plain objects for server→client boundary
  const serializedDisciplineMap: Record<
    string,
    Record<string, DisciplineView>
  > = {};

  for (const [drawingId, discMap] of data.disciplineMap) {
    serializedDisciplineMap[drawingId] = {};
    for (const [discName, discView] of discMap) {
      serializedDisciplineMap[drawingId][discName] = discView;
    }
  }

  return (
    <AppShellWrapper
      project={data.project}
      buildings={data.buildings}
      siteMap={data.siteMap}
      allDisciplineNames={data.allDisciplineNames}
      serializedDisciplineMap={serializedDisciplineMap}
    />
  );
}
