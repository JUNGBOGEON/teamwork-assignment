'use client';

import { useDrawingStore } from '@/stores/drawing-store';
import { useCurrentRevisions } from '@/hooks/useCurrentRevisions';

export default function RevisionTimeline() {
  const { selectedRevision, selectRevision } = useDrawingStore();
  const revisions = useCurrentRevisions();

  if (revisions.length === 0) return null;

  const latestVersion = revisions[revisions.length - 1]?.version;

  return (
    <div className="space-y-1">
      <h3 className="px-3 text-[10px] font-bold text-black uppercase tracking-[0.2em] pb-2 border-b border-black mb-2 mt-4">
        리비전 이력
      </h3>
      <div className="px-3 space-y-0">
        {revisions.map((rev, i) => {
          const isActive = rev.version === selectedRevision;
          const isLatest = rev.version === latestVersion;
          const isLast = i === revisions.length - 1;

          return (
            <button
              key={rev.version}
              onClick={() => selectRevision(rev.version)}
              className={`w-full text-left flex gap-3 py-2 transition-colors border-b border-black last:border-b-0 px-2 ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'
                }`}
            >
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center pt-1">
                <div
                  className={`w-2 h-2 shrink-0 ${isActive
                      ? 'bg-white border border-white'
                      : 'bg-black border border-black'
                    }`}
                />
                {!isLast && (
                  <div className={`w-px flex-1 mt-1 ${isActive ? 'bg-white/30' : 'bg-black'}`} />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-bold tracking-wider uppercase ${isActive ? 'text-white' : 'text-black'
                      }`}
                  >
                    {rev.version}
                  </span>
                  {isLatest && (
                    <span className={`px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider border ${isActive ? 'border-white text-white' : 'border-black text-black'
                      }`}>
                      최신
                    </span>
                  )}
                </div>
                <div className={`text-[10px] uppercase font-mono tracking-wider mt-0.5 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                  {rev.date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className={`text-[10px] mt-1 pr-2 ${isActive ? 'text-gray-200' : 'text-gray-700'}`}>
                  {rev.description}
                </div>
                {rev.changes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {rev.changes.map((change, ci) => (
                      <div
                        key={ci}
                        className={`text-[9px] flex items-start gap-1 p-1 border ${isActive ? 'border-white/20 text-gray-300' : 'border-black/10 text-gray-600'}`}
                      >
                        <span className="shrink-0 mt-0.5">·</span>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
