import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'base-application';
import EditorPlugin from 'plugins-editor';
import RenderRootComponentPlugin from 'plugins-render-root-component';

class Application extends BaseApplication {
  static plugins = [
    EditorPlugin,
    RenderRootComponentPlugin
  ]
}

export default Application;
