import create from 'common/class/utils/create';
import { ApplicationFragment } from '../index';

export default ApplicationFragment.create(
  'logger',
  initialize
);

function initialize(app) {
  app.logger = Logger.create(app);
}

class Logger {
  constructor(bus) {

  }

  static create = create;
}
