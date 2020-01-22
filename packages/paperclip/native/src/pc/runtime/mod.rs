pub mod evaluator;
pub mod virt;
use super::ast as pc_ast;
use crate::base::ast::{Expression};

pub fn evaluate<'a>(expr: &Expression<pc_ast::Node<'a>>) -> Result<Option<virt::Node<'a>>, &'static str> {
  evaluator::evaluate(expr)
}