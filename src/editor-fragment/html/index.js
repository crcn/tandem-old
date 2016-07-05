import { ApplicationFragment } from 'common/application/fragments';
import { fragment as previewComponentFragment } from './components/preview';
import DOMElementEntity from './entities/dom-element';

export default ApplicationFragment.create(
  'html',
  create
);

function create(app) {
  app.fragmentDictionary.register(
    previewComponentFragment
  );

  app.rootEntity = DOMElementEntity.create('div', {
    style: {
      backgroundColor: 'red',
      width: '100px',
      height: '100px'
    }
  });

}
