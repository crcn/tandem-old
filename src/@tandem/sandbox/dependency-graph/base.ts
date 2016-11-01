import { RawSourceMap } from "source-map";

export interface IDependencyContent {
  readonly type: string; // mime type
  readonly content: any;
  readonly ast?: any;
  map?: RawSourceMap;
}
