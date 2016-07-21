import FragmentSection from './fragment';
import NodeSection from './node';

export function create(node):any {

  if (node.nodeType === 11) {
    var frag = new FragmentSection();
    frag.appendChild(node);
    return frag;
  }

  return new NodeSection(node);
}
