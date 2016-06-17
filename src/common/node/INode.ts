import Attributes from './Attributes';

interface INode {
  parent: INode;
  attributes: Attributes;
}

export default INode;

