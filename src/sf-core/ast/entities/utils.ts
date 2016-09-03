import { IEntity, IContextualEntity } from "./base";

export function findEntitiesBySource(entity: IEntity, ...sources) {

  // crude, but works for now.
  return <Array<IEntity>>entity.flatten().filter((entity: IEntity) => sources.indexOf(entity.source) !== -1);
}

export async function appendSourceChildren(entity: IEntity, ...childSources: Array<any>) {
  return insertSourceChildren(entity, entity.source.children.length, ...childSources);
}

export async function replaceEntitySource(entity: IEntity, ...sources) {
  const parent = <IEntity>entity.parent;
  const index: number = parent.source.children.indexOf(entity.source);
  parent.source.removeChild(entity.source);
  return insertSourceChildren(parent, index, ...sources);
}

export async function insertSourceChildren(entity: IEntity, index: number = -1, ...childSources: Array<any>) {

  for (const child of childSources.reverse()) {
    entity.source.insertAt(child, index);
  }

  // update the file document
  await entity.document.update();

  return findEntitiesBySource(entity, ...childSources);
}

export async function removeEntitySources(...entities: Array<IEntity>) {
  const document = entities[0].document;

  entities.forEach((entity) => {
    entity.source.parent.removeChild(entity.source);
  });

  await document.update();
}

export function getContext(entity: IEntity) {
  let p = <IContextualEntity>entity.parent;
  while (p && !p.context) p = <IContextualEntity>p.parent;
  return p ? p.context || {} : {};
}

