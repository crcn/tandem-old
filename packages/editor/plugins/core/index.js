import { ApplicationPlugin, ComponentPlugin } from 'editor/plugin/types';
import RootComponent from './components/root';

export default ApplicationPlugin.create({
  id: 'coreAppPlugin',
  factory: {
    create({ app }) {
      app.plugins.push(
        ComponentPlugin.create({
          id: 'rootComponent',
          componentClass: RootComponent
        })
      )
    }
  }
});
