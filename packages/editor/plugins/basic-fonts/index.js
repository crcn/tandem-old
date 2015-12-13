import FontPlugin from './font';
import { ApplicationPlugin } from 'editor/plugin/types';

const DEFAULT_WEIGHTS = [
  'normal', 'bold', 'bolder', 'lighter', 'initial', 'inherit', 100, 200, 300, 400, 500, 600, 700, 800, 900
];

const DEFAULT_STYLES = [
  'italic', 'normal'
];

export default ApplicationPlugin.create({
  id: 'basicFontsPlugin',
  factory: {
    create({ app }) {
      registerFonts(app);
    }
  }
});

function registerFonts(app) {
  app.plugins.push(...[
    'Lucida Grande',
    'Helvetica',
    'Arial',
    'Comic Sans MS'
  ].map(function(fontName) {
    return FontPlugin.create(
      fontName,
      DEFAULT_WEIGHTS,
      DEFAULT_STYLES
    );
  }));
}
