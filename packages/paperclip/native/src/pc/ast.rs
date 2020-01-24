
use std::fmt;
use crate::css::ast as css_ast;
use crate::base::ast::{Expression};
use serde::{Serialize};


pub trait Executable<TRet> {
  fn execute(&self) -> Result<TRet, &'static str>;
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Element {
  pub tag_name: String,
  pub attributes: Vec<Expression<Attribute>>,
  pub children: Vec<Expression<Node>>
}

#[derive(Debug, PartialEq, Serialize)]
pub struct ValueObject {
  pub value: String,
}

#[derive(Debug, PartialEq, Serialize)]
#[serde(tag = "type")]
pub enum Node {
  Text(ValueObject),
  Comment(ValueObject),
  Element(Element),
  Fragment(Fragment),
  StyleElement(StyleElement),
  Slot(ValueObject),
}

impl fmt::Display for Node {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Node::Text(text) => write!(f, "{}", &text.value),
      Node::Slot(slot) => write!(f, "{{{{{}}}}}", &slot.value),
      Node::Comment(comment) => write!(f, "<!--{}-->", &comment.value),
      Node::Fragment(node) => write!(f, "{}", node.to_string()),
      Node::Element(element) => write!(f, "{}", element.to_string()),
      Node::StyleElement(element) => write!(f, "{}", element.to_string()),
    }
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Str {
  pub value: String
}

impl fmt::Display for Str {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "\"{}\"", self.value)
  }
}

pub fn fmt_attributes(attributes: &Vec<Expression<Attribute>>, f: &mut fmt::Formatter) -> fmt::Result {
  for attribute in attributes {
    write!(f, " {}", attribute.item.to_string())?;
  }
  Ok(())
}

pub fn fmt_start_tag<'a>(tag_name: &'a str, attributes: &Vec<Expression<Attribute>>, f: &mut fmt::Formatter) -> fmt::Result {
  write!(f, "<{}", tag_name)?;
  fmt_attributes(attributes, f)?;
  write!(f, ">")?;
  Ok(())
}

pub fn fmt_end_tag<'a>(tag_name: &'a str, f: &mut fmt::Formatter) -> fmt::Result {
  write!(f, "</{}>", tag_name)?;
  Ok(())
}

impl fmt::Display for Element {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    fmt_start_tag(&self.tag_name.as_str(), &self.attributes, f)?;
    for child in &self.children {
      write!(f, "{} ", child.item.to_string())?;
    }
    fmt_end_tag(&self.tag_name.as_str(), f)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Attribute {
  pub name: String,
  pub value: Option<Expression<AttributeValue>>,
}


impl fmt::Display for Attribute {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", self.name)?;
    if self.value == None {
      Ok(())
    } else {
      write!(f, "={}", self.value.as_ref().unwrap().item.to_string())
    }
  }
}

#[derive(Debug, PartialEq, Serialize)]
#[serde(tag = "type")]
pub enum AttributeValue {
  String(Str)
}

impl Executable<Option<String>> for AttributeValue {
  fn execute(&self) -> Result<Option<String>, &'static str> {
    match self {
      AttributeValue::String(st) => {
        Ok(Some(st.value.clone()))
      }
    }
  }
}

impl fmt::Display for AttributeValue {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match &self {
      AttributeValue::String(value) => { write!(f, "{}", value.to_string()) },
    }
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct StyleElement {
  pub attributes: Vec<Expression<Attribute>>,
  pub sheet: Expression<css_ast::Sheet>,
}

impl fmt::Display for StyleElement {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    fmt_start_tag("style", &self.attributes, f)?;
    write!(f, "{}", self.sheet.item.to_string())?;
    fmt_end_tag("style", f)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Fragment {
  pub children: Vec<Expression<Node>>
}

impl fmt::Display for Fragment {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "")?;
    for child in &self.children {
      write!(f, "{}", child.item.to_string())?;
    }

    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Location {
  start: usize,
  end: usize,
}

impl<'a, TItem: std::string::ToString> fmt::Display for Expression<TItem> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", self.item.to_string())
  }
}

pub fn get_imports<'a>(root_expr: &'a Expression<Node>) -> Vec<&'a Element> {
  let mut imports = vec![];

  let children = match &root_expr.item {
    Node::Element(root) => Some(&root.children),
    Node::Fragment(root) => Some(&root.children),
    _ => None
  };

  if children != None {
    for child in children.unwrap() {
      if let Node::Element(element) = &child.item {
        if element.tag_name == "import" && get_attribute_value("src", element) != None {
          imports.push(element);
        }
      }
    }
  }

  imports
}

pub fn get_attribute<'a, 'b>(name: &'b str, element: &'a Element) -> Option<&'a Attribute> {
  for attribute in &element.attributes {
    if attribute.item.name == name {
      return Some(&attribute.item);
    }
  }
  None
}

pub fn get_attribute_value<'a, 'b>(name: &'b str, element: &'a Element) -> Option<&'a String> {
  let attr = get_attribute(name, element);
  if let Some(att) = attr {
    if let Some(expr) = &att.value {
      let AttributeValue::String(st) = &expr.item;
      return Some(&st.value);
    }
  }
  None
}


pub fn get_import_ids<'a>(root_expr: &'a Expression<Node>) -> Vec<&'a String> {
  let mut ids = vec![];
  for import in get_imports(root_expr) {
    if let Some(id) = get_attribute_value("id", &import) {
      ids.push(id);
    }
  }
  ids
}

pub fn get_import<'a>(id1: &'a String, root_expr: &'a Expression<Node>) -> Option<&'a Element> {
  for import in get_imports(root_expr) {
    if let Some(id) = get_attribute_value("id", &import) {
      if id1 == id {
        return Some(&import);
      }
    }
  }
  None
}
