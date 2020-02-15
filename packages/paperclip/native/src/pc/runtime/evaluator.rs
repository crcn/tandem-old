use super::super::ast;
use crate::base::runtime::{RuntimeError};
use crate::base::ast::{Location};
use super::virt;
use std::collections::HashSet;
use std::iter::FromIterator;
use super::graph::{DependencyGraph, DependencyContent};
use crate::css::runtime::evaulator::{evaluate as evaluate_css};
use crate::js::runtime::evaluator::{evaluate as evaluate_js};
use crate::js::runtime::virt as js_virt;
use crate::js::ast as js_ast;
use crate::css::runtime::virt as css_virt;
use crc::{crc32};

#[derive(Debug, Clone)]
pub struct Context<'a> {
  graph: &'a DependencyGraph,
  file_path: &'a String,
  import_ids: HashSet<&'a String>,
  part_ids: HashSet<&'a String>,
  scope: String,
  data: &'a js_virt::JsValue,
  in_part: bool,
  from_main: bool,
}

pub fn evaluate<'a>(node_expr: &ast::Node, file_path: &String, graph: &'a DependencyGraph, data: &js_virt::JsValue, part: Option<String>) -> Result<Option<virt::Node>, RuntimeError>  {
  let context = create_context(node_expr, file_path, graph, data, None);
  let mut root_result = evaluate_instance_node(node_expr, &context, part);

  // need to insert all styles into the root for efficiency
  match root_result {
    Ok(ref mut root_option) => {
      match root_option {
        Some(ref mut root) => {
          let style = evaluate_jumbo_style(node_expr, file_path, graph)?;
          root.prepend_child(style);
        },
        _ => { }
      }
    }
    _ => { }
  };

  root_result
}

pub fn evaluate_document_styles<'a>(node_expr: &ast::Node, file_path: &String) -> Result<css_virt::CSSSheet, RuntimeError>  {
  let mut sheet = css_virt::CSSSheet {
    rules: vec![] 
  };
  let children_option = ast::get_children(&node_expr);
  let scope = get_document_scope(file_path);
  if let Some(children) = children_option {
    // style elements are only allowed in root, so no need to traverse
    for child in children {
      if let ast::Node::StyleElement(style_element) = &child {
        sheet.extend(evaluate_css(&style_element.sheet, &scope)?);
      }
    }
  }

  Ok(sheet)
}

pub fn evaluate_jumbo_style<'a>(_entry_expr: &ast::Node,  file_path: &String, graph: &'a DependencyGraph) -> Result<virt::Node, RuntimeError>  {

  let mut sheet = css_virt::CSSSheet {
    rules: vec![] 
  };

  for (dependency, dependent_option) in graph.flatten(file_path) {
    let dep_sheet = match &dependency.content {
      DependencyContent::Node(node) => {
        evaluate_document_styles(node, &dependency.file_path)?
      },
      DependencyContent::StyleSheet(sheet) => {
        let scope = if let Some(dependent) = dependent_option {
          get_document_scope(&dependent.file_path)
        } else {
          get_document_scope(&dependency.file_path)
        };
        
        evaluate_css(&sheet, &scope)?
      }
    };

    sheet.extend(dep_sheet);
  }

  
  Ok(virt::Node::StyleElement(virt::StyleElement {
    sheet
  }))
}

pub fn evaluate_instance_node<'a>(node_expr: &ast::Node, context: &'a Context, part_option: Option<String>) -> Result<Option<virt::Node>, RuntimeError>  {

  let mut context = context.clone();

  let target_node = if let Some(part) = part_option {
    ast::get_children(node_expr).and_then(|children| {
      children.iter().find(|node| {
        if let ast::Node::Element(element) = node {
          element.tag_name == "part" && ast::get_attribute_value("id", element) == Some(&part)
        } else {
          false
        }
      })
    }).or(Some(node_expr)).unwrap()
  } else {
    node_expr
  };

  if target_node == node_expr {
    context.from_main = true;
  }
  
  evaluate_node(target_node, true, &context)
}

fn create_context<'a>(node_expr: &'a ast::Node, file_path: &'a String, graph: &'a DependencyGraph, data: &'a js_virt::JsValue, parent_option: Option<&'a Context>) -> Context<'a> {

  let from_main = if let Some(parent) = parent_option {
    (parent.from_main)
  } else {
    (false)
  };

  Context {
    graph,
    file_path,
    import_ids: HashSet::from_iter(ast::get_import_ids(node_expr)),
    part_ids: HashSet::from_iter(ast::get_part_ids(node_expr)),
    scope: get_document_scope(file_path),
    data,
    in_part: false,
    from_main,
  }
}

fn get_document_scope<'a>(file_path: &String) -> String {
  format!("{:x}", crc32::checksum_ieee(file_path.as_bytes())).to_string()
}

fn evaluate_node<'a>(node_expr: &ast::Node, is_root: bool, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  match &node_expr {
    ast::Node::Element(el) => {
      evaluate_element(&el, is_root, context)
    },
    ast::Node::StyleElement(el) => {
      evaluate_style_element(&el, context)
    },
    ast::Node::Text(text) => {
      Ok(Some(virt::Node::Text(virt::Text { value: text.value.to_string() })))
    },
    ast::Node::Slot(slot) => {
      evaluate_slot(&slot, context)
    },
    ast::Node::Fragment(el) => {
      evaluate_fragment(&el, context)
    },
    ast::Node::Block(block) => {
      evaluate_block(&block, context)
    },
    ast::Node::Comment(_el) => {
      Ok(None)
    }
  }
}

fn evaluate_element<'a>(element: &ast::Element, is_root: bool, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  match element.tag_name.as_str() {
    "import" => evaluate_import_element(element, context),
    "self" => evaluate_self_element(element, context),
    "part" => evaluate_part_element(element, is_root, context),
    "script" => Ok(None),
    _ => {
      if context.import_ids.contains(&ast::get_tag_name(&element)) {
        evaluate_imported_component(element, context)
      } else if context.part_ids.contains(&element.tag_name) {
        evaluate_part_instance_element(element, context)
      } else {
        evaluate_basic_element(element, context)
      }
    }
  }
}

fn evaluate_slot<'a>(slot: &ast::Slot, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  let script = &slot.script;
  let mut js_value = evaluate_js(script, &context.file_path, &context.graph, &context.data)?;

  // if array of values, then treat as document fragment
  if let js_virt::JsValue::JsArray(ary) = &mut js_value {
    let mut children = vec![];
    for item in ary.values.drain(0..) {
      if let js_virt::JsValue::JsNode(child) = item {
        children.push(child);
      } else {
        children.push(virt::Node::Text(virt::Text {
          value:item.to_string()
        }))
      }
    }

    return Ok(Some(virt::Node::Fragment(virt::Fragment {
      children
    })));
  } else if let js_virt::JsValue::JsNode(node)  = js_value {
    return Ok(Some(node));
  }

  Ok(Some(virt::Node::Text(virt::Text { value: js_value.to_string() })))
}

fn evaluate_imported_component<'a>(element: &ast::Element, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  let self_dep  = &context.graph.dependencies.get(context.file_path).unwrap();
  let dep_file_path = &self_dep.dependencies.get(&ast::get_tag_name(element)).unwrap();
  evaluate_component_instance(element, dep_file_path, context)
}

fn evaluate_part_instance_element<'a>(element: &ast::Element, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  let self_dep  = &context.graph.dependencies.get(context.file_path).unwrap();

  if let DependencyContent::Node(root_node) = &self_dep.content {
    let part = ast::get_part_by_id(&element.tag_name, root_node).unwrap();
    let data = create_component_instance_data(element, context)?;
    evaluate_element(part, true, &create_context(root_node, &self_dep.file_path, context.graph, &data, Some(context)))
  } else {

    // This should _never_ happen
    Err(RuntimeError::unknown(context.file_path))
  }
}

fn create_component_instance_data<'a>(instance_element: &ast::Element, context: &'a Context) -> Result<js_virt::JsValue, RuntimeError> {
  let mut context = context.clone();
  context.in_part = false;

  let mut data = js_virt::JsObject::new();

  for attr_expr in &instance_element.attributes {
    let attr = &attr_expr;
    let (name, value) = match attr {
      ast::Attribute::KeyValueAttribute(kv_attr) => {
        if kv_attr.value == None {
          (kv_attr.name.to_string(), js_virt::JsValue::JsBoolean(true))
        } else {
          let value = evaluate_attribute_value(&kv_attr.value.as_ref().unwrap(), &context)?;
          (
            kv_attr.name.to_string(),
            value
          )
        }
      },
      ast::Attribute::ShorthandAttribute(sh_attr) => {
        let name = sh_attr.get_name().map_err(|message| {
          RuntimeError {
            file_path: context.file_path.to_string(),
            message: message.to_string(),
            location: Location { 
              start: 0,
              end: 0
            }
          }
        })?;

        (name.to_string(), evaluate_attribute_slot(&sh_attr.reference, &context)?)
      }
    };

    data.values.insert(name, value);
  }

  
  let mut js_children = js_virt::JsArray::new();
  let children: Vec<js_virt::JsValue> = evaluate_children(&instance_element.children, &context)?.into_iter().map(|child| {
    js_virt::JsValue::JsNode(child)
  }).collect();

  js_children.values.extend(children);

  data.values.insert("children".to_string(), js_virt::JsValue::JsArray(js_children));

  Ok(js_virt::JsValue::JsObject(data))
}

fn evaluate_component_instance<'a>(instance_element: &ast::Element, dep_file_path: &String, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {

  let namespace = ast::get_tag_namespace(instance_element);

  let dep = &context.graph.dependencies.get(&dep_file_path.to_string()).unwrap();
  let data = create_component_instance_data(instance_element, context)?;
  
  if let DependencyContent::Node(node) = &dep.content {

    let context = &create_context(&node, dep_file_path, context.graph, &data, None);

    // TODO: if fragment, then wrap in span. If not, then copy these attributes to root element
    evaluate_instance_node(&node, &context, namespace)
  } else {
    Err(RuntimeError::unknown(context.file_path))
  }
}

fn evaluate_basic_element<'a>(element: &ast::Element, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {

  let mut attributes = vec![];

  let tag_name = ast::get_tag_name(element);

  for attr_expr in &element.attributes {
    let attr = &attr_expr;

    match attr {
      ast::Attribute::KeyValueAttribute(kv_attr) => {
        let (name, value) = if kv_attr.value == None {
          (kv_attr.name.to_string(), None)
        } else {
          (kv_attr.name.to_string(), Some(evaluate_attribute_value(&kv_attr.value.as_ref().unwrap(), context)?.to_string()))
        };

        attributes.push(virt::Attribute {
          name,
          value,
        });
      },
      ast::Attribute::ShorthandAttribute(sh_attr) => {
        let name = sh_attr.get_name().map_err(|message| {
          RuntimeError {
            file_path: context.file_path.to_string(),
            message: message.to_string(),
            location: Location { 
              start: 0,
              end: 0
            }
          }
        })?;
        let js_value = evaluate_attribute_slot(&sh_attr.reference, context)?;

        if js_value != js_virt::JsValue::JsUndefined() {
          attributes.push(virt::Attribute {
            name: name.to_string(),
            value: Some(js_value.to_string()),
          });
        }
      }
    };

  }

  attributes.push(virt::Attribute {
    name: format!("data-pc-{}", context.scope.to_string()).to_string(),
    value: None
  });

  let children = evaluate_children(&element.children, context)?;

  Ok(Some(virt::Node::Element(virt::Element {
    tag_name: tag_name,
    attributes,
    children
  })))
}

fn evaluate_import_element<'a>(_element: &ast::Element, _context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  Ok(None)
}

fn evaluate_self_element<'a>(element: &ast::Element, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  
  if context.from_main {
    return Err(RuntimeError { 
      file_path: context.file_path.to_string(), 
      message: "Can't call <self /> here since this causes an infinite loop!".to_string(), 
      location: element.open_tag_location.clone() 
    });
  }

  evaluate_component_instance(element, context.file_path, context)
}


fn evaluate_part_element<'a>(element: &ast::Element, is_root: bool, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  if !is_root {
    return Ok(None)
  }

  let mut context = context.clone();
  context.in_part = true;
  
  evaluate_children_as_fragment(&element.children, &context)
}

fn evaluate_style_element<'a>(_element: &ast::StyleElement, _context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  Ok(None)
}
  

fn evaluate_children<'a>(children_expr: &Vec<ast::Node>, context: &'a Context) -> Result<Vec<virt::Node>, RuntimeError> {
  
  let mut children: Vec<virt::Node> = vec![];

  for child_expr in children_expr {
    match evaluate_node(child_expr, false, context)? {
      Some(c) => { children.push(c); },
      None => { }
    }
  }

  Ok(children)
}

fn evaluate_fragment<'a>(fragment: &ast::Fragment, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  evaluate_children_as_fragment(&fragment.children, context)
}

fn evaluate_children_as_fragment<'a>(children: &Vec<ast::Node>, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  let mut children = evaluate_children(&children, context)?;
  if children.len() == 1 {
    return Ok(children.pop());
  }
  Ok(Some(virt::Node::Fragment(virt::Fragment {
    children
  })))
}

fn evaluate_block<'a>(block: &ast::Block, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  match block {
    ast::Block::Conditional(conditional) => {
      evaluate_conditional(conditional, context)
    }
  }
}

fn evaluate_conditional<'a>(block: &ast::ConditionalBlock, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  match block {
    ast::ConditionalBlock::PassFailBlock(pass_fail) => {
      evaluate_pass_fail_block(pass_fail, context)
    },
    ast::ConditionalBlock::FinalBlock(block) => {
      if let Some(node) = &block.node {
        evaluate_node(node, false, context)
      } else {
        Ok(None)
      }
    }
  }
}

fn evaluate_pass_fail_block<'a>(block: &ast::PassFailBlock, context: &'a Context) -> Result<Option<virt::Node>, RuntimeError> {
  let condition = evaluate_js(&block.condition, &context.file_path, &context.graph, context.data)?;
  if condition.truthy() {
    if let Some(node) = &block.node {
      evaluate_node(node, false, context)
    } else if let Some(fail) = &block.fail {
      evaluate_conditional(fail, context)
    } else {
      Ok(None)
    }
  } else if let Some(fail) = &block.fail {
    evaluate_conditional(fail, context)
  } else {
    Ok(None)
  }
}

fn evaluate_attribute_value<'a>(value: &ast::AttributeValue, context: &'a Context) -> Result<js_virt::JsValue, RuntimeError> {
  match value {
    ast::AttributeValue::String(st) => {
      Ok(js_virt::JsValue::JsString(st.value.clone()))
    }
    ast::AttributeValue::Slot(script) => {
      evaluate_attribute_slot(script, context)
    }
  }
}

fn evaluate_attribute_slot<'a>(script: &js_ast::Statement, context: &'a Context) -> Result<js_virt::JsValue, RuntimeError> {
  evaluate_js(script, &context.file_path, &context.graph, &context.data)
}

#[cfg(test)]
mod tests {
  use super::*;
  use super::super::graph::*;
  use super::super::super::parser::*;

  #[test]
  fn can_evaluate_a_style() {
    let case = "<style>div { color: red; }</style><div></div>";
    let ast = parse(case).unwrap();
    let graph = DependencyGraph::new();
    let _node = evaluate(&ast, &"something".to_string(), &graph, &js_virt::JsValue::JsObject(js_virt::JsObject::new()), None).unwrap().unwrap();
  }
}
