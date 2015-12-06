import { Entry } from 'registry';

export default {
  create({ app }) {
    return [
      Entry.create({
        id: 'rectableSymbol',
        type: 'symbol',
        symbolType: 'component',
        label: 'rectable',
        factory: {
          create() { }
        }
      }),
      Entry.create({
        id: 'circleSymbol',
        type: 'symbol',
        symbolType: 'component',
        label: 'circle',
        factory: {
          create() { }
        }
      })
    ];
  }
}
