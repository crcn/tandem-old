use std::fmt;
use serde::{Serialize};
use crate::pc::ast as pc_ast;

#[derive(Debug, PartialEq, Serialize, Clone)]
#[serde(tag = "jsKind")]
pub enum Statement {
  Reference(Reference),
  Node(Box<pc_ast::Node>)
}

impl fmt::Display for Statement {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Statement::Reference(reference) => write!(f, "{}", reference.to_string()),
      Statement::Node(node) => write!(f, "{}", node.to_string())
    }
  }
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct Reference {
  pub path: Vec<String>
}

impl fmt::Display for Reference {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", self.path.join(".Statement"))
  }
}