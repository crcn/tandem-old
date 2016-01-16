import EditorApplication from 'editor/app';

class BrowserApplication extends EditorApplication {
  static fragments = EditorApplication.fragments.concat([
    // more here!
  ]);
}

export default BrowserApplication;
