import LayersPaneComponent from './components/layer-pane';

import {
  ApplicationFragment,
  ComponentFragment,
  AppPaneComponentFragment
} from 'editor/fragment/types';

export default ApplicationFragment.create({
  id: 'coreAppFragment',
  factory: {
    create({ app }) {

      app.fragments.push(

        // basic panes
        AppPaneComponentFragment.create({
          id             : 'layersPane',
          label          : 'Layers',
          componentClass : LayersPaneComponent
        })
      )
    }
  }
});
