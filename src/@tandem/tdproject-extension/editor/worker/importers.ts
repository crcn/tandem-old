import assert = require("assert");
import path =  require("path");
import { SyntheticDOMElement, SyntheticWindow } from "@tandem/synthetic-browser";
import { IFileSystem, FileSystemProvider, ApplyFileEditRequest } from "@tandem/sandbox";
import { IFileImporter, ImportFileRequest, PreviewLoaderProvider, OpenFileRequest } from "@tandem/editor/worker";
import { Injector, InjectorProvider, PrivateBusProvider, IBrokerBus, inject, BoundingRect } from "@tandem/common";

export interface IPreviewConfig {
  renderFunction: string;
  title: string;
  dependencyGraph: {
    strategy: string;
  }
}

// TODO - open new workspace if dnd file is .tdm mime type
export class TDRootFileImporter implements IFileImporter {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  @inject(FileSystemProvider.ID)
  private _fileSystem: IFileSystem;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  async importFile({ filePath, targetObject, bounds }: ImportFileRequest) {

    // TODO: temporary fix for DNDd files
    filePath = filePath.replace(/^file:\/\//g, "");

    const content = String(await this._fileSystem.readFile(filePath));

    const element = <SyntheticDOMElement>targetObject;

    if (content.indexOf("createBodyElement") !== -1) {
      return this.importPreview(filePath, element, bounds);
    }

    const previewLoader = PreviewLoaderProvider.find(filePath, this._injector);

    if (!previewLoader) {
      throw new Error(`Cannot create preview file`);
    }

    const preview = await previewLoader.loadFilePreview(arguments[0]);

    if (!(await this._fileSystem.fileExists(preview.filePath))) {
      await this._fileSystem.writeFile(preview.filePath, preview.content);
      await this._bus.dispatch(new OpenFileRequest(preview.filePath));
    }

    return this.importPreview(preview.filePath, element, bounds);
  }

  private async importPreview(filePath: string, element: SyntheticDOMElement, bounds: BoundingRect) {

    if (!bounds) bounds = new BoundingRect(0, 0, 1024, 768);

    const { document } = new SyntheticWindow();
    const artboard = document.createElement("artboard");
    artboard.setAttribute("title", path.relative(process.cwd(), filePath));;
    artboard.setAttribute("src", filePath);
    artboard.setAttribute("style", `left:${bounds.left}px;top:${bounds.top}px;width:${bounds.width || 1024}px;height:${bounds.height || 768}px;`);

    const edit = element.createEdit();
    edit.appendChild(artboard);

    this._bus.dispatch(new ApplyFileEditRequest(edit.mutations, true));
  }

}