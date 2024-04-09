export interface Offset {
  OffsetVersion: string;
  GameOffsets: {
    Manager: number;
    GameTime: number;
    MapCount: number;
    MapRoot: number;
    MapNodeNetId: number;
    MapNodeObject: number;
  };
  ObjectOffsets: {
    ID: number;
    NetworkID: number;
    Team: number;
    DisplayName: number;
    DisplayNameLength: number;
    Visibility: number;
    ReCallState: number;
    Lethality: number;
    IsMoving: number;
    Armor: number;
    BonusArmor: number;
    MagicResist: number;
    BonusMagicResist: number;
    AbilityPower: number;
    AttackDamage: number;
    BonusAttackDamage: number;
    MoveSpeed: number;
    AttackRange: number;
    AttackSpeed: number;
    Pos: number;
    Mana: number;
    MaxMana: number;
    Health: number;
    MaxHealth: number;
    CurrentGold: number;
    GoldTotal: number;
    EXP: number;
    Level: number;
    Name: number;
    NameLength: number;
  };
  FileVersion: string;
}
