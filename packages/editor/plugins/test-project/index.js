import Node from 'common/node';
import { ApplicationPlugin } from 'editor/plugin/types';

export default ApplicationPlugin.create({
  id: 'testProject',
  factory: {
    create({ app }) {
      var node = Node.create({ id: '1', notifier: app.notifier, componentType: 'p', label: 'Button', type: 'component', icon: 'puzzle' }, [
      ]);

      app.rootEntity = node;
    }
  }
});
