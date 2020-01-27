
use std::fmt;
use crate::css::ast as css_ast;
use crate::js::ast as js_ast;
use serde::{Serialize};

#[derive(Debug, PartialEq, Serialize)]
pub struct Element {
  pub tag_name: String,
  pub attributes: Vec<Attribute>,
  pub children: Vec<Node>
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
  Slot(js_ast::Statement),
  Block(Block)
}

impl fmt::Display for Node {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Node::Text(text) => write!(f, "{}", &text.value),
      Node::Slot(slot) => write!(f, "{{{{{}}}}}", &slot.to_string()),
      Node::Comment(comment) => write!(f, "<!--{}-->", &comment.value),
      Node::Fragment(node) => write!(f, "{}", node.to_string()),
      Node::Element(element) => write!(f, "{}", element.to_string()),
      Node::Block(block) => write!(f, "[block]"),
      Node::StyleElement(element) => write!(f, "{}", element.to_string()),
    }
  }
}

impl Node {
  pub fn traverse<FF>(&self, each: &FF) -> bool where FF: Fn(&Node) -> bool {
    if !each(self) {
      return false;
    }
    let children_option = match self {
      Node::Element(element) => {
        Some(&element.children)
      },
      Node::Fragment(fragment) => {
        Some(&fragment.children)
      },
      _ => {
        None
      }
    };

    if let Some(children) = children_option {
      for child in children {
        if !child.traverse(each) {
          return false;
        }
      }
    }
    return true;
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub enum Block {
  Conditional(ConditionalBlock)
  // Repeat(RepeatBlock)
}

#[derive(Debug, PartialEq, Serialize)]
pub enum ConditionalBlock {
  PassFailBlock(PassFailBlock),
  FinalBlock(FinalBlock)
}


#[derive(Debug, PartialEq, Serialize)]
pub struct PassFailBlock {
  pub condition: js_ast::Statement,
  pub node: Option<Box<Node>>,
  pub fail: Option<Box<ConditionalBlock>>
}

#[derive(Debug, PartialEq, Serialize)]
pub struct FinalBlock {
  pub node: Option<Box<Node>>,
}

#[derive(Debug, PartialEq, Serialize)]
pub struct RepeatBlock {
  pub each_as: js_ast::Statement,
  pub source: js_ast::Statement
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

pub fn fmt_attributes(attributes: &Vec<Attribute>, f: &mut fmt::Formatter) -> fmt::Result {
  for attribute in attributes {
    write!(f, " {}", attribute.to_string())?;
  }
  Ok(())
}

pub fn fmt_start_tag<'a>(tag_name: &'a str, attributes: &Vec<Attribute>, f: &mut fmt::Formatter) -> fmt::Result {
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
      write!(f, "{} ", child.to_string())?;
    }
    fmt_end_tag(&self.tag_name.as_str(), f)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Attribute {
  pub name: String,
  pub value: Option<AttributeValue>,
}


impl fmt::Display for Attribute {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", self.name)?;
    if self.value == None {
      Ok(())
    } else {
      write!(f, "={}", self.value.as_ref().unwrap().to_string())
    }
  }
}

#[derive(Debug, PartialEq, Serialize)]
#[serde(tag = "type")]
pub enum AttributeValue {
  String(Str),
  Slot(js_ast::Statement)
}

impl fmt::Display for AttributeValue {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match &self {
      AttributeValue::String(value) => { write!(f, "{}", value.to_string()) },
      AttributeValue::Slot(script) => { write!(f, "{{{}}}", script.to_string()) },
    }
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct StyleElement {
  pub attributes: Vec<Attribute>,
  pub sheet: css_ast::Sheet,
}

impl fmt::Display for StyleElement {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    fmt_start_tag("style", &self.attributes, f)?;
    write!(f, "{}", self.sheet.to_string())?;
    fmt_end_tag("style", f)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Fragment {
  pub children: Vec<Node>
}

impl fmt::Display for Fragment {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "")?;
    for child in &self.children {
      write!(f, "{}", child.to_string())?;
    }

    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Location {
  start: usize,
  end: usize,
}

pub fn get_children<'a>(expr: &'a Node) -> Option<&'a Vec<Node>> {
  match &expr {
    Node::Element(root) => Some(&root.children),
    Node::Fragment(root) => Some(&root.children),
    _ => None
  }
}

pub fn get_imports<'a>(root_expr: &'a Node) -> Vec<&'a Element> {
  let mut imports = vec![];

  let children = get_children(root_expr);

  if children != None {
    for child in children.unwrap() {
      if let Node::Element(element) = &child {
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
    if attribute.name == name {
      return Some(&attribute);
    }
  }
  None
}

pub fn get_attribute_value<'a, 'b>(name: &'b str, element: &'a Element) -> Option<&'a String> {
  let attr = get_attribute(name, element);
  if let Some(att) = attr {
    if let Some(expr) = &att.value {
      if let AttributeValue::String(st) = &expr {
        return Some(&st.value);
      }
    }
  }
  None
}


pub fn get_import_ids<'a>(root_expr: &'a Node) -> Vec<&'a String> {
  let mut ids = vec![];
  for import in get_imports(root_expr) {
    if let Some(id) = get_attribute_value("id", &import) {
      ids.push(id);
    }
  }
  ids
}

pub fn get_import<'a>(id1: &'a String, root_expr: &'a Node) -> Option<&'a Element> {
  for import in get_imports(root_expr) {
    if let Some(id) = get_attribute_value("id", &import) {
      if id1 == id {
        return Some(&import);
      }
    }
  }
  None
}
