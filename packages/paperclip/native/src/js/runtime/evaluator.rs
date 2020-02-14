
use super::super::ast;
use super::virt;
use crate::base::runtime::{RuntimeError};
use crate::base::ast::{Location};


pub struct Context<'a> {
  file_path: &'a String,
  data: &'a virt::JsValue
}

pub fn evaluate<'a>(expr: &ast::Statement, file_path: &'a String, data: &'a virt::JsValue) -> Result<virt::JsValue, RuntimeError> {
  let context = Context { data, file_path };
  evaluate_statement(&expr, &context)
}
fn evaluate_statement<'a>(statement: &ast::Statement, context: &'a Context) -> Result<virt::JsValue, RuntimeError> {
  match statement {
    ast::Statement::Reference(reference) => evaluate_reference(reference, context)
  }
}

fn evaluate_reference<'a>(reference: &ast::Reference, context: &'a Context) -> Result<virt::JsValue, RuntimeError> {
  
  let mut curr = Some(context.data);

  for property_name in &reference.path {
    if let Some(object) = &curr {
      curr = virt::get_js_value_property(&object, property_name);
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

