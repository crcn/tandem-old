
export const CANVAS_SIZE = 5000;
export const ZOOM_INCREMENT = 0.3;
export const POINTER_TOOL_KEY_CODE = "p";

export namespace SettingKeys {
  export const HIDE_LEFT_SIDEBAR = "hideLeftSidebar";
  export const HIDE_RIGHT_SIDEBAR = "hideRightSidebar";
  export const HIDE_BOTTOM_GUTTER = "hideBottomGutter";
}

export namespace MetadataKeys {
  export const CANVAS_ROOT = "canvasRoot";
  export const ENTITY_VISIBLE = "entityVisible";
  export const LAYER_DEPENDENCY_NAME = "layerProviderName";
  export const HOVERING = "hovering";
  export const REVEAL   = "reveal";
  export const SELECTED = "selected";
  
  export const HIDDEN = "hidden";
  export const SELECTABLE = "selectable";
  export const MOVING = "moving";
  export const ZOOMING = "zooming";
  export const EDIT_LAYER = "editLayer";
  export const LAYER_EXPANDED = "layerExpanded";
  export const CHILD_LAYER_PROPERTY = "childLayerProperty";
  export const WORKSPACE_KEY = "workspaceKey";
}

export namespace EditorRouteNames {
  export const ROOT      = "root";
  export const WORKSPACE = "workspace";
}

export namespace ContextMenuTypes {
  export const SYNTHETIC_ELEMENT = "syntheticElement";
}

export namespace ToolFamily {
  export const INTERACT = "interact";
}