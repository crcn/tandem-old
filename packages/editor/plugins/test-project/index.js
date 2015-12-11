import Node from 'common/node';

export default {
  type: 'application',
  create({ app }) {

    var node = Node.create({ id: '1', notifier: app.notifier, componentType: 'p', label: 'Button', type: 'component', icon: 'puzzle' }, [
    ]);

    app.currentSymbol = node;
  }
};
