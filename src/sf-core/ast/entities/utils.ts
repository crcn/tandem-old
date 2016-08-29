import { IEntity, IContainerNodeEntity } from "./base";

export function findEntitiesBySource(entity: IEntity, ...sources) {

  // crude, but works for now.
  return <Array<IEntity>>entity.flatten().filter((entity: IEntity) => sources.indexOf(entity.source) !== -1);
}

export async function appendSourceChildren(entity: IContainerNodeEntity, ...childSources: Array<any>) {
  return insertSourceChildren(entity, entity.source.children.length, ...childSources);
}

export async function insertSourceChildren(entity: IContainerNodeEntity, index: number = -1, ...childSources: Array<any>) {
  const oldSource = entity.source;
  entity.source.children.splice(index, 0, ...childSources);

  // update the file document
  await entity.document.update();
  console.log(entity.source === oldSource);

  // source is not the same, but the entity is. Slice the new child nodes and find all the entities. Note
  // that a source expression can be represented by many entities, which is why this funny chunk of code is necessary.
  return findEntitiesBySource(entity, ...entity.source.children.slice(index, index + childSources.length));
}
