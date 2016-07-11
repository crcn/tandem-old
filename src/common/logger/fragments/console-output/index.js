import { FactoryFragment } from 'common/fragments';
import { TypeCallbackBus } from 'common/busses';
import { LOG } from 'common/logger/events';
import {
  VERBOSE as VERBOSE_LEVEL,
  INFO as INFO_LEVEL,
  WARN as WARN_LEVEL,
  ERROR as ERROR_LEVEL
} from 'common/logger/levels';
import chalk from 'chalk';

export const fragment = FactoryFragment.create('logger/console', { create });

function create(logger) {

  logger.bus.push(TypeCallbackBus.create(LOG, log));

  function log(event) {
    console.log('%s %s', chalk[{
      [VERBOSE_LEVEL]: 'grey',
      [INFO_LEVEL]: 'cyan',
      [WARN_LEVEL]: 'yellow',
      [ERROR_LEVEL]: 'red',
    }[event.level]].bold(':'), event.message);
  }
}
