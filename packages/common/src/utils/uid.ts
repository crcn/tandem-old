import * as crc32 from "crc32";

export type UIDGenerator = () => string;
// export type ChecksumGenerator<TObject> = (value: TObject) => string;

export const createUIDGenerator = <TObject>(seed: string, index: number = 0) => {
  return () => seed + index++;
};

const seed = crc32(String(`${Date.now()}.${Math.random()}`));
let _i = 0;

export const generateUID = () => seed + (_i++);