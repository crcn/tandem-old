import { FactoryFragment } from 'common/fragments';
import { ViewController, dom } from 'paperclip';

class Hello extends ViewController {

  static template = <div>
    { c => c.childNodes }
  </div>
}

export default class RootEditorComponent extends ViewController {
  name = 'jeff';

  static template = <div>
    <style>{`
      .editor {
        color: red;
      }
    `}</style>
  </div>;
}

export const fragment = FactoryFragment.create('rootViewClass', RootEditorComponent);
