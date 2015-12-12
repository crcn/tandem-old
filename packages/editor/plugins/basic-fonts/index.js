import { ApplicationPlugin } from 'editor/plugin-types';
import Font from './font';

export default ApplicationPlugin.create({
  id: 'basicFontsPlugin',
  factory: {
    create({ app }) {
      app.fonts = [
        Font.create('Lucida Grande'),
        Font.create('Helvetica'),
        Font.create('Arial'),
        Font.create('Comic Sans MS'),
        Font.create('Al Bayan'),
        Font.create('Al Nye'),
        Font.create('Avenir'),
        Font.create('Avenir Next')
      ];
    }
  }
});
