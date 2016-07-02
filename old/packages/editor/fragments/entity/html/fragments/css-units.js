import * as units from '../constants/units';
import { UnitFragment } from 'editor/fragment/types';

export function create() {
  return Object.keys(units).map(key => UnitFragment.create(units[key]));
}