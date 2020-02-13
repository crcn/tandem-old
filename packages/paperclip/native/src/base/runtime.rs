use super::ast;
use serde::{Serialize};

#[derive(Debug, Clone, Serialize, PartialEq)]
pub struct RuntimeError {
  pub location: ast::Location,
  pub message: String
}