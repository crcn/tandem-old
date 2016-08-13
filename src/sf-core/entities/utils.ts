import { IEntity } from "./base";

export function findEntitiesBySource(entity: IEntity, source: any) {

  // crude, but works for now.
  return <Array<IEntity>>entity.flatten().filter((entity: IEntity) => entity.source === source);
}