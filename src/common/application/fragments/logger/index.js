import create from 'common/class/utils/create';
import { ApplicationFragment } from '../index';

export default ApplicationFragment.create(
  'logger',
  initialize
);

function initialize(app) {

  // tempory - just pipe to console output
  app.logger = console;
}
