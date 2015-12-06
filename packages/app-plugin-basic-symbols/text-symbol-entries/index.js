import { Entry } from 'registry';

export default {
  create({ app }) {
    return [
      Entry.create({
        id: 'symbol-text',
        type: 'symbol',
        symbolType: 'component',
        factory: {
          create() { }
        }
      }),

      Entry.create({
        id: 'symbol-text',
        type: 'symbol',
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
