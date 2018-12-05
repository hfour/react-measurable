import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export type IReactComponent<P> =
  | React.FunctionComponentFactory<P>
  | React.ClassicComponentClass<P>
  | React.ComponentClass<P>;

export interface MeasurableProps extends React.Attributes {
  observeResize?: <T extends Element>(
    ref: React.RefObject<T>,
    callback: (rect: DOMRectReadOnly, target: T) => void,
  ) => void;
}

export function measurable<T extends IReactComponent<MeasurableProps>>(Component: T) {
  const displayName =
    'measurable-' +
    (((Component as unknown) as React.ComponentClass<MeasurableProps>).displayName ||
      ((Component as unknown) as React.ComponentClass<MeasurableProps>).name ||
      (Component.constructor && Component.constructor.name) ||
      'Unknown');

  class MeasurableComponent extends React.Component<MeasurableProps> {
    static displayName = displayName;

    private measure = (entries: ResizeObserverEntry[]) => {
      let rect: DOMRectReadOnly = null;
      let node: Element;
      if (entries && entries.length === 1) {
        rect = entries[0].contentRect as DOMRectReadOnly;
        node = entries[0].target;
      }

      if (this._obtainedListener) {
        this._obtainedListener(rect, node);
      }
    };

    private observeResize = <T extends Element>(
      ref: React.RefObject<T>,
      callback: (rect: DOMRectReadOnly, target: T) => void,
    ) => {
      this._obtainedChildRef = ref;
      this._obtainedListener = callback;
    };

    private _resizeObserverRef = new ResizeObserver(this.measure);
    private _obtainedChildRef: React.RefObject<Element>;
    private _obtainedListener: (rect: DOMRectReadOnly, target: Element) => void;

    componentDidMount() {
      this._resizeObserverRef.observe(this._obtainedChildRef.current);
    }

    componentWillUnmount() {
      this._resizeObserverRef.disconnect();
    }

    render() {
      const props = { ...this.props, observeResize: this.observeResize };
      return React.createElement(Component, props);
    }
  }

  // Casting to unknown, to T here because Typescript expects class decorators
  // to return the same type which was passed - which in our case is true, but
  // is not inferred.
  return (MeasurableComponent as unknown) as T;
}
