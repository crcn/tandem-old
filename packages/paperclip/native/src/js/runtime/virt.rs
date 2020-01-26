use std::fmt;
use std::collections::HashMap;
use serde::{Serialize};

#[derive(Debug, PartialEq, Serialize, Clone)]
pub enum JsValue {
  JsObject(JsObject),
  JsString(String),
  JsBoolean(bool),
  JsNumber(f64),
  JsUndefined()
}


impl fmt::Display for JsValue {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      JsValue::JsObject(object) => write!(f, "{}", object),
      JsValue::JsString(value) => write!(f, "{}", value),
      JsValue::JsBoolean(value) => write!(f, "{}", if *value { "true" } else { "false" }),
      JsValue::JsNumber(value) => write!(f, "{}", value),
      JsValue::JsUndefined() => write!(f, "undefined")
    };
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct JsObject {
  pub values: HashMap<String, JsValue>,
}

impl JsObject {
  pub fn new() -> JsObject {
    JsObject {
      values: HashMap::new()
    }
  }
}


impl fmt::Display for JsObject {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{{");
    for (key, value) in &self.values {
      write!(f, "{}: {},", key.to_string(), value.to_string());
    }
    write!(f, "}}");
    Ok(())
  }
}

