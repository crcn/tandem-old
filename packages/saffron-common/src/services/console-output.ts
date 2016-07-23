import { Service } from 'saffron-base/src/services';
import { ClassFactoryFragment } from 'saffron-core/src/fragments';
import { LogAction } from 'saffron-core/src/actions';
import document from 'saffron-core/src/decorators/document';
import * as sift from 'sift';

import {
  VERBOSE as VERBOSE_LEVEL,
  INFO as INFO_LEVEL,
  WARN as WARN_LEVEL,
  ERROR as ERROR_LEVEL,
} from 'saffron-core/src/logger/levels';
import * as chalk from 'chalk';

class ConsoleService extends Service {

  private _filter:Function;

  @document('sets a log filter for stdout.')
  setLogFilter(action) {
    this._filter = sift(action.text);
  }

  @document('logs to stdout')
  log({ level, text }:LogAction) {

    if (this._filter && !this._filter(text)) return;

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
      log('%c: %c%s', `color: ${color}`, 'color: black', text);
    } else {
      log('%s %s', chalk[color].bold(':'), text);
    }
  }
}

export const fragment = new ClassFactoryFragment('application/services/console', ConsoleService);
