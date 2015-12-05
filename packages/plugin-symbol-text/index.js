import { Entry } from 'registry';

export function create({ application }) {

  application.registry.push(Entry.create({
    id: 'symbol-text',
    type: 'symbol',
    factory: {
      create() { }
    }
  }));

  application.registry.push(Entry.create({
    id: 'symbol-text-property-tools',
    type: 'symbol-tool'
  }));

}
