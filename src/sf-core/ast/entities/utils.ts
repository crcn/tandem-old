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
  parent.source.children.splice(index, 1);
  return insertSourceChildren(parent, index, ...sources);
}

export async function insertSourceChildren(entity: IEntity, index: number = -1, ...childSources: Array<any>) {
  const oldSource = entity.source;
  entity.source.children.splice(index, 0, ...childSources);

  // update the file document
  await entity.document.update();

  // source is not the same, but the entity is. Slice the new child nodes and find all the entities. Note
  // that a source expression can be represented by many entities, which is why this funny chunk of code is necessary.
  return findEntitiesBySource(entity, ...entity.source.children.slice(index, index + childSources.length));
}

export async function removeEntitySources(...entities: Array<IEntity>) {
  const document = entities[0].document;

  entities.forEach((entity) => {
    if (entity.source.parent) {
      entity.source.parent.children.remove(entity.source);
    }
  });
  await document.update();
}

export function getContext(entity: IEntity) {
  let p = <IContextualEntity>entity.parent;
  while (p && !p.context) p = <IContextualEntity>p.parent;
  return p ? p.context || {} : {};
}

