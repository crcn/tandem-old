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
  let selector_text = stringify_element_selector(&expr.selector, context);
  Ok(virt::CSSRule::CSSStyleRule(virt::CSSStyleRule {
    selector_text,
    style
  }))
}

fn stringify_element_selector(selector: &ast::Selector, context: &Context) -> String {

  let scope_selector = format!("[data-pc-{}]", context.scope);

  let scoped_selector_text = match selector {
    ast::Selector::AllSelector => format!("{}", scope_selector),
    ast::Selector::Class(selector) => format!(".{}{}", selector.class_name, scope_selector),
    ast::Selector::Id(selector) => format!("#{}{}", selector.id, scope_selector),
    ast::Selector::Element(selector) => format!("{}{}", selector.tag_name, scope_selector),
    ast::Selector::PseudoElement(selector) => format!("{}:{}", scope_selector, selector.name),
    ast::Selector::PseudoParamElement(selector) => format!("{}:{}({})", scope_selector, selector.name, selector.param),
    ast::Selector::Attribute(selector) => format!("{}{}", selector.to_string(), scope_selector),
    ast::Selector::Not(selector) => format!("{}:not({})", scope_selector, stringify_element_selector(selector, context)),
    ast::Selector::Descendent(selector) => format!("{} {}", stringify_element_selector(&selector.parent, context), stringify_element_selector(&selector.descendent, context)),
    ast::Selector::Child(selector) => format!("{} > {}", stringify_element_selector(&selector.parent, context), stringify_element_selector(&selector.child, context)),
    ast::Selector::Adjacent(selector) => format!("{} + {}", stringify_element_selector(&selector.selector, context), stringify_element_selector(&selector.next_sibling_selector, context)),
    ast::Selector::Sibling(selector) => format!("{} ~ {}", stringify_element_selector(&selector.selector, context), stringify_element_selector(&selector.sibling_selector, context)),
    ast::Selector::Group(selector) => {
      let text: Vec<String> = (&selector.selectors).into_iter().map(|child| {
        stringify_element_selector(child, context)
      }).collect();
      text.join(", ")
    },
    ast::Selector::Combo(selector) => {
      let text: Vec<String> = (&selector.selectors).into_iter().map(|child| {
        child.to_string()
      }).collect();
      format!("{}{}", text.join(""), scope_selector)
    }
  };
  
  scoped_selector_text.to_string()
}

fn evaluate_style<'a>(expr: &'a ast::Declaration) -> Result<virt::CSSStyleProperty, &'static str> {
  Ok(virt::CSSStyleProperty {
    name: expr.name.to_string(),
    value: expr.value.to_string()
  })
}