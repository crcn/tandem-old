import { FactoryFragment } from 'common/fragments';
import { TypeCallbackBus } from 'common/mesh';
import { LOG } from 'common/logger/events';
import {
  VERBOSE as VERBOSE_LEVEL,
  INFO as INFO_LEVEL,
  WARN as WARN_LEVEL,
  ERROR as ERROR_LEVEL,
} from 'common/logger/levels';
import chalk from 'chalk';

export const fragment = FactoryFragment.create('logger/console', { create });

function create(app) {

  app.busses.push(TypeCallbackBus.create(LOG, log));

  function log(event) {
    var logFn = {
      [VERBOSE_LEVEL]: console.log.bind(console),
      [INFO_LEVEL]: console.info.bind(console),
      [WARN_LEVEL]: console.warn.bind(console),
      [ERROR_LEVEL]: console.error.bind(console),
    }[event.level];

    logFn('%s %s', chalk[{
      [VERBOSE_LEVEL]: 'grey',
      [INFO_LEVEL]: 'cyan',
      [WARN_LEVEL]: 'yellow',
      [ERROR_LEVEL]: 'red',
    }[event.level]].bold(':'), event.message);
  }
}
