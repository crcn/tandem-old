import CoreObject from 'common/object';
import path from 'path';
import { FactoryFragment } from 'common/fragments';
import SfnFile from 'browser/fragments/sfn-file-handler/model';

class ImportEntityController extends CoreObject {
  async execute() {
    var files = await this.bus.execute({
      type: 'getFiles',
      src: path.join(path.dirname(this.file.path), this.attributes.src),
      public: true,
    }).readAll();

    files = files.map((data) => (
      SfnFile.create({
        ...data,
        bus: this.bus,
        fragmentDictionary: this.fragmentDictionary,
      })
    ));

    for (var file of files) {
      await file.load();

      // the entity is root, so it has a section
      this.section.appendChild(file.entity.section.toFragment());
    }
  }
}

export const fragment = FactoryFragment.create({
  ns      : 'entity-controllers/import',
  factory : ImportEntityController,
});
