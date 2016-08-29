import { IEntity, IContainerNodeEntity } from "./base";

export function findEntitiesBySource(entity: IEntity, ...sources) {

  // crude, but works for now.
  return <Array<IEntity>>entity.flatten().filter((entity: IEntity) => sources.indexOf(entity.source) !== -1);
}

export async function appendSourceChildren(entity: IContainerNodeEntity, ...childSources: Array<any>) {
  return insertSourceChildren(entity, entity.source.children.length, ...childSources);
}

export async function insertSourceChildren(entity: IContainerNodeEntity, index: number = -1, ...childSources: Array<any>) {
  entity.source.children.splice(index, 0, ...childSources);
  await entity.document.update();
  return findEntitiesBySource(entity, ...childSources);
}
