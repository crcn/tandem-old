use crate::base::ast::{Expression};
use super::super::ast;
use super::virt;

pub struct Context<'a> {
  data: &'a virt::JsValue
}

pub fn evaluate<'a>(expr: &Expression<ast::Statement>, data: &'a virt::JsValue) -> Result<virt::JsValue, &'static str> {
  let context = Context { data };
  evaluate_statement(&expr.item, &context)
}
fn evaluate_statement<'a>(statement: &ast::Statement, context: &'a Context) -> Result<virt::JsValue, &'static str> {
  match statement {
    ast::Statement::Reference(reference) => evaluate_reference(reference, context)
  }
}


fn evaluate_reference<'a>(reference: &ast::Reference, context: &'a Context) -> Result<virt::JsValue, &'static str> {
  
  let mut curr = Some(context.data);

  for property_name in &reference.path {
    if let Some(object) = &curr {
      curr = virt::get_js_value_property(&object, property_name);
    } else {
      return Err("Cannot access property of undefined");
    }
  }

  if let Some(js_value) = curr {
    Ok(js_value.clone())
  } else {
    Ok(virt::JsValue::JsUndefined())
  }
}

