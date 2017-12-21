import { Bounds, Point } from "../geom";
import { BaseEvent } from "../bus";

export const RESIZED = "RESIZED";
export const MOVED   = "MOVED";
export const STOPPED_MOVING   = "STOPPED_MOVING";
export const REMOVED = "REMOVED";

export type TargetSelector = {
  uri: string;
  value: string;
}

export type Resized = {
  itemId: string;
  itemType: string;
  bounds: Bounds;
  targetSelectors?: TargetSelector[];
} & BaseEvent;

export type Moved = {
  itemId: string;
  itemType: string;
  point: Point;
  targetSelectors?: TargetSelector[];
} & BaseEvent;

export type Removed = {
  itemId: string;
  itemType: string;
} & BaseEvent;

export const resized = (itemId: string, itemType: string, bounds: Bounds, targetSelectors?: TargetSelector[]): Resized => ({
  itemId,
  itemType,
  bounds,
  targetSelectors,
  type: RESIZED
});

export const moved = (itemId: string, itemType: string, point: Point, targetSelectors?: TargetSelector[]): Moved => ({
  itemId,
  itemType,
  point,
  targetSelectors,
  type: MOVED
});

export const stoppedMoving = (itemId: string, itemType: string, targetSelectors?: TargetSelector[]): Moved => ({
  itemId,
  itemType,
  point: null,
  targetSelectors,
  type: STOPPED_MOVING
});

export const removed = (itemId: string, itemType: any): Removed => ({
  itemId,
  itemType,
  type: REMOVED
});