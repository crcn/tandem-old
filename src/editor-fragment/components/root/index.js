import { FactoryFragment } from 'common/fragments';
import create from 'common/class/utils/create';

export default class RootEditorComponent {
  render() {
    return document.createTextNode('hello');
  }

  static create = create;
}

export const fragment = FactoryFragment.create('rootComponentClass', RootEditorComponent);
