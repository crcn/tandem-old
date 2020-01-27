pub mod evaluator;
pub mod virt;
pub mod graph;
pub mod vfs;
use super::ast as pc_ast;
use graph::{DependencyGraph};
use crate::base::ast::{Expression};
use crate::js::runtime::virt as js_virt;

pub fn evaluate<'a>(expr: &Expression<pc_ast::Node>, file_path: &'a String, graph: &'a DependencyGraph, data: &js_virt::JsValue) -> Result<Option<virt::Node>, &'static str> {
  evaluator::evaluate(expr, file_path, graph, data)
}