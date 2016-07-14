import './scss/modules/all.scss';
import './scss/fonts.scss';

import * as fragments from './fragments';
import { fragment as textToolFragment } from './tools/text';


export default [
  Object.values(fragments),
  textToolFragment
];
