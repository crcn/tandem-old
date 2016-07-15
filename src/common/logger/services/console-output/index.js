import { BaseService } from 'common/services';
import { FactoryFragment } from 'common/fragments';

import {
  VERBOSE as VERBOSE_LEVEL,
  INFO as INFO_LEVEL,
  WARN as WARN_LEVEL,
  ERROR as ERROR_LEVEL,
} from 'common/logger/levels';
import chalk from 'chalk';

class ConsoleService extends BaseService {
  log(event) {

    var log = {
      [VERBOSE_LEVEL]: console.log.bind(console),
      [INFO_LEVEL]: console.info.bind(console),
      [WARN_LEVEL]: console.warn.bind(console),
      [ERROR_LEVEL]: console.error.bind(console),
    }[event.level];

    var color = {
      [VERBOSE_LEVEL]: 'grey',
      [INFO_LEVEL]: 'blue',
      [WARN_LEVEL]: 'orange',
      [ERROR_LEVEL]: 'red',
    }[event.level];

    if (typeof window !== 'undefined') {
      log('%c: %c%s', `color: ${color}`, 'color: black', event.message);
    } else {
      log('%s %s', chalk[color].bold(':'), event.message);
    }
  }
}

export const fragment = FactoryFragment.create({
  ns: 'application/actors/console',
  factory: ConsoleService
});
