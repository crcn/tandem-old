import { HTMLExpression } from '../expressions/index';
import { HTMLNodeEntity } from '../entities/index';

declare function parse(source:string):HTMLExpression<HTMLNodeEntity<any>>;