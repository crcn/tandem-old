import CoreObject from 'saffron-common/lib/object';
import * as path from 'path';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';
// import SfnFile from 'browser/fragments/sfn-file-handler/model';

class SfnFile {
  constructor(any) { }
}

class ImportEntityController extends CoreObject {
  public bus:any;
  public file:any;
  public fragments:any;
  public attributes:any;
  public section:any;

  async load() {
    var files = await this.bus.load({
      type: 'getFiles',
      src: path.join(path.dirname(this.file.path), this.attributes.src),
      public: true,
    }).readAll();

    files = files.map((data) => (
      new SfnFile(Object.assign({}, data, {
        bus: this.bus,
        fragments: this.fragments,
      }))
    ));

    for (var file of files) {
      await file.load();

      // the entity is root, so it has a section
      this.section.appendChild(file.entity.section.toFragment());
    }
  }
}

export const fragment = new FactoryFragment({
  ns      : 'entity-controllers/import',
  factory : ImportEntityController,
});
