import Node from 'common/node';

export default {
  create({ app }) {

    var node = Node.create({ label: 'Button', type: 'component', icon: 'puzzle' }, [
      Node.create({ label: 'label', type: 'component', icon: 'text' }),
      Node.create({ label: 'mouse overdd', type: 'state', icon: 'delta' }),
      Node.create({ label: 'hoverfsdfs', type: 'state', icon: 'delta' }),
      Node.create({ label: 'hover', type: 'state', icon: 'delta' }),
      Node.create({ label: 'hover', type: 'state', icon: 'delta' })
    ]);

    app.currentSymbol = node;
  }
};
