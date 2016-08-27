import { IEntity, IContainerEntity } from "./base";

export function findEntitiesBySource(entity: IEntity, source: any) {

  // crude, but works for now.
  return <Array<IEntity>>entity.flatten().filter((entity: IEntity) => entity.source === source);
}

export async function appendSourceChild(entity: IContainerEntity, childSource: any) {
  entity.source.appendChild(childSource);
  await entity.document.sync();
  return entity.find((child) => child.source === childSource);
}