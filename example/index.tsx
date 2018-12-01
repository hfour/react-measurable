import * as React from "react";
import { render } from "react-dom";
import { measurable, MeasurableProps } from "../src";
import { TextAlignProperty, FlexWrapProperty } from "csstype";

interface TestProps extends MeasurableProps {
  onResize: () => void;
}

@measurable
export class TestComp extends React.Component<TestProps, { width: number }> {
  _ref = React.createRef<HTMLDivElement>();
  state = {
    width: 0
  };

  componentDidMount() {
    this.props.observeResize(this._ref, rect => {
      this.setState({ width: rect.width });
      this.props.onResize();
    });
  }

  render() {
    const style = {
      display: "inline-block",
      border: "solid 1px #ccc",
      flex: "1 0",
      minWidth: 50,
      textOverflow: "clip",
      margin: 5,
      fontSize: 14,
      textAlign: "center" as TextAlignProperty,
      padding: 5
    };
    return (
      <div style={style} ref={this._ref}>
        {Math.round(this.state.width * 100) / 100}
      </div>
    );
  }
}

type State = { count: number; width: number; resizes: number };
class Container extends React.Component<{}, State> {
  state = {
    count: 10,
    width: 50,
    resizes: 0
  };

  increase = () => {
    this.setState({ count: this.state.count + 10 });
  };

  decrease = () => {
    this.setState({ count: Math.max(this.state.count - 10, 0) });
  };

  setWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ width: parseInt(e.currentTarget.value, 10) });
  };

  onResize = () => {
    this.setState({ resizes: this.state.resizes + 1 });
  };

  render() {
    const arr = new Array(this.state.count).fill(0);
    const style = {
      width: `${this.state.width}%`,
      margin: "auto",
      background: "#f3f3f3",
      display: "flex",
      flexWrap: "wrap" as FlexWrapProperty
    };
    return (
      <div
        style={{
          width: "50%",
          minWidth: 1000,
          margin: "auto",
          padding: 10,
          border: "solid 1px #ccc",
          fontSize: 13
        }}
      >
        <div
          style={{
            margin: "10px",
            display: "flex",
            alignItems: "center"
          }}
        >
          <button onClick={this.increase}>Add 10</button>
          &nbsp;
          <button onClick={this.decrease}>Remove 10</button>
          &nbsp;
          <input
            type="range"
            value={this.state.width}
            onChange={this.setWidth}
            min={25}
            max={99}
          />
          &nbsp;
          <span style={{ width: 75 }}>Width: {this.state.width}%</span>
          &nbsp; Resize Events: {this.state.resizes}
        </div>
        <div style={style}>
          {arr.map((_item, i) => (
            <TestComp key={i} onResize={this.onResize} />
          ))}
        </div>
      </div>
    );
  }
}

const root = document.getElementById("root");
render(<Container />, root);
