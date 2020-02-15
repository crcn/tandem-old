
use super::super::ast;
use super::virt;
use crate::base::runtime::{RuntimeError};
use crate::base::ast::{Location};
use crate::pc::runtime::evaluator::evaluate as evaluate_pc;
use crate::pc::runtime::graph::{DependencyGraph};
use crate::pc::ast as pc_ast;

pub struct Context<'a> {
  file_path: &'a String,
  graph: &'a DependencyGraph,
  data: &'a virt::JsValue
}

pub fn evaluate<'a>(expr: &ast::Statement, file_path: &'a String, graph: &'a DependencyGraph, data: &'a virt::JsValue) -> Result<virt::JsValue, RuntimeError> {
  let context = Context { data, graph, file_path };
  evaluate_statement(&expr, &context)
}
fn evaluate_statement<'a>(statement: &ast::Statement, context: &'a Context) -> Result<virt::JsValue, RuntimeError> {
  match statement {
    ast::Statement::Reference(reference) => evaluate_reference(reference, context),
    ast::Statement::Node(node) => evaluate_node(node, context)
  }
}

fn evaluate_node<'a>(node: &Box<pc_ast::Node>, context: &'a Context) -> Result<virt::JsValue, RuntimeError> {
  let node_option = evaluate_pc(node, context.file_path, &context.graph, &context.data, None)?;
  if let Some(node) = node_option {
    Ok(virt::JsValue::JsNode(node))
  } else {
    Ok(virt::JsValue::JsUndefined())
  }
}

fn evaluate_reference<'a>(reference: &ast::Reference, context: &'a Context) -> Result<virt::JsValue, RuntimeError> {
  
  let mut curr = Some(context.data);

  for property_name in &reference.path {
    if let Some(object) = &curr {
      curr = if property_name == "ctx" {
        Some(object)
      } else {
        virt::get_js_value_property(&object, property_name)
      };
    } else {
      return Err(RuntimeError {
        file_path: context.file_path.to_string(),
        message: "Cannot access property of undefined".to_string(), 
        location: Location {
          start: 0,
          end: 1
        }
      });
    }
  }

  if let Some(js_value) = curr {
    Ok(js_value.clone())
  } else {
    Ok(virt::JsValue::JsUndefined())
  }
}

