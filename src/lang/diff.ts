import each from 'common/utils/object/each';

class Change {

  public type:String;
  public value:any;

  constructor(type, newValue) {
    this.type  = type;
    this.value = newValue;
  }
}

function addChanges(oldAst, newAst, changes) {
  for (var [type, name, attributes, children] of oldAst) {
    console.log(type, name);
  }
}

export default function diff(oldAst, newAst):Array<Change> {
  const changes = [];
  addChanges(oldAst, newAst, changes);
  return changes;
}
