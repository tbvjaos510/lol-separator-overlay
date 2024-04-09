import { Metadata } from './metadata';
import { Unit } from './unit';
import { readFloat, readIntPtr } from '../utils/buffer';

export class Snapshot {
  public gameTime: number;
  public champions: Unit[] = [];
  public dragon: Unit;
  public baron: Unit;
  public herald: Unit;
  public turrets: Unit[] = [];
  public horde: Unit[] = [];
  public objectMap: Record<number, Unit> = {};
  public updatedThisFrame: Set<number> = new Set();
  public nextDragonType: string;

  private constructor() {
    // should not be called directly
  }

  static fromBuffer(metadata: Metadata): Snapshot {
    const snapshot = new Snapshot();

    const { offset, process } = metadata;
    const maxObjects = 500;

    const objectManagerPtr = readIntPtr(
      process.readBuffer(
        offset.GameOffsets.Manager,
        8,
        true,
      ),
      0,
    );

    let buffer = process.readBuffer(objectManagerPtr, 100);

    const toVisits: number[] = [
      readIntPtr(buffer, offset.GameOffsets.MapRoot),
    ];
    const visited: Set<number> = new Set();
    const pointers: number[] = [];
    let child1: number, child2: number, child3: number;

    let read = 0;

    while (read < maxObjects && toVisits.length > 0) {
      const current = toVisits.shift();

      if (!current || visited.has(current)) {
        continue;
      }
      read++;
      visited.add(current);

      buffer = process.readBuffer(current, 0x50);

      child1 = readIntPtr(buffer, 0);
      child2 = readIntPtr(buffer, 8);
      child3 = readIntPtr(buffer, 16);

      toVisits.push(child1, child2, child3);

      const addr = readIntPtr(
        buffer,
        offset.GameOffsets.MapNodeObject,
      );

      if (addr) {
        pointers.push(addr);
      }
    }
    snapshot.gameTime = readFloat(
      process.readBuffer(
        offset.GameOffsets.GameTime,
        4,
        true,
      ),
      0,
    );

    for (const pointer of pointers) {
      const unit = Unit.fromPointer(pointer, metadata);

      if (unit.networkId === 0) {
        continue;
      }

      if (
        unit.displayName.startsWith('Dragon_Indicator_')
      ) {
        snapshot.nextDragonType = unit.displayName
          .replace('.troy', '')
          .slice(17)
          .replace('Air', 'Cloud')
          .replace('Earth', 'Mountain')
          .replace('Fire', 'Infernal')
          .replace('Water', 'Ocean');
        continue;
      }

      snapshot.objectMap[unit.networkId] = unit;
      snapshot.updatedThisFrame.add(unit.networkId);

      if (unit.isChampion) {
        snapshot.champions.push(unit);
        continue;
      }
      if (unit.name.includes('Turret')) {
        snapshot.turrets.push(unit);
        continue;
      }

      if (unit.name.includes('Dragon')) {
        snapshot.dragon = unit;
        continue;
      }
      if (unit.name.includes('Baron')) {
        snapshot.baron = unit;
        continue;
      }
      if (unit.name.includes('SRU_Horde')) {
        snapshot.horde.push(unit);
        continue;
      }
      if (unit.name.includes('SRU_RiftHerald')) {
        snapshot.herald = unit;
        continue;
      }
    }

    return snapshot;
  }

  public toReadable() {
    return {
      gameTime: this.gameTime,
      champions: this.champions,
      dragon: this.dragon,
      baron: this.baron,
      herald: this.herald,
      turrets: this.turrets,
      nextDragonType: this.nextDragonType,
    };
  }
}
