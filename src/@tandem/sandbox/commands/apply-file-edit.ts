import { FileEditor } from "../edit";
import { FileEditorProvider } from "../providers";
import { inject, BaseCommand } from "@tandem/common";
import { ApplyFileEditRequest } from "../messages";

export class ApplyFileEditCommand extends BaseCommand { 

  @inject(FileEditorProvider.ID)
  private _fileEditor: FileEditor;

  execute(request: ApplyFileEditRequest) {
    return this._fileEditor.applyMutations(request.mutations);
  }
}