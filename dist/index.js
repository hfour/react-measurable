"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const resize_observer_polyfill_1 = require("resize-observer-polyfill");
function measurable(Component) {
    const displayName = "measurable-" +
        (Component
            .displayName ||
            Component.name ||
            (Component.constructor && Component.constructor.name) ||
            "Unknown");
    class MeasurableComponent extends React.Component {
        constructor() {
            super(...arguments);
            this.measure = (entries) => {
                let rect = null;
                let node;
                if (entries && entries.length === 1) {
                    rect = entries[0].contentRect;
                    node = entries[0].target;
                }
                if (this._obtainedListener) {
                    this._obtainedListener(rect, node);
                }
            };
            this.observeResize = (ref, callback) => {
                this._obtainedChildRef = ref;
                this._obtainedListener = callback;
            };
            this._resizeObserverRef = new resize_observer_polyfill_1.default(this.measure);
        }
        componentDidMount() {
            this._resizeObserverRef.observe(this._obtainedChildRef.current);
        }
        componentWillUnmount() {
            this._resizeObserverRef.disconnect();
        }
        render() {
            const props = Object.assign({}, this.props, { observeResize: this.observeResize });
            return React.createElement(Component, props);
        }
    }
    MeasurableComponent.displayName = displayName;
    // Casting to unknown, to T here because Typescript expects class decorators
    // to return the same type which was passed - which in our case is true, but
    // is not inferred.
    return MeasurableComponent;
}
exports.measurable = measurable;
