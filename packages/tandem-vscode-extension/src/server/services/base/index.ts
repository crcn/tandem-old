import { Engine, EngineEvent } from "paperclip";
import { SourceLocation } from "paperclip/src/base-ast";

export enum LanguageServiceEventType {
  ColorInformation = "ColorInformation"
}

export type ColorInfo = {
  color: string;
  location: SourceLocation;
};

export type BaseLanguageServiceEvent<TType extends LanguageServiceEventType> = {
  uri: string;
  type: TType;
};

export type ColorInfoEvent = {
  payload: ColorInfo[];
} & BaseLanguageServiceEvent<LanguageServiceEventType.ColorInformation>;

export type LanguageServiceEvent = ColorInfoEvent;

type Listener = (event: LanguageServiceEvent) => void;

export abstract class BaseLanguageService {
  private _listeners: Listener[];
  constructor() {
    this._listeners = [];
  }
  onEvent(listener: Listener) {
    this._listeners.push(listener);
    return {
      dispose: () => {
        const i = this._listeners.indexOf(listener);
        if (i !== -1) {
          this._listeners.splice(i, 1);
        }
      }
    };
  }

  protected dispatch(event: LanguageServiceEvent) {
    for (const listener of this._listeners) {
      listener(event);
    }
  }
}

export abstract class BaseEngineLanguageService extends BaseLanguageService {
  constructor(protected _engine: Engine) {
    super();
    _engine.onEvent(this._onEngineEvent);
  }
  private _onEngineEvent = (event: EngineEvent) => {
    this._handleEngineEvent(event);
  };
  protected abstract _handleEngineEvent(event: EngineEvent): void;
}
