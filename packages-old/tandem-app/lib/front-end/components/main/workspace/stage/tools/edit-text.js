"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./edit-text.scss");
var recompose_1 = require("recompose");
var TEXT_PADDING = 10;
exports.EditTextToolBase = function (_a) {
    var workspace = _a.workspace, dispatch = _a.dispatch, setTextarea = _a.setTextarea, zoom = _a.zoom;
    return null;
    // if (!workspace.stage.secondarySelection) return null;
    // const selectedNode: SyntheticNode = workspace.selectionRefs.map(([type, id]) => getSyntheticNodeById(browser, id)).shift();
    // if (!isSyntheticDOMNode(selectedNode)) return null;
    // const nodeWindow: SyntheticWindow = getSyntheticNodeWindow(browser, selectedNode.$id);
    // const bounds = nodeWindow.allComputedBounds[selectedNode.$id];
    // const computedStyle = (nodeWindow.allComputedStyles[selectedNode.$id] || {}) as CSSStyleDeclaration;
    // if (!bounds) return null;
    // const { width, height } = getBoundsSize(bounds);
    // const style = {
    //   fontSize: computedStyle.fontSize,
    //   color: computedStyle.color,
    //   position: "absolute",
    //   left: nodeWindow.bounds.left + bounds.left,
    //   top: nodeWindow.bounds.top + bounds.top,
    //   overflow: "visible",
    //   background: "white",
    //   minWidth: width,
    //   minHeight: height,
    //   // that may be on a white background.
    //   zIndex: 99999999
    // };
    // const textStyle = {
    //   fontSize: computedStyle.fontSize,
    //   // color: computedStyle.color,
    //   fontFamily: computedStyle.fontFamily,
    //   lineHeight: computedStyle.lineHeight,
    //   letterSpacing: computedStyle.letterSpacing,
    //   textAlign: computedStyle.textAlign,
    //   padding: computedStyle.padding,
    //   border: "none",
    // };
    // return <div style={style as any}>
    //   <span 
    //    ref={setTextarea}
    //   style={{ resize: "none", overflow: "visible", padding: 0, ...textStyle } as any} 
    //   contentEditable
    //   onChange={wrapEventToDispatch(dispatch, stageToolEditTextChanged.bind(this, selectedNode.$id))}
    //   onKeyDown={wrapEventToDispatch(dispatch, stageToolEditTextKeyDown.bind(this, selectedNode.$id))}
    //   onBlur={wrapEventToDispatch(dispatch, stageToolEditTextBlur.bind(this, selectedNode.$id))}
    //   >{getSyntheticNodeTextContent(selectedNode).trim()}</span>
    // </div>;
};
var enhanceEditTextTool = recompose_1.compose(recompose_1.pure, recompose_1.withState("textarea", "setTextarea", null), recompose_1.lifecycle({
    componentWillUpdate: function (_a) {
        var textarea = _a.textarea;
        if (textarea && this.props.textarea !== textarea) {
            textarea.focus();
            setTimeout(function () {
                var range = textarea.ownerDocument.createRange();
                range.selectNodeContents(textarea);
                var sel = textarea.ownerDocument.defaultView.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }, 1);
        }
    }
}));
exports.EditTextTool = enhanceEditTextTool(exports.EditTextToolBase);
//# sourceMappingURL=edit-text.js.map