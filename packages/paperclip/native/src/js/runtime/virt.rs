use std::fmt;
use std::collections::HashMap;
use serde::{Serialize};
use crate::pc::runtime::virt::{Node};

#[derive(Debug, PartialEq, Serialize, Clone)]
pub enum JsValue {
  JsObject(JsObject),
  JsArray(JsArray),
  JsNode(Node),
  JsString(String),
  JsBoolean(bool),
  JsNumber(f64),
  JsUndefined()
}

impl fmt::Display for JsValue {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      JsValue::JsObject(object) => write!(f, "[Object object]"),
      JsValue::JsString(value) => write!(f, "{}", value),
      JsValue::JsBoolean(value) => write!(f, "{}", if *value { "true" } else { "false" }),
      JsValue::JsNode(value) => write!(f, "[Object object]"),
      JsValue::JsNumber(value) => write!(f, "{}", value),
      JsValue::JsArray(value) => write!(f, "[Object object]"),
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

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct JsArray {
  pub values: Vec<JsValue>
}

impl JsArray {
  pub fn new() -> JsArray {
    JsArray {
      values: vec![]
    }
  }
}


// impl fmt::Display for JsObject {
//   fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
//     write!(f, "{{");
//     for (key, value) in &self.values {
//       write!(f, "{}: {},", key.to_string(), value.to_string());
//     }
//     write!(f, "}}");
//     Ok(())
//   }
// }

