use std::fmt;
use serde::{Serialize};
use crate::css::base;

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct CSSSheet {
  pub rules: Vec<CSSRule>,
}

impl CSSSheet {
  pub fn extend(&mut self, other: CSSSheet) {
    self.rules.extend(other.rules);
  }
}

impl fmt::Display for CSSSheet {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    for rule in &self.rules {
      write!(f, "{}", rule.to_string())?;
    }
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize, Clone)]
#[serde(tag = "type")]
pub enum CSSRule {
  CSSStyleRule(CSSStyleRule),
  CSSCharset(String),
  FontFamily(FontFamilyRule),
  Media(base::ConditionRule<CSSStyleRule>),
  Supports(base::ConditionRule<CSSStyleRule>),
  Keyframes(KeyframesRule)
}

impl fmt::Display for CSSRule {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      CSSRule::CSSStyleRule(rule) => write!(f, "{}", rule.to_string()),
      CSSRule::CSSCharset(value) => write!(f, "@charset {};", value),
      CSSRule::FontFamily(rule) => write!(f, "{}", rule.to_string()),
    }
  }
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct FontFamilyRule {
  pub style: Vec<CSSStyleProperty>
}

impl fmt::Display for FontFamilyRule {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "@font-family {{")?;
    for property in &self.style {
      write!(f, "{}: {};", &property.name, &property.value)?;
    }
    write!(f, "}}")?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct CSSStyleRule {
  pub selector_text: String,
  pub style: Vec<CSSStyleProperty>
}

impl fmt::Display for CSSStyleRule {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, " {} {{", &self.selector_text)?;
    for property in &self.style {
      write!(f, "{}: {};", &property.name, &property.value)?;
    }
    write!(f, "}}")?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct CSSStyleProperty {
  pub name: String,
  pub value: String
}