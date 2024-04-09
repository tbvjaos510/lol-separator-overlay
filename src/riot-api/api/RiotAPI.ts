import { ChampionMetadata } from 'src/riot-api/objects/metadata';

export class RiotAPI {
  public static async getChampions(
    version: string,
    region: string,
  ): Promise<ChampionMetadata[]> {
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/${region}/champion.json`,
    );
    const data = await response.json();
    const champions: ChampionMetadata[] = [];
    for (const key in data.data) {
      const champion = data.data[key];
      champions.push({
        id: champion.id,
        key: champion.key,
        name: champion.name,
        squareImageUrl: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion.image.full}`,
      });
    }
    return champions;
  }
}
