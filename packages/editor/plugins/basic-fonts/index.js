import { ApplicationPlugin } from 'editor/plugin-types';
import Font from './font';

export default ApplicationPlugin.create({
  id: 'basicFontsPlugin',
  factory: {
    create({ app }) {
      app.plugins.push(...[
        'Lucida Grande',
        'Helvetica',
        'Arial',
        'Comic Sans MS'
      ].map(function(fontName) {
        return Font.create(fontName);
      }));
    }
  }
});
