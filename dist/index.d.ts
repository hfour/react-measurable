import * as React from "react";
export declare type IReactComponent<P> = React.FunctionComponentFactory<P> | React.ClassicComponentClass<P> | React.ComponentClass<P>;
export interface MeasurableProps extends React.Attributes {
    observeResize?: <T extends Element>(ref: React.RefObject<T>, callback: (rect: DOMRectReadOnly, target: T) => void) => void;
}
export declare function measurable<T extends IReactComponent<MeasurableProps>>(Component: T): T;
