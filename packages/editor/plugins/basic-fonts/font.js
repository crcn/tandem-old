import { Plugin } from 'editor/plugin-types';

class FontPlugin extends Plugin {
  constructor(name) {
    super({
      id    : name,
      type  : 'font',
      name  : name,
      value : name
    });
  }
}

export default FontPlugin;
