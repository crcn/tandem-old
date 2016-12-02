import { BaseStudioWorkerCommand } from "./base";
import { inject } from "@tandem/common";
import { ApplyFileEditRequest, FileEditorProvider, FileEditor } from "@tandem/sandbox";

export class ApplyFileEditCommand extends BaseStudioWorkerCommand { 

  @inject(FileEditorProvider.ID)
  private _fileEditor: FileEditor;

  execute(request: ApplyFileEditRequest) {
    this._fileEditor.applyMutations(request.mutations);
  }
}