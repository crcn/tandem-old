use crate::base::ast::{Expression};
use super::super::ast;
use super::virt;

pub struct Context<'a> {
  data: &'a virt::JsObject
}

pub fn evaluate<'a>(expr: &Expression<ast::Statement>, data: &'a virt::JsObject) -> Result<virt::JsValue, &'static str> {
  let context = Context { data };
  evaluate_statement(&expr.item, &context)
}
fn evaluate_statement<'a>(statement: &ast::Statement, context: &'a Context) -> Result<virt::JsValue, &'static str> {
  match statement {
    ast::Statement::Reference(reference) => evaluate_reference(reference, context)
  }
}


fn evaluate_reference<'a>(reference: &ast::Reference, context: &'a Context) -> Result<virt::JsValue, &'static str> {
  let result = context.data.values.get(&reference.name);
  if result == None {
    Ok(virt::JsValue::JsUndefined())
  } else {
    Ok(result.unwrap().clone())
  }
}

