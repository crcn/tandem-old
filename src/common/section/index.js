import FragmentSection from './fragment';
import NodeSection from './node';

export function create(node) {

  if (node.nodeType === 11) {
    var frag = FragmentSection.create();
    frag.appendChild(node);
    return frag;
  }

  return NodeSection.create(node);
}
