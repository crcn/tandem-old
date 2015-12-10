import Node from 'common/node';

export default {
  create({ app }) {

    var node = Node.create({ notifier: app.notifier, componentType: 'p', label: 'Button', type: 'component', icon: 'puzzle' }, [
      Node.create({ label: 'label', type: 'component', componentType: 'text', icon: 'text', value: 'text', style: { left: '100px', top: '100px' } })
    ]);

    app.currentSymbol = node;
  }
};
