import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'app-base';
import EditorPlugin from 'app-plugin-editor';
import RenderRootComponentPlugin from 'app-plugin-render-root-component';

class Application extends BaseApplication {
  static plugins = [
    EditorPlugin,
    RenderRootComponentPlugin
  ]
}

export default Application;
