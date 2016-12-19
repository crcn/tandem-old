import { inject, BaseCommand } from "@tandem/common";
import { ApplyFileEditRequest, FileEditorProvider, FileEditor } from "@tandem/sandbox";

export class ApplyFileEditCommand extends BaseCommand { 

  @inject(FileEditorProvider.ID)
  private _fileEditor: FileEditor;

  execute(request: ApplyFileEditRequest) {
    this._fileEditor.applyMutations(request.mutations);
  }
}