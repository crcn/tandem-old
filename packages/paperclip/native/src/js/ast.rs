use std::fmt;
use crate::base::ast::{Expression};
use serde::{Serialize};

#[derive(Debug, PartialEq, Serialize)]
pub enum Statement {
  Reference(Reference)
}

impl fmt::Display for Statement {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Statement::Reference(reference) => write!(f, "{}", reference.to_string())
    }
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Reference {
  pub path: Vec<String>
}

impl fmt::Display for Reference {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", self.path.join(".Statement"))
  }
}