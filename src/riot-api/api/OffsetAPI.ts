import fs from 'fs';
import { Offset } from 'src/riot-api/objects/offset';

export class OffsetAPI {
  private static readonly OFFSET_FILE_DIRECTORY = 'offset/';

  public static fetch(version: string): Offset {
    if (
      !fs.existsSync(
        `${OffsetAPI.OFFSET_FILE_DIRECTORY}${version}.json`,
      )
    ) {
      throw new Error(
        `Offset file for version ${version} does not exist`,
      );
    }

    const offset = fs.readFileSync(
      `${OffsetAPI.OFFSET_FILE_DIRECTORY}${version}.json`,
      'utf8',
    );

    const offsetJson = JSON.parse(offset);

    return {
      OffsetVersion: offsetJson.OffsetVersion,
      ObjectOffsets: Object.fromEntries(
        Object.entries(offsetJson.ObjectOffsets).map(
          ([key, value]) => [key, parseInt(value as any)],
        ),
      ) as any,
      GameOffsets: Object.fromEntries(
        Object.entries(offsetJson.GameOffsets).map(
          ([key, value]) => [key, parseInt(value as any)],
        ),
      ) as any,
      FileVersion: offsetJson.FileVersion,
    };
  }
}
