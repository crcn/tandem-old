import TextSymbolEntries from './text-symbol-entries';

export default {
  create({ app }) {
    app.registry.push(...TextSymbolEntries.create({ app }))
  }
}
