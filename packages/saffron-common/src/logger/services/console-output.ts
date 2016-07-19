import { Service } from '../../services/index';
import { FactoryFragment } from '../../fragments/index';
import document from '../../actors/decorators/document';
import * as sift from 'sift';

import {
  VERBOSE as VERBOSE_LEVEL,
  INFO as INFO_LEVEL,
  WARN as WARN_LEVEL,
  ERROR as ERROR_LEVEL,
} from '../../logger/levels';
import * as chalk from 'chalk';

class ConsoleService extends Service {

  private _filter:Function;

  @document('sets a log filter for stdout.')
  setLogFilter(action) {
    this._filter = sift(action.text);
  }

  @document('logs to stdout')
  log({ message, level, filterable }) {

    if (filterable !== false && this._filter && !this._filter(message)) return;

    var log = {
      [VERBOSE_LEVEL]: console.log.bind(console),
      [INFO_LEVEL]: console.info.bind(console),
      [WARN_LEVEL]: console.warn.bind(console),
      [ERROR_LEVEL]: console.error.bind(console)
    }[level];

    var color = {
      [VERBOSE_LEVEL]: 'grey',
      [INFO_LEVEL]: 'blue',
      [WARN_LEVEL]: 'yellow',
      [ERROR_LEVEL]: 'red',
    }[level];

    if (typeof window !== 'undefined') {
      log('%c: %c%s', `color: ${color}`, 'color: black', message);
    } else {
      log('%s %s', chalk[color].bold(':'), message);
    }
  }
}

export const fragment = new FactoryFragment({
  ns: 'application/services/console',
  factory: ConsoleService,
});
