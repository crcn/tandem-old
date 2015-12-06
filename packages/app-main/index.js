import 'bootstrap/css/bootstrap.css';

import BaseApplication from 'app-base';
import EditorPlugin from 'app-plugin-editor';
import RenderRootComponentPlugin from 'app-plugin-render-component-root';
import BasicSymbolsPlugin from 'app-plugin-basic-symbols';

class Application extends BaseApplication {
  static plugins = [
    EditorPlugin,
    RenderRootComponentPlugin,
    BasicSymbolsPlugin
  ]
}

export default Application;
