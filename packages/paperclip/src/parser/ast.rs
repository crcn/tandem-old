
use std::fmt;
use crate::css_parser::ast as css_ast;
use crate::parser::virt;

pub trait Executable {
  fn execute();
}

#[derive(Debug, PartialEq)]
pub struct Element<'a> {
  pub tag_name: &'a str,
  pub attributes: Vec<Expression<'a>>,
  pub children: Vec<Expression<'a>>
}

impl<'a> Executable for Element<'a> {
  fn execute() {

  }
}

pub fn fmt_attributes<'a>(attributes: &Vec<Expression<'a>>, f: &mut fmt::Formatter) -> fmt::Result {
  for attribute in attributes {
    write!(f, " {}", attribute.to_string())?;
  }
  Ok(())
}

pub fn fmt_start_tag<'a>(tag_name: &'a str, attributes: &Vec<Expression<'a>>, f: &mut fmt::Formatter) -> fmt::Result {
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
      write!(f, "{} ", child.to_string())?;
    }
    fmt_end_tag(&self.tag_name, f);
    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub struct Attribute<'a> {
  pub name: &'a str,
  pub value: Option<Box<Expression<'a>>>,
}

impl<'a> fmt::Display for Attribute<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", self.name)?;
    if self.value == None {
      Ok(())
    } else {
      write!(f, "={}", self.value.as_ref().unwrap())
    }
  }
}

#[derive(Debug, PartialEq)]
pub struct StyleElement<'a> {
  pub attributes: Vec<Expression<'a>>,
  pub sheet: css_ast::Expression<'a>,
}

impl<'a> fmt::Display for StyleElement<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    fmt_start_tag("style", &self.attributes, f)?;
    write!(f, "{}", self.sheet.to_string())?;
    fmt_end_tag("style", f)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub struct Fragment<'a> {
  pub children: Vec<Expression<'a>>
}

impl<'a> fmt::Display for Fragment<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "")?;
    for child in &self.children {
      write!(f, "{}", child.to_string())?;
    }

    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub enum Grammar<'a> {
  Element(Element<'a>),
  StyleElement(StyleElement<'a>),
  Attribute(Attribute<'a>),
  Text(&'a str),
  String(&'a str),
  Fragment(Fragment<'a>),
  Slot(&'a str),
}

#[derive(Debug, PartialEq)]
pub struct Location {
  start: usize,
  end: usize,
}

#[derive(Debug, PartialEq)]
pub struct Expression<'a> {
  // location: Location,
  pub item: Grammar<'a>
}

impl<'a> fmt::Display for Expression<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match &self.item {
      Grammar::Element(node) => write!(f, "{}", node.to_string()),
      Grammar::StyleElement(node) => write!(f, "{}", node.to_string()),
      Grammar::Fragment(node) => write!(f, "{}", node.to_string()),
      Grammar::Attribute(attr) => write!(f, "{}", attr.to_string()),
      Grammar::Text(value) => write!(f, "{}", value),
      Grammar::Slot(value) => write!(f, "{{{{{}}}}}", value),
      Grammar::String(value) => write!(f, "'{}'", value),
    }
  }
}