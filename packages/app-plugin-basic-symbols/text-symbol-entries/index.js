import { Entry } from 'registry';

export default {
  create({ app }) {
    return [
      Entry.create({
        id: 'textSymbol',
        type: 'symbol',
        symbolType: 'component',
        label: 'text',
        factory: {
          create() { }
        }
      })

      // Entry.create({
      //   id: 'symbol-text-property-tools',
      //   type: 'symbol-tool'
      // })
    ];
  }
}
