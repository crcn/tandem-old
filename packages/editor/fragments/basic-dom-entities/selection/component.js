import BaseSelection from 'common/selection/base';

/**
 * Component-specific selection tool
 */

class ComponentSelection extends BaseSelection {

  get type() {
    return 'component';
  }

  get root() {
    return this[0].root;
  }

  get attributes() {
    return this[0].attributes;
  }

  getComputer() {
    return this[0].getComputer();
  }

  get componentType() {
    // TODO - do nothing for now
  }

  getComputedStyle() {
    return this[0].getComputedStyle();
    // comp this shit
  }

  getStyle() {
    return this[0].getStyle();
  }

  setStyle(style) {
    console.log('sstyle');
    return this[0].setStyle(style);
  }
}

export default ComponentSelection;