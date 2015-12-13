import { Plugin } from 'editor/plugin/types';

class FontPlugin extends Plugin {
  constructor(value, weights, styles, decorations) {
    super({
      id          : value,
      type        : 'font',
      label       : value,
      value       : value,
      weights     : weights     || [],
      styles      : styles      || [],
      decorations : decorations || []
    });
  }
}

export default FontPlugin;
