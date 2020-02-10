use crate::base::parser;
use serde::{Serialize};


#[derive(Debug, PartialEq, Serialize, Copy, Clone)]
#[serde(tag = "type")]
pub enum RuntimeError {

  // <import />, <img />, <logic />
  IncludeNotFound(IncludeNodeFoundError),

  Syntax(parser::ParseError)
}

pub struct IncludeNodeFoundError {
  file_path: String,
  pub start: usize,
  pub end: usize
}