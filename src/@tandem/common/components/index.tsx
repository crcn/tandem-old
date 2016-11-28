import * as React from "react";
import { IDispatcher, IBus } from "@tandem/mesh";
import { inject, loggable } from "@tandem/common/decorators";
import {
  Injector,
  IInjectable,
  PrivateBusProvider,
  InjectorProvider,
} from "@tandem/common/ioc";
import {
  Logger
} from "@tandem/common/logger";

export interface IApplicationComponentContext {
  bus: IBus<any>;
  injector: Injector;
}

export const appComponentContextTypes = {
  bus: React.PropTypes.object,
  injector: React.PropTypes.object
};

@loggable()
export class BaseApplicationComponent<T, U> extends React.Component<T, U> implements IInjectable {

  protected readonly logger: Logger;

  static contextTypes = appComponentContextTypes;

  @inject(PrivateBusProvider.ID)
  protected readonly bus: IBus<any>;

  @inject(InjectorProvider.ID)
  protected readonly injector: Injector

  constructor(props: T, context: IApplicationComponentContext, callbacks: any) {
    super(props, context, callbacks);

    if (context.injector) {
      context.injector.inject(this);
    } else {
      console.warn(`Failed to inject properties into `, this.constructor.name);
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
      injector: this.props.injector
    };
  }

  render() {
    return <span>{ this.props.children } </span>;
  }
}