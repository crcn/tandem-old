import { diffNode, VMObjectSource, SET_TEXT_NODE_VALUE, SlimVMObjectType, SET_ATTRIBUTE } from "../";
import { SetValueMutation } from "source-mutation";
import { expect } from "chai";

describe(__filename + "#", () => {
  [
    [{ type: SlimVMObjectType.TEXT, value: "a" }, { type: SlimVMObjectType.TEXT, value: "b" }, [
      {
        target: undefined,
        type: SET_TEXT_NODE_VALUE,
        newValue: "b"
      } as SetValueMutation<VMObjectSource>
    ]],

    // element diff & patching
    [{ 
      type: SlimVMObjectType.ELEMENT, 
      tagName: "a",
      attributes: [{ name: "c", value: "1" }]
    }, 
    { 
      type: SlimVMObjectType.ELEMENT, 
      tagName: "b",
      attributes: [{ name: "c", value: "2" }]
    }, [
      {
        target: undefined,
        index: undefined,
        type: SET_ATTRIBUTE,
        name: "c",
        oldName: undefined,
        oldValue: undefined,
        newValue: "2"
      } as SetValueMutation<VMObjectSource>
    ]],
    [{ 
      type: SlimVMObjectType.ELEMENT, 
      tagName: "a",
      attributes: [{ name: "c", value: "1" }]
    }, 
    { 
      type: SlimVMObjectType.ELEMENT, 
      tagName: "b",
      attributes: [{ name: "c", value: "2" }]
    }, [
      {
        target: undefined,
        index: undefined,
        type: SET_ATTRIBUTE,
        name: "c",
        oldName: undefined,
        oldValue: undefined,
        newValue: "2"
      } as SetValueMutation<VMObjectSource>
    ]]
  ].forEach(([oldSource, newSource, diffs]: any) => {
    it(`can diff ${JSON.stringify(oldSource)} against ${JSON.stringify(newSource)}`, () => {
      expect(diffNode(oldSource, newSource)).to.eql(diffs);
    });
  });
});