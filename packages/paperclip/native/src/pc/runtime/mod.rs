pub mod evaluator;
pub mod virt;
pub mod graph;
pub mod vfs;
use super::ast as pc_ast;
use graph::{DependencyGraph};
use crate::base::ast::{Expression};

pub fn evaluate<'a>(expr: &Expression<pc_ast::Node>, file_path: &'a String, graph: &'a DependencyGraph) -> Result<Option<virt::Node>, &'static str> {
  evaluator::evaluate(expr, file_path, graph)
}