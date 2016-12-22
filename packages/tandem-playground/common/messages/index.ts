// import { Project } from "../stores";
import { EditorFamilyType } from "@tandem/editor/common";
import { ApplyFileEditRequest } from "@tandem/sandbox";
import { IMessage, IStreamableDispatcher, readOneChunk, setMessageTarget, addMessageVisitor } from "@tandem/mesh";

import { OpenRemoteBrowserRequest } from "@tandem/synthetic-browser";

addMessageVisitor(EditorFamilyType.MASTER)(setMessageTarget(EditorFamilyType.WORKER)(OpenRemoteBrowserRequest));
setMessageTarget(EditorFamilyType.WORKER)(ApplyFileEditRequest);

// yuck yuck -- need to export a dud in order for message
// visitors and stuff above to be properly registered
export class TestMessage {

}