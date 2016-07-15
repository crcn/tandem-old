import { FactoryFragment } from 'common/fragments';
import BaseModel from 'common/models/base';

export default class SfnFile extends BaseModel {

}

export const fragment = FactoryFragment.create({
  ns: 'models/sfn-file',
  factory: SfnFile,
});
