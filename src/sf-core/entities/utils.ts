import { IEntity } from "./base";

export function findEntityBySource(entity: IEntity, source: any) {

  // crude, but works for now.
  return entity.flatten().find((entity: IEntity) => entity.source === source);
}