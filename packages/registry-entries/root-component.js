import ComponentEntry from './component';

export const ROOT_COMPONENT_ID = 'rootComponent';

class RootComponentEntry extends ComponentEntry {
  constructor(properties) {
    super({ id: ROOT_COMPONENT_ID, ...properties });
  }
}

export default RootComponentEntry;
