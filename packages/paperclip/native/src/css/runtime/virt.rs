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
  CSSNamespace(String),
  FontFamily(FontFamilyRule),
  Media(ConditionRule),
  Supports(ConditionRule),
  Page(ConditionRule),
  Document(ConditionRule),
  Keyframes(KeyframesRule),
}

impl fmt::Display for CSSRule {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      CSSRule::CSSStyleRule(rule) => write!(f, "{}", rule.to_string()),
      CSSRule::CSSCharset(value) => write!(f, "@charset {};", value),
      CSSRule::CSSNamespace(value) => write!(f, "@namespace {};", value),
      CSSRule::FontFamily(rule) => write!(f, "{}", rule.to_string()),
      CSSRule::Media(rule) => write!(f, "{}", rule.to_string()),
      CSSRule::Document(rule) => write!(f, "{}", rule.to_string()),
      CSSRule::Page(rule) => write!(f, "{}", rule.to_string()),
      CSSRule::Supports(rule) => write!(f, "{}", rule.to_string()),
      CSSRule::Keyframes(rule) => write!(f, "{}", rule.to_string()),
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
pub struct ConditionRule {
  pub name: String,
  pub condition_text: String,
  pub rules: Vec<CSSStyleRule>
}

impl fmt::Display for ConditionRule {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    writeln!(f, "@{} {} {{", &self.name, &self.condition_text)?;
    for rule in &self.rules {
      write!(f, "{}\n", &rule.to_string())?;
    }
    writeln!(f, "}}")?;

    Ok(())
  }
}


#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct KeyframesRule {
  pub name: String,
  pub rules: Vec<KeyframeRule>
}

impl fmt::Display for KeyframesRule {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    writeln!(f, "@keyframes {} {{", &self.name)?;
    for rule in &self.rules {
      write!(f, "{}\n", &rule.to_string())?;
    }
    writeln!(f, "}}")?;

    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct KeyframeRule {
  pub key: String,
  pub style: Vec<CSSStyleProperty>
}

impl fmt::Display for KeyframeRule {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    writeln!(f, "{} {{", &self.key)?;
    for property in &self.style {
      write!(f, "{}: {};", &property.name, &property.value)?;
    }
    writeln!(f, "}}")?;

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