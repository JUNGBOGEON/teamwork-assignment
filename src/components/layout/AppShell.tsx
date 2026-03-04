'use client';

import { useEffect } from 'react';
import { useDrawingStore } from '@/stores/drawing-store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { NormalizedData } from '@/types';
import Header from './Header';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';
import DrawingViewer from '@/components/viewer/DrawingViewer';

interface AppShellProps {
  data: NormalizedData;
}

export default function AppShell({ data }: AppShellProps) {
  const initialize = useDrawingStore((s) => s.initialize);

  useEffect(() => {
    initialize(data);
  }, [data, initialize]);

  useKeyboardShortcuts();

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <DrawingViewer />
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
