import { OffsetAPI } from './riot-api/api/OffsetAPI';
import { ProcessAPI } from './riot-api/api/ProcessAPI';
import { RiotAPI } from './riot-api/api/RiotAPI';
import { Metadata } from './riot-api/objects/metadata';
import { Snapshot } from './riot-api/objects/snapshot';
async function main() {
  const version = '14.7.1';
  const region = 'ko_KR';
  const offset = OffsetAPI.fetch(version);

  const process = new ProcessAPI();

  process.openProcess();

  const metadata: Metadata = {
    championMetas: await RiotAPI.getChampions(
      version,
      region,
    ),
    offset,
    version,
    region,
    process,
  };

  const snapshot = Snapshot.fromBuffer(metadata);

  console.log(snapshot.toReadable());
}

main();
