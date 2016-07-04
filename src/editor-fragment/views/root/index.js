import { FactoryFragment } from 'common/fragments';
import { ViewController, dom } from 'paperclip';

class Hello extends ViewController {
  static template = <div>
    Hello {c=>c.attributes.name}
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

    <Hello name="jeff" />
  </div>;
}

export const fragment = FactoryFragment.create('rootViewClass', RootEditorComponent);
