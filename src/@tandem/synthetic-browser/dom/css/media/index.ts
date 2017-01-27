export * from "./ast";
import { parse } from "./parser.peg";

export const parseCSSMedia = (source: string) => parse(source);