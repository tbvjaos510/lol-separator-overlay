import {
  readFloat,
  readInt,
  readIntPtr,
  readShort,
} from '../utils/buffer';
import { Metadata } from './metadata';

export class Unit {
  public id = 0;
  public networkId = 0;
  public teamId = 0;
  public team: 'red' | 'blue' = 'blue';
  public position: [number, number, number] = [0, 0, 0];
  public name = '';
  public displayName = '';
  public mana = 0;
  public maxMana = 0;
  public health = 0;
  public maxHealth = 0;
  public armor = 0;
  public bonusArmor = 0;
  public magicResist = 0;
  public bonusMagicResist = 0;
  public attackDamage = 0;
  public abilityPower = 0;
  public bonusAttackDamage = 0;
  public moveSpeed = 0;
  public attackRange = 0;
  public attackSpeed = 0;
  public isChampion = false;

  // champion specific
  public currentGold = 0;
  public totalGold = 0;
  public exp = 0;
  public level = 0;

  private constructor() {
    // should not be called directly
  }

  static fromPointer(
    pointer: number,
    metadata: Metadata,
  ): Unit {
    const unit = new Unit();
    const offset = metadata.offset;
    const buffer = metadata.process.readBuffer(
      pointer,
      offset.ObjectOffsets.Level + 4,
    );
    unit.id = readShort(buffer, offset.ObjectOffsets.ID);
    unit.networkId = readShort(
      buffer,
      offset.ObjectOffsets.NetworkID,
    );
    unit.position = [
      readFloat(buffer, offset.ObjectOffsets.Pos),
      readFloat(buffer, offset.ObjectOffsets.Pos + 4),
      readFloat(buffer, offset.ObjectOffsets.Pos + 8),
    ];
    unit.health = readFloat(
      buffer,
      offset.ObjectOffsets.Health,
    );
    unit.maxHealth = readFloat(
      buffer,
      offset.ObjectOffsets.MaxHealth,
    );
    unit.mana = readFloat(
      buffer,
      offset.ObjectOffsets.Mana,
    );
    unit.maxMana = readFloat(
      buffer,
      offset.ObjectOffsets.MaxMana,
    );
    unit.networkId = readInt(
      buffer,
      offset.ObjectOffsets.NetworkID,
    );
    unit.teamId = readInt(
      buffer,
      offset.ObjectOffsets.Team,
    );
    unit.team = unit.teamId === 100 ? 'blue' : 'red';
    unit.armor = readFloat(
      buffer,
      offset.ObjectOffsets.Armor,
    );
    unit.bonusArmor = readFloat(
      buffer,
      offset.ObjectOffsets.BonusArmor,
    );
    unit.magicResist = readFloat(
      buffer,
      offset.ObjectOffsets.MagicResist,
    );
    unit.bonusMagicResist = readFloat(
      buffer,
      offset.ObjectOffsets.BonusMagicResist,
    );
    unit.abilityPower = readFloat(
      buffer,
      offset.ObjectOffsets.AbilityPower,
    );
    unit.attackDamage = readFloat(
      buffer,
      offset.ObjectOffsets.AttackDamage,
    );
    unit.bonusAttackDamage = readFloat(
      buffer,
      offset.ObjectOffsets.BonusAttackDamage,
    );
    unit.moveSpeed = readFloat(
      buffer,
      offset.ObjectOffsets.MoveSpeed,
    );
    unit.attackRange = readFloat(
      buffer,
      offset.ObjectOffsets.AttackRange,
    );
    unit.attackSpeed = readFloat(
      buffer,
      offset.ObjectOffsets.AttackSpeed,
    );

    const nameLength = readInt(
      buffer,
      offset.ObjectOffsets.NameLength,
    );

    if (nameLength <= 0 || nameLength > 100) {
      unit.name = '';
    } else if (nameLength < 16) {
      unit.name = buffer.toString(
        'utf8',
        offset.ObjectOffsets.Name,
        offset.ObjectOffsets.Name + nameLength,
      );
    } else {
      const nameBuffer = metadata.process.readBuffer(
        readIntPtr(buffer, offset.ObjectOffsets.Name),
        nameLength,
      );

      unit.name = nameBuffer.toString(
        'utf8',
        0,
        nameLength,
      );
    }

    const displayNameLength = readInt(
      buffer,
      offset.ObjectOffsets.DisplayNameLength,
    );

    if (displayNameLength <= 0 || displayNameLength > 100) {
      unit.displayName = '';
    } else if (displayNameLength < 16) {
      unit.displayName = buffer.toString(
        'utf8',
        offset.ObjectOffsets.DisplayName,
        offset.ObjectOffsets.DisplayName +
          displayNameLength,
      );
    } else {
      const displayNameBuffer = metadata.process.readBuffer(
        readIntPtr(
          buffer,
          offset.ObjectOffsets.DisplayName,
        ),
        displayNameLength,
      );

      unit.displayName = displayNameBuffer.toString(
        'utf8',
        0,
        displayNameLength,
      );
    }

    const champion = metadata.championMetas.find(
      (champion) =>
        champion.id.toLowerCase() ===
        unit.name.toLowerCase(),
    );

    if (champion) {
      unit.isChampion = true;

      unit.currentGold = readFloat(
        buffer,
        offset.ObjectOffsets.CurrentGold,
      );
      unit.totalGold = readFloat(
        buffer,
        offset.ObjectOffsets.GoldTotal,
      );
      unit.exp = readFloat(
        buffer,
        offset.ObjectOffsets.EXP,
      );
      unit.level = readInt(
        buffer,
        offset.ObjectOffsets.Level,
      );
    }

    return unit;
  }
}
