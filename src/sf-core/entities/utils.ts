import { IEntity, IContainerEntity } from "./base";

export function findEntitiesBySource(entity: IEntity, ...sources) {

  // crude, but works for now.
  return <Array<IEntity>>entity.flatten().filter((entity: IEntity) => sources.indexOf(entity.source) !== -1);
}

export async function appendSourceChildren(entity: IContainerEntity, ...childSources: Array<any>) {
  return insertSourceChildren(entity, entity.source.childNodes.length, ...childSources);
}

export async function insertSourceChildren(entity: IContainerEntity, index: number = -1, ...childSources: Array<any>) {
  entity.source.childNodes.splice(index, 0, ...childSources);
  const doc = entity.document;
  await doc.update();
  return findEntitiesBySource(entity, ...childSources);
}
