import { ApplicationFragment } from 'common/application/fragments';

import * as fragments from './fragments';

import { TypeCallbackBus } from 'common/mesh';
import { diff, patch } from 'common/utils/node/diff';

export default [
  ApplicationFragment.create(
    'html',
    create
  ),
  Object.values(fragments)
];

function create(app) {
}
