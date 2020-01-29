use super::super::ast;
use super::virt;

#[derive(Debug)]
pub struct Context<'a> {
  scope: &'a str
}

pub fn evaluate<'a>(expr: &ast::Sheet, scope: &'a str) -> Result<virt::CSSSheet, &'static str> {
  let mut css_rules = vec![];
  let context = Context { scope };
  for rule in &expr.rules {
    css_rules.push(evaluate_rule(&rule, &context)?);
  }
  Ok(virt::CSSSheet {
    rules: css_rules
  })
}

fn evaluate_rule(expr: &ast::Rule, context: &Context) -> Result<virt::CSSRule, &'static str> {
  evaluate_style_rule(expr, context)
}

fn evaluate_style_rule(expr: &ast::Rule, context: &Context) -> Result<virt::CSSRule, &'static str> {
  let mut style = vec![];
  for property in &expr.declarations {
    style.push(evaluate_style(&property)?);
  }
  let selector_text = stringify_element_selector(&expr.selector, context)?;
  println!("{:?}", &selector_text);
  Ok(virt::CSSRule::CSSStyleRule(virt::CSSStyleRule {
    selector_text,
    style
  }))
}

fn stringify_element_selector(selector: &ast::Selector, context: &Context) -> Result<String, &'static str> {
  let scoped_selector_text = match selector {
    ast::Selector::AllSelector => format!(".{}", context.scope),
    ast::Selector::Class(selector) => format!(".{}.{}", selector.class_name, context.scope),
    ast::Selector::Element(selector) => format!("{}.{}", selector.tag_name, context.scope)
  };
  
  Ok(scoped_selector_text.to_string())
}

fn evaluate_style<'a>(expr: &'a ast::Declaration) -> Result<virt::CSSStyleProperty, &'static str> {
  Ok(virt::CSSStyleProperty {
    name: expr.name.to_string(),
    value: expr.value.to_string()
  })
}