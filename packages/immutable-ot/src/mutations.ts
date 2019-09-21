/**
 */

export type Key = string | number;

export enum MutationType {
  INSERT,
  REMOVE,
  REPLACE,
  MOVE,
  SET,
  UNSET
}

type BaseOTMutation<TType extends MutationType> = {
  type: TType;
  path: Key[];
};

export type Insert = {
  index: number;
  value: any;
} & BaseOTMutation<MutationType.INSERT>;

export type Remove = {
  index: number;
} & BaseOTMutation<MutationType.REMOVE>;

export type Replace = {
  value: any;
} & BaseOTMutation<MutationType.REPLACE>;

export type Move = {
  oldIndex: number;
  newIndex: number;
} & BaseOTMutation<MutationType.MOVE>;

export type Set = {
  propertyName: string;
  value: any;
} & BaseOTMutation<MutationType.SET>;

export type Unset = {
  propertyName: string;
} & BaseOTMutation<MutationType.UNSET>;

export type Mutation = Insert | Remove | Replace | Move | Set | Unset;

export const remove = (index: number, path: Key[]): Remove => ({
  type: MutationType.REMOVE,
  index,
  path
});
export const insert = (index: number, value: any, path: Key[]): Insert => ({
  type: MutationType.INSERT,
  index,
  value,
  path
});
export const set = (propertyName: string, value: any, path: Key[]): Set => ({
  type: MutationType.SET,
  propertyName,
  value,
  path
});
export const unset = (propertyName: string, path: Key[]): Unset => ({
  type: MutationType.UNSET,
  propertyName,
  path
});
export const move = (
  oldIndex: number,
  newIndex: number,
  path: Key[]
): Move => ({ type: MutationType.MOVE, newIndex, oldIndex, path });
export const replace = (value: any, path: Key[]): Replace => ({
  type: MutationType.REPLACE,
  value,
  path
});
