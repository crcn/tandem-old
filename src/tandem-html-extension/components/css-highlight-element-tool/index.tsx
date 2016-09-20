import "./index.scss";

import * as React from "react";
import { Editor, Workspace } from "tandem-front-end/models";
import { ReactComponentFactoryDependency } from "tandem-front-end/dependencies";
import { CSSRuleEntity, CSSDeclarationEntity, VisibleHTMLElementEntity } from "tandem-html-extension/lang";

export class CSSHighlightElementTool extends React.Component<{ editor: Editor, workspace: Workspace }, any> {
  render() {

    // stubbed for now. Cool feature, but CSS styles can be easily identified
    // by changing properties a bit -- adding UI elements around CSS selectors fudges up
    // the UI a bit

    return null;

    // const { editor, workspace } = this.props;
    // const { selection } = workspace;
    // const { zoom } = editor;

    // const cssEntities = selection.filter((entity) => {
    //   return entity instanceof CSSRuleEntity || entity instanceof CSSDeclarationEntity;
    // });

    // if (!cssEntities.length) return null;

    // const rules: Array<CSSRuleEntity> = [];

    // for (const entity of cssEntities) {
    //   if (entity instanceof CSSRuleEntity) {
    //     rules.push(entity);
    //   } else if (entity instanceof CSSDeclarationEntity) {
    //     if (entity.parent instanceof CSSRuleEntity) {
    //       rules.push(entity.parent);
    //     } else {
    //       // TODO - scan doc for declaration key in value
    //     }
    //   }
    // }

    // if (!rules.length) return null;

    // const matchedEntities: Array<VisibleHTMLElementEntity> = [];
    // const allEntities = workspace.file.entity.flatten();

    // for (const entity of allEntities) {
    //   for (const rule of rules) {
    //     if (rule.selectorMatches(entity)) {
    //       matchedEntities.push(entity as VisibleHTMLElementEntity);
    //     }
    //   }
    // }

    // const borderWidth = 2 / zoom;

    // return <div className="m-highlight-element-stage-tool">
    //   {matchedEntities.map((entity: VisibleHTMLElementEntity, i) => {
    //     const bounds = entity.display.bounds;
    //     const style = {
    //       position: "absolute",
    //       left: bounds.left,
    //       top: bounds.top,
    //       width: bounds.width,
    //       height: bounds.height,
    //       boxShadow: `0 0 0 ${borderWidth}px #F60`
    //     };
    //     return <div style={style} key={i} />;
    //   })}
    // </div>;
  }
}

export const cssHighlightElementToolComponentFactoryDependency = new ReactComponentFactoryDependency("components/tools/pointer/cssRuleHighlight", CSSHighlightElementTool);
