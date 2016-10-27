import * as React from "react";
import { IActor } from "@tandem/common/actors";
import { inject } from "@tandem/common/decorators";
import {
  Injector,
  Dependencies,
  IInjectable,
  PrivateBusDependency,
  DependenciesDependency,
} from "@tandem/common/dependencies";

export interface IApplicationComponentContext {
  bus: IActor;
  dependencies: Dependencies;
}

export const appComponentContextTypes = {
  bus: React.PropTypes.object,
  dependencies: React.PropTypes.object
};

export class BaseApplicationComponent<T, U> extends React.Component<T, U> implements IInjectable {

  static contextTypes = appComponentContextTypes;

  @inject(PrivateBusDependency.ID)
  protected readonly bus: IActor;

  @inject(DependenciesDependency.ID)
  protected readonly dependencies: Dependencies

  constructor(props: T, context: IApplicationComponentContext, callbacks: any) {
    super(props, context, callbacks);

    if (context.dependencies) {
      Injector.inject(this, context.dependencies);
    } else {
      console.error(`Failed to inject properties into `, this.constructor.name);
    }
  }

  $didInject() {

  }
}

export class RootApplicationComponent extends React.Component<IApplicationComponentContext, {}> implements IInjectable {

  static childContextTypes = appComponentContextTypes;

  getChildContext() {
    return {
      bus: this.props.bus,
      dependencies: this.props.dependencies
    };
  }

  render() {
    return <span>{ this.props.children } </span>;
  }
}