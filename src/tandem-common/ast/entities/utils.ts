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
    entity.source.insertChildAt(child, index);
  }

  const root = entity.root;

  // update the file document
  // await entity.document.update();

  const entities = findEntitiesBySource(root, ...childSources);
  return entities;
}

export async function removeEntitySources(...entities: Array<IEntity>) {
  entities.forEach((entity) => {

    // may have already been removed. This will happen in cases
    // where multiple entities that share the same source are removed.
    if (entity.source.parent) {
      entity.source.parent.removeChild(entity.source);
    }
  });
}

export function calculateIndentation(content: string, defaultIndentation: string = "  "): string {
  const lines = content.split(/\n+/g);

  // go with the first line with whitespace before it -- use
  // that as indentation.
  for (let i = 0, n = lines.length; i < n; i++) {
    const cline  = lines[i];
    const clinews = cline.match(/[\t\s]*/)[0];
    if (clinews.length) return clinews;
  }

  return defaultIndentation;
}

export function getContext(entity: IEntity) {
  let p = entity.parent;
  while (p && !p.context) p = p.parent;
  return p ? p.context || {} : {};
}