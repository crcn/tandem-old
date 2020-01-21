
use std::fmt;
use crate::css::ast as css_ast;
use crate::base::ast::{Expression};

pub trait Executable<TRet> {
  fn execute(&self) -> Result<TRet, &'static str>;
}

#[derive(Debug, PartialEq)]
pub struct Element<'a> {
  pub tag_name: &'a str,
  pub attributes: Vec<Expression<Attribute<'a>>>,
  pub children: Vec<Expression<Node<'a>>>
}

#[derive(Debug, PartialEq)]
pub enum Node<'a> {
  Text(&'a str),
  Comment(&'a str),
  Element(Element<'a>),
  Fragment(Fragment<'a>),
  StyleElement(StyleElement<'a>),
  Slot(&'a str),
}

impl<'a> fmt::Display for Node<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Node::Text(value) => write!(f, "{}", value),
      Node::Slot(value) => write!(f, "{{{{{}}}}}", value),
      Node::Comment(value) => write!(f, "<!--{}-->", value),
      Node::Fragment(node) => write!(f, "{}", node.to_string()),
      Node::Element(element) => write!(f, "{}", element.to_string()),
      Node::StyleElement(element) => write!(f, "{}", element.to_string()),
    }
  }
}

#[derive(Debug, PartialEq)]
pub struct Str<'a> {
  pub value: &'a str
}

impl<'a> fmt::Display for Str<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "\"{}\"", self.value)
  }
}

pub fn fmt_attributes<'a>(attributes: &Vec<Expression<Attribute<'a>>>, f: &mut fmt::Formatter) -> fmt::Result {
  for attribute in attributes {
    write!(f, " {}", attribute.item.to_string())?;
  }
  Ok(())
}

pub fn fmt_start_tag<'a>(tag_name: &'a str, attributes: &Vec<Expression<Attribute<'a>>>, f: &mut fmt::Formatter) -> fmt::Result {
  write!(f, "<{}", tag_name)?;
  fmt_attributes(attributes, f)?;
  write!(f, ">")?;
  Ok(())
}

pub fn fmt_end_tag<'a>(tag_name: &'a str, f: &mut fmt::Formatter) -> fmt::Result {
  write!(f, "</{}>", tag_name)?;
  Ok(())
}

impl<'a> fmt::Display for Element<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    fmt_start_tag(&self.tag_name, &self.attributes, f);
    for child in &self.children {
      write!(f, "{} ", child.item.to_string())?;
    }
    fmt_end_tag(&self.tag_name, f)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub struct Attribute<'a> {
  pub name: &'a str,
  pub value: Option<Expression<AttributeValue<'a>>>,
}


impl<'a> fmt::Display for Attribute<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", self.name)?;
    if self.value == None {
      Ok(())
    } else {
      write!(f, "={}", self.value.as_ref().unwrap().item.to_string())
    }
  }
}

#[derive(Debug, PartialEq)]
pub enum AttributeValue<'a> {
  String(Str<'a>)
}

impl<'a> Executable<Option<&'a str>> for AttributeValue<'a> {
  fn execute(&self) -> Result<Option<&'a str>, &'static str> {
    match self {
      AttributeValue::String(st) => {
        Ok(Some(st.value))
      }
    }
  }
}

impl<'a> fmt::Display for AttributeValue<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match &self {
      AttributeValue::String(value) => { write!(f, "{}", value.to_string()) },
    }
  }
}

#[derive(Debug, PartialEq)]
pub struct StyleElement<'a> {
  pub attributes: Vec<Expression<Attribute<'a>>>,
  pub sheet: Expression<css_ast::Sheet<'a>>,
}

impl<'a> fmt::Display for StyleElement<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    fmt_start_tag("style", &self.attributes, f)?;
    write!(f, "{}", self.sheet.item.to_string())?;
    fmt_end_tag("style", f)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub struct Fragment<'a> {
  pub children: Vec<Expression<Node<'a>>>
}

impl<'a> fmt::Display for Fragment<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "")?;
    for child in &self.children {
      write!(f, "{}", child.item.to_string())?;
    }

    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub struct Location {
  start: usize,
  end: usize,
}

impl<'a, TItem: std::string::ToString> fmt::Display for Expression<TItem> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", self.item.to_string())
  }
}
