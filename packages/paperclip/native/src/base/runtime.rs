use super::ast;
use serde::{Serialize};

#[derive(Debug, Clone, Serialize, PartialEq)]
pub struct RuntimeError {
  #[serde(rename = "filePath")]
  pub file_path: String,
  pub location: ast::Location,
  pub message: String
}

impl RuntimeError {
  pub fn new(message: &String, file_path: &String, location: &ast::Location) -> RuntimeError {
    RuntimeError {
      message: message.to_string(),
      file_path: file_path.to_string(),
      location: location.clone()
    }
  }
  pub fn unknown(file_path: &String) -> RuntimeError {
    RuntimeError::new(&"An unknown error has occurred.".to_string(), file_path, &ast::Location {
      start: 0,
      end: 1
    })
  }
}