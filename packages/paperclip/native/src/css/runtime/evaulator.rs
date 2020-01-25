use super::super::ast;
use crate::base::ast::{Expression};
use super::virt;

#[derive(Debug)]
pub struct Context<'a> {
  scope: &'a str
}

pub fn evaluate<'a>(expr: &Expression<ast::Sheet>, scope: &'a str) -> Result<virt::CSSSheet, &'static str> {
  let mut css_rules = vec![];
  let context = Context { scope };
  for rule in &expr.item.rules {
    css_rules.push(evaluate_rule(&rule, &context)?);
  }
  Ok(virt::CSSSheet {
    rules: css_rules
  })
}

fn evaluate_rule(expr: &Expression<ast::Rule>, context: &Context) -> Result<virt::CSSRule, &'static str> {
  evaluate_style_rule(expr, context)
}

fn evaluate_style_rule(expr: &Expression<ast::Rule>, context: &Context) -> Result<virt::CSSRule, &'static str> {
  let mut style = vec![];
  for property in &expr.item.declarations {
    style.push(evaluate_style(&property)?);
  }
  // let selectorText = format!("{}.{}")
  let selectorText = expr.item.selector.to_string();
  Ok(virt::CSSRule::CSSStyleRule(virt::CSSStyleRule {
    selectorText,
    style
  }))
}

fn evaluate_style<'a>(expr: &'a Expression<ast::Declaration>) -> Result<virt::CSSStyleProperty, &'static str> {
  Ok(virt::CSSStyleProperty {
    name: expr.item.name.to_string(),
    value: expr.item.value.to_string()
  })
}