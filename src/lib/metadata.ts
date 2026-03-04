import type { RawMetadata } from '@/types';
import rawMetadata from '@/data/metadata.json';

export function loadMetadata(): RawMetadata {
  return rawMetadata as unknown as RawMetadata;
}
