import { Plugin } from 'editor/plugin/types';

class FontPlugin extends Plugin {
  constructor(value, weights, styles) {
    super({
      id      : value,
      type    : 'font',
      label   : value,
      value   : value,
      weights : weights || [],
      styles  : styles  || []
    });
  }
}

export default FontPlugin;
