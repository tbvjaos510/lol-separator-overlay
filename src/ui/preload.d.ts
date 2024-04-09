import { Snapshot } from 'src/riot-api/objects/snapshot';

declare global {
  interface Window {
    api: {
      onUpdateSnapshot: (
        callback: (snapshot: Snapshot) => void,
      ) => () => void;
      watchStart: () => void;
      watchStop: () => void;
    };
  }
}
