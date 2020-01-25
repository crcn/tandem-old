use super::super::ast;
use crate::base::ast::{Expression};
use super::virt;

pub fn evaluate(expr: &Expression<ast::Sheet>) -> Result<virt::CSSSheet, &'static str> {
  let mut css_rules = vec![];
  for rule in &expr.item.rules {
    css_rules.push(evaluate_rule(&rule)?);
  }
  Ok(virt::CSSSheet {
    rules: css_rules
  })
}

fn evaluate_rule(expr: &Expression<ast::Rule>) -> Result<virt::CSSRule, &'static str> {
  evaluate_style_rule(expr)
}

fn evaluate_style_rule(expr: &Expression<ast::Rule>) -> Result<virt::CSSRule, &'static str> {
  let mut style = vec![];
  for property in &expr.item.declarations {
    style.push(evaluate_style(&property)?);
  }
  Ok(virt::CSSRule::CSSStyleRule(virt::CSSStyleRule {
    selectorText: expr.item.condition.to_string(),
    style
  }))
}

fn evaluate_style<'a>(expr: &'a Expression<ast::Declaration>) -> Result<virt::CSSStyleProperty, &'static str> {
  Ok(virt::CSSStyleProperty {
    name: expr.item.name.to_string(),
    value: expr.item.value.to_string()
  })
}