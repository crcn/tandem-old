import { ApplicationFragment } from 'common/application/fragments';

export default ApplicationFragment.create(
  'render-root-component',
  initialize
);

function initialize(app) {
  console.log('initialize');
}
