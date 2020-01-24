use std::fmt;

use super::super::ast;
use super::virt;
use std::collections::HashSet;
use std::iter::FromIterator;
use crate::base::ast::{Expression};
use super::graph::{DependencyGraph};

#[derive(Debug)]
pub struct Context<'a> {
  graph: &'a DependencyGraph,
  file_path: &'a String,
  import_ids: HashSet<&'a String>
}

pub fn evaluate<'a>(node_expr: &Expression<ast::Node>, file_path: &String, graph: &'a DependencyGraph) -> Result<Option<virt::Node>, &'static str>  {
  let context = Context {
    graph,
    file_path,
    import_ids: HashSet::from_iter(ast::get_import_ids(node_expr))
  };

  evaluate_node(node_expr, &context)
}

fn evaluate_node<'a>(node_expr: &Expression<ast::Node>, context: &'a Context) -> Result<Option<virt::Node>, &'static str> {
  match &node_expr.item {
    ast::Node::Element(el) => {
      evaluate_element(&el, context)
    },
    ast::Node::StyleElement(el) => {
      evaluate_style_element(&el, context)
    },
    ast::Node::Text(text) => {
      Ok(Some(virt::Node::Text(virt::Text { value: text.value.to_string() })))
    },
    ast::Node::Slot(slot) => {
      Ok(Some(virt::Node::Text(virt::Text { value: slot.value.to_string() })))
    },
    ast::Node::Fragment(el) => {
      evaluate_fragment(&el, context)
    },
    ast::Node::Comment(_el) => {
      Ok(None)
    }
  }
}
fn evaluate_element<'a>(element: &ast::Element, context: &'a Context) -> Result<Option<virt::Node>, &'static str> {
  match element.tag_name.as_str() {
    "import" => evaluate_import_element(element, context),
    _ => {
      if context.import_ids.contains(&element.tag_name) {
        println!("{}", "OK");
        evaluate_imported_component(element, context)
      } else {
        evaluate_basic_element(element, context)
      }
    }
  }
}

fn evaluate_imported_component<'a>(element: &ast::Element, context: &'a Context) -> Result<Option<virt::Node>, &'static str> {

  // let attributes = vec![];
  // let children = vec![];
  let selfDep  = &context.graph.dependencies.get(context.file_path).unwrap();

  let dep_file_path = &selfDep.dependencies.get(&element.tag_name).unwrap();

  let dep = &context.graph.dependencies.get(&dep_file_path.to_string()).unwrap();

  // TODO: if fragment, then wrap in span. If not, then copy these attributes to root element
  evaluate(&dep.expression, dep_file_path, &context.graph)
}

fn evaluate_basic_element<'a>(element: &ast::Element, context: &'a Context) -> Result<Option<virt::Node>, &'static str> {
  
  let mut attributes = vec![];


  let tag_name = element.tag_name.clone();


  for attr_expr in &element.attributes {
    let attr = &attr_expr.item;

    let value;

    if attr.value == None {
      value = None;
    } else {
      value = evaluate_attribute_value(&attr.value.as_ref().unwrap().item, context)?;
    }
    attributes.push(virt::Attribute {
      name: attr.name.clone(), 
      value,
    });
  }

  let children = evaluate_children(&element.children, context)?;


  Ok(Some(virt::Node::Element(virt::Element {
    tag_name: tag_name,
    attributes,
    children
  })))
}

fn evaluate_import_element<'a>(_element: &ast::Element, context: &'a Context) -> Result<Option<virt::Node>, &'static str> {

  // TODO - import into context
  Ok(None)
}

fn evaluate_style_element<'a>(_element: &ast::StyleElement, context: &'a Context) -> Result<Option<virt::Node>, &'static str> {
  Ok(None)
}
  

fn evaluate_children<'a>(children_expr: &Vec<Expression<ast::Node>>, context: &'a Context) -> Result<Vec<virt::Node>, &'static str> {
  
  let mut children: Vec<virt::Node> = vec![];

  for child_expr in children_expr {
    match evaluate_node(child_expr, context)? {
      Some(c) => { children.push(c); },
      None => { }
    }
  }

  Ok(children)
}

fn evaluate_fragment<'a>(fragment: &ast::Fragment, context: &'a Context) -> Result<Option<virt::Node>, &'static str> {
  Ok(Some(virt::Node::Fragment(virt::Fragment {
    children: evaluate_children(&fragment.children, context)?
  })))
}

fn evaluate_attribute_value<'a>(value: &ast::AttributeValue, context: &'a Context) -> Result<Option<String>, &'static str> {
  match value {
    ast::AttributeValue::String(st) => {
      Ok(Some(st.value.clone()))
    }
  }
}
