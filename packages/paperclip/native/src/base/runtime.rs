use super::ast;
use serde::{Serialize};

#[derive(Debug, Clone, Serialize, PartialEq)]
pub struct RuntimeError {
  #[serde(rename = "filePath")]
  pub file_path: String,
  pub location: ast::Location,
  pub message: String
}