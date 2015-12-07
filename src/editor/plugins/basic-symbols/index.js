import TextSymbolEntries from './text-symbol-entries';
import ShapeSymbolEntries from './shape-symbol-entries';

export default {
  create({ app }) {
    app.registry.push(
      ...TextSymbolEntries.create({ app }),
      ...ShapeSymbolEntries.create({ app })
    );
  }
}
