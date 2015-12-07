import { Entry } from 'common/registry';

export default {
  create({ app }) {
    return [
      Entry.create({
        id: 'rectableSymbol',
        type: 'symbol',
        symbolType: 'component',
        componentType: 'core',
        label: 'rectable',
        factory: {
          create() { }
        }
      }),
      Entry.create({
        id: 'circleSymbol',
        type: 'symbol',
        symbolType: 'component',
        componentType: 'core',
        label: 'circle',
        factory: {
          create() { }
        }
      })
    ];
  }
}
