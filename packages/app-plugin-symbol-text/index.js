import { Entry } from 'registry';

export function create({ app }) {

  app.registry.push(Entry.create({
    id: 'symbol-text',
    type: 'symbol',
    factory: {
      create() { }
    }
  }));

  app.registry.push(Entry.create({
    id: 'symbol-text-property-tools',
    type: 'symbol-tool'
  }));

}
