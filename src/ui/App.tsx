import { useEffect, useState } from 'react';
import { Snapshot } from 'src/riot-api/objects/snapshot';

export function App() {
  const [isWatched, setIsWatched] = useState(false);
  const [snapshot, setSnapshot] = useState<
    Snapshot | undefined
  >(undefined);

  useEffect(() => {
    const remove = window.api.onUpdateSnapshot(
      (snapshot) => {
        setSnapshot(snapshot);
      },
    );

    return remove;
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          setIsWatched(!isWatched);

          if (isWatched) {
            window.api.watchStop();
          } else {
            window.api.watchStart();
          }
        }}
      >
        {isWatched ? 'Stop Watching' : 'Start Watching'}
      </button>
      <pre>{JSON.stringify(snapshot, null, 2)}</pre>
    </div>
  );
}
