import { StructReference } from "aerial-common2";
import * as React from "react";
import { dndStarted, dndEnded } from "../actions";

export type DNDState = {
  draggingRefs: StructReference[];
}

export type ConnectDragSource = (element: React.ReactElement<any>) => React.ReactElement<any>;

export type DragSourceHandler<TInner> = {
  getData: (props) => StructReference;
  start?: (props: TInner) => (event: React.DragEvent<any>) => void;
};

export const withDragSource = <TInner, TOuter>(handler: DragSourceHandler<TInner>) => (BaseComponent: React.ComponentClass) => {
  class DraggableComponentClass extends React.Component {
    render() {
      return React.createElement(BaseComponent, {
        connectDragSource: (element: React.ReactElement<any>) => {
          return React.cloneElement(element, {
            draggable: true,
            onDragStart: (event: React.DragEvent<any>) => {
              if (handler.start) {
                handler.start(this.props as TInner)(event);
              }
              (this.props as any).dispatch(dndStarted(handler.getData(this.props), event))
            },
            onDragEnd: (event) => (this.props as any).dispatch(dndEnded(handler.getData(this.props), event)),
          })
        },
        ...(this.props as any)
      });
    }
  }

  return DraggableComponentClass;
}