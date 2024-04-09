export function readFloat(buffer: Buffer, offset: number) {
  return buffer.readFloatLE(offset); // Assuming little-endian byte order
}

export function readShort(buffer: Buffer, offset: number) {
  return buffer.readUInt16LE(offset); // Assuming little-endian byte order
}

export function readInt(buffer: Buffer, offset: number) {
  return buffer.readInt32LE(offset); // Assuming little-endian byte order
}

export function readUInt(buffer: Buffer, offset: number) {
  return buffer.readUInt32LE(offset); // Assuming little-endian byte order
}

export function readIntPtr(buffer: Buffer, offset: number) {
  return Number(buffer.readBigInt64LE(offset)); // Assuming little-endian byte order
}

export function readSingle(buffer: Buffer, offset: number) {
  return readFloat(buffer, offset); // Assuming little-endian byte order
}

export function readString(
  buffer: Buffer,
  offset: number,
  length: number,
) {
  return buffer.toString('utf8', offset, offset + length);
}
