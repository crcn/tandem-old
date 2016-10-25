import * as React from "react";
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import {
  Injector,
  Dependencies,
  PrivateBusDependency,
  DependenciesDependency,
} from "@tandem/common/dependencies";

export interface IApplicationComponentContext {
  bus: IActor;
  dependencies: Dependencies;
}

export const editorComponentContextTypes = {
  bus: React.PropTypes.object.isRequired,
  dependencies: React.PropTypes.object.isRequired
};

export class BaseApplicationComponent<T, U> extends React.Component<T, U> {

  static contextTypes = editorComponentContextTypes;

  @inject(PrivateBusDependency.ID)
  protected readonly bus: IActor;

  @inject(DependenciesDependency.ID)
  protected readonly dependencies: Dependencies

  constructor(props: T, context: IApplicationComponentContext, callbacks: any) {
    super(props, context, callbacks);
    Injector.inject(this, context.dependencies);
  }
}