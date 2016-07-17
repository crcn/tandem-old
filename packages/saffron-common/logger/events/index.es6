import { Event } from '../events';
import assertPropertyExists from '../utils/assert/property-exists';

export const LOG = 'log';
export class LogEvent extends Event {
  constructor(level, message) {
    super(LOG);
    this.level   = level;
    this.message = message;

    assertPropertyExists(this, 'level');
    assertPropertyExists(this, 'message');
  }
}
