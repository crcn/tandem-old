import Node from 'common/node';

export default {
  create({ app }) {

    var node = Node.create({ notifier: app.notifier, componentType: 'p', label: 'Button', type: 'component', icon: 'puzzle' }, [
      Node.create({ label: 'label', type: 'component', componentType: 'text', icon: 'text', value: 'text' })
    ]);

    app.currentSymbol = node;
  }
};
