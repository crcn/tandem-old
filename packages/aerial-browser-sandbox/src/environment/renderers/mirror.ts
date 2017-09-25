import { SyntheticWindowRendererInterface, BaseSyntheticWindowRenderer, SyntheticWindowRendererEvent } from "./base";
import { SEnvWindowInterface } from "../window";

export class SyntheticMirrorRenderer extends BaseSyntheticWindowRenderer {
  readonly container: HTMLElement = null;
  private _source: SyntheticWindowRendererInterface;

  constructor(window: SEnvWindowInterface) {
    super(window);
  }

  async render() {
    
  }

  set source(source: SyntheticWindowRendererInterface) {
    this._disposeSourceListeners();
    this._source = source;

    if (this._source) {
      this._source.addEventListener(SyntheticWindowRendererEvent.PAINTED, this._onSourcePainted);
      this._sync();
    }
  }

  public dispose() {
    this._disposeSourceListeners();
  }

  private _disposeSourceListeners() {
    if (this._source) {
      this._source.removeEventListener(SyntheticWindowRendererEvent.PAINTED, this._onSourcePainted);
    }
  }

  private _onSourcePainted = (event: SyntheticWindowRendererEvent) => {
    this._sync();
  }

  private _sync() {
    if (this._source.computedStyles) {
      this.setPaintedInfo(
        this._source.clientRects,
        this._source.computedStyles,
        this._source.scrollRect,
        this._source.scrollPosition
      );
    }
  }
}