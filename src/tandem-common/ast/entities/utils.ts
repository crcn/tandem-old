import { IEntity } from "./base";

export function findEntitiesBySource(entity: IEntity, ...sources) {

  // crude, but works for now.
  return <Array<IEntity>>entity.flatten().filter((entity: IEntity) => sources.indexOf(entity.source) !== -1);
}

export async function appendSourceChildren(entity: IEntity, ...childSources: Array<any>) {
  return insertSourceChildren(entity, entity.source.children.length, ...childSources);
}

export async function insertSourceChildren(entity: IEntity, index: number = -1, ...childSources: Array<any>) {

  for (const child of childSources.reverse()) {
    entity.source.insertAt(child, index);
  }

  const root = entity.root;

  // update the file document
  // await entity.document.update();

  const entities = findEntitiesBySource(root, ...childSources);
  return entities;
}

export async function removeEntitySources(...entities: Array<IEntity>) {
  const document = entities[0].document;

  entities.forEach((entity) => {

    // may have already been removed. This will happen in cases
    // where multiple entities that share the same source are removed.
    if (entity.source.parent) {
      entity.source.parent.removeChild(entity.source);
    }
  });

  // await document.update();
}

export function getContext(entity: IEntity) {
  let p = entity.parent;
  while (p && !p.context) p = p.parent;
  return p ? p.context || {} : {};
}

