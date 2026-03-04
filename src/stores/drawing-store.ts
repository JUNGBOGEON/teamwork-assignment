'use client';

import { create } from 'zustand';
import type { Building, DisciplineView, NormalizedData } from '@/types';

interface DrawingState {
  // Data
  project: { name: string; unit: string } | null;
  buildings: Building[];
  siteMap: Building | null;
  disciplineMap: Map<string, Map<string, DisciplineView>>;
  allDisciplineNames: string[];

  // Selection
  selectedBuildingId: string | null;
  selectedDiscipline: string | null;
  selectedRegion: string | null;
  selectedRevision: string | null;

  // Actions
  initialize: (data: NormalizedData) => void;
  selectBuilding: (id: string) => void;
  selectDiscipline: (name: string) => void;
  selectRegion: (name: string | null) => void;
  selectRevision: (version: string) => void;
  goToSitePlan: () => void;

  // Derived helpers
  getSelectedBuilding: () => Building | null;
  getSelectedDisciplineView: () => DisciplineView | null;
  getDisciplinesForBuilding: (buildingId: string) => DisciplineView[];
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  // Data
  project: null,
  buildings: [],
  siteMap: null,
  disciplineMap: new Map(),
  allDisciplineNames: [],

  // Selection
  selectedBuildingId: null,
  selectedDiscipline: null,
  selectedRegion: null,
  selectedRevision: null,

  initialize: (data) => {
    set({
      project: data.project,
      buildings: data.buildings,
      siteMap: data.siteMap,
      disciplineMap: data.disciplineMap,
      allDisciplineNames: data.allDisciplineNames,
    });
  },

  selectBuilding: (id) => {
    const { disciplineMap } = get();
    const discMap = disciplineMap.get(id);
    if (!discMap) return;

    const firstDisc = discMap.keys().next().value ?? null;
    let firstRegion: string | null = null;
    let latestRevision: string | null = null;

    if (firstDisc) {
      const discView = discMap.get(firstDisc)!;
      if (discView.hasRegions && discView.regions.length > 0) {
        firstRegion = discView.regions[0].name;
        latestRevision = discView.regions[0].latestRevision?.version ?? null;
      } else if (discView.latestRevision) {
        latestRevision = discView.latestRevision.version;
      }
    }

    set({
      selectedBuildingId: id,
      selectedDiscipline: firstDisc,
      selectedRegion: firstRegion,
      selectedRevision: latestRevision,
    });
  },

  selectDiscipline: (name) => {
    const { selectedBuildingId, disciplineMap } = get();
    if (!selectedBuildingId) return;

    const discMap = disciplineMap.get(selectedBuildingId);
    if (!discMap) return;

    const discView = discMap.get(name);
    if (!discView) return;

    let region: string | null = null;
    let revision: string | null = null;

    if (discView.hasRegions && discView.regions.length > 0) {
      region = discView.regions[0].name;
      revision = discView.regions[0].latestRevision?.version ?? null;
    } else if (discView.latestRevision) {
      revision = discView.latestRevision.version;
    }

    set({
      selectedDiscipline: name,
      selectedRegion: region,
      selectedRevision: revision,
    });
  },

  selectRegion: (name) => {
    const { selectedBuildingId, selectedDiscipline, disciplineMap } = get();
    if (!selectedBuildingId || !selectedDiscipline) return;

    const discView = disciplineMap
      .get(selectedBuildingId)
      ?.get(selectedDiscipline);
    if (!discView) return;

    if (name) {
      const region = discView.regions.find((r) => r.name === name);
      set({
        selectedRegion: name,
        selectedRevision: region?.latestRevision?.version ?? null,
      });
    } else {
      set({ selectedRegion: null });
    }
  },

  selectRevision: (version) => {
    set({ selectedRevision: version });
  },

  goToSitePlan: () => {
    set({
      selectedBuildingId: null,
      selectedDiscipline: null,
      selectedRegion: null,
      selectedRevision: null,
    });
  },

  getSelectedBuilding: () => {
    const { selectedBuildingId, buildings, siteMap } = get();
    if (!selectedBuildingId) return siteMap;
    return buildings.find((b) => b.id === selectedBuildingId) ?? null;
  },

  getSelectedDisciplineView: () => {
    const { selectedBuildingId, selectedDiscipline, disciplineMap } = get();
    if (!selectedBuildingId || !selectedDiscipline) return null;
    return (
      disciplineMap.get(selectedBuildingId)?.get(selectedDiscipline) ?? null
    );
  },

  getDisciplinesForBuilding: (buildingId) => {
    const { disciplineMap } = get();
    const discMap = disciplineMap.get(buildingId);
    if (!discMap) return [];
    return Array.from(discMap.values());
  },
}));
