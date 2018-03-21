"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var aerial_common2_1 = require("aerial-common2");
var Isolate = /** @class */ (function (_super) {
    __extends(Isolate, _super);
    function Isolate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onLoad = function () {
            if (_this.props.onLoad)
                _this.props.onLoad();
        };
        _this.onWheel = function (event) {
            _this.props.onWheel(event);
        };
        _this.onScroll = function (event) {
            if (_this.props.onScroll)
                _this.props.onScroll(event);
            if (_this.props.scrolling === false) {
                var db = _this.refs.container.contentDocument;
                db.body.scrollLeft = db.body.scrollTop = 0;
            }
        };
        return _this;
    }
    Isolate.prototype.componentDidMount = function () {
        if (window["$synthetic"]) {
            return;
        }
        if (this.props.inheritCSS) {
            var head_1 = this.head;
            var tags = Array.prototype.slice.call(document.getElementsByTagName("style"), 0).concat(Array.prototype.slice.call(document.getElementsByTagName("link"), 0));
            Array.prototype.forEach.call(tags, function (style) {
                head_1.appendChild(style.cloneNode(true));
            });
        }
        this.body.appendChild(this._mountElement = document.createElement("div"));
        if (this.props.onMouseDown) {
            this.body.addEventListener("mousedown", this.props.onMouseDown);
        }
        if (this.props.onKeyDown) {
            this.body.addEventListener("keydown", this.props.onKeyDown);
        }
        this._render();
        this._addListeners();
    };
    Isolate.prototype.componentDidUpdate = function () {
        this._render();
        var scrollPosition = this.props.scrollPosition;
        if (this.window && scrollPosition) {
            if (scrollPosition.left !== this.window.scrollX || scrollPosition.top !== this.window.scrollY) {
                this.window.scrollTo(scrollPosition.left, scrollPosition.top);
            }
        }
    };
    Object.defineProperty(Isolate.prototype, "window", {
        get: function () {
            return this.refs.container && this.refs.container.contentWindow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Isolate.prototype, "head", {
        get: function () {
            return this.window.document.head;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Isolate.prototype, "body", {
        get: function () {
            return this.window.document.body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Isolate.prototype, "container", {
        get: function () {
            return this.refs.container;
        },
        enumerable: true,
        configurable: true
    });
    Isolate.prototype._render = function () {
        if (window["$synthetic"])
            return;
        if (this.props.children && this._mountElement) {
            ReactDOM.render(this.props.children, this._mountElement);
        }
    };
    Isolate.prototype._addListeners = function () {
        aerial_common2_1.bubbleHTMLIframeEvents(this.refs.container, {
            ignoreInputEvents: this.props.ignoreInputEvents,
            translateMousePositions: this.props.translateMousePositions
        });
    };
    Isolate.prototype.render = function () {
        // TODO - eventually want to use iframes. Currently not supported though.
        if (window["$synthetic"]) {
            return React.createElement("span", null, this.props.children);
        }
        return React.createElement("iframe", { ref: "container", onDragOver: this.props.onDragOver, onDrop: this.props.onDrop, onWheel: this.onWheel, onScroll: this.onScroll, onLoad: this.onLoad, className: this.props.className, style: this.props.style });
    };
    return Isolate;
}(React.Component));
exports.Isolate = Isolate;
//# sourceMappingURL=index.js.map