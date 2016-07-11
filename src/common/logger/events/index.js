import { Event } from 'common/events';
import assertPropertyExists from 'common/utils/assert/property-exists';

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
