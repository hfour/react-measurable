# React-Measurable 📐

Decorate your React component and get notified when its dimensions change.

## Install

`npm install react-measurable`

## Requirements

React-measurable is compatible with React 16.3 and React strict mode since it uses the new `createRef` API.

It also depends on [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill) for browsers that don't support the ResizeObserver API (non-Chrome). The performance depends entirely on the polyfill performance.

## Demo

https://hfour.github.io/react-measurable/

## Usage

1. Decorate your component with `@measurable`.
2. In your `componentDidMount` lifecycle method, make sure you call `observeResize`.
3. If you use Typescript, the component's props need to extend `MeasurableProps`.
4. You don't need to worry about unobserving the DOM node - the decorator handles that.

```tsx
import * as React from "react";
import { measurable, MeasurableProps } from "../src";

interface MyProps extends MeasurableProps {}

@measurable
export class MyComponent extends React.Component<MyProps> {
  ref = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.props.observeResize(this.ref, (rect, target) => {
      // Do something
    });
  }

  render() {
    return <div ref={this.ref}>A div that could change size</div>;
  }
}
```

## API

The decorator adds an additional prop to your component. The prop is a registration function which needs to be called in your `componentDidMount` lifecycle method.

You need to pass a ref to your DOM node and a callback to the `observeResize` function. The DOM node ref can be _any_ DOM node, not necessarily the one rendered by the decorated component. The ref needs to be a `React.RefObject`, supported in React 16.3. The callback will be called when a size change is observer and will be passed a `DOMRectReadyOnly` object and a the actual observed DOM node.

```ts
// The Element and DOMRectReadOnly are standard DOM types.
export interface MeasurableProps extends React.Attributes {
  observeResize?: <T extends Element>(
    ref: React.RefObject<T>,
    callback: (rect: DOMRectReadOnly, target: T) => void
  ) => void;
}
```

## More

The decorator makes very little assumptions about how you use it. It does not perform extra measurements on components apart from what the polyfill does. It only notifies your component when its size changes, with a minimal API.

If you want notifications to parent components, you could do the following:

```tsx
interface MyProps extends MeasurableProps {
  // Passed by the parent to observe clild resizes
  onResize: (rect: ClientRect) => void;
}

@measurable
export class MyComponent extends React.Component<MyProps> {
  // ...
  componentDidMount() {
    this.props.observeResize(this.ref, (rect, target) => {
      // Perform more measurements
      this.props.onResize(getBoundingClientRect(target));
    });
  }
  // ...
}
```

The decorator doesn't use prop-types because, well, typescript exists.

## License

MIT
