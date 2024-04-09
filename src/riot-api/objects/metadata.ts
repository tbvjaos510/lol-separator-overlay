import type { ProcessAPI } from 'src/riot-api/api/ProcessAPI';
import type { Offset } from './offset';

export interface Metadata {
  championMetas: ChampionMetadata[];
  offset: Offset;
  version: string;
  region: string;
  process: ProcessAPI;
}

export interface ChampionMetadata {
  id: string;
  key: number;
  name: string;
  squareImageUrl: string;
}
