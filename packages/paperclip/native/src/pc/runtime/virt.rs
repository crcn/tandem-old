use std::fmt;
use serde::{Serialize};
// use base::ast::{Location};

// TODO - include source expression path

// pub struct Source {
//   file_name: &'a str,
//   location: Location
// }

#[derive(Debug, PartialEq, Serialize)]
pub struct Fragment {
  pub children: Vec<Node>
}

impl fmt::Display for Fragment {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    for child in &self.children {
      write!(f, " {}", &child.to_string())?;
    }
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Element {
  pub tag_name: String,
  pub attributes: Vec<Attribute>,
  pub children: Vec<Node>
}

impl fmt::Display for Element {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "<{}", self.tag_name)?;
    for attribute in &self.attributes {
      if attribute.value == None {
        write!(f, " {}", &attribute.name)?;
      } else {
        write!(f, " {}=\"{}\"", attribute.name, attribute.value.as_ref().unwrap())?;
      }
    }
    write!(f, ">")?;

    for child in &self.children {
      write!(f, " {}", &child.to_string())?;
    }

    write!(f, "</{}>", &self.tag_name)?;

    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Attribute {
  pub name: String,
  pub value: Option<String>
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Text {
  pub value: String
}

#[derive(Debug, PartialEq, Serialize)]
#[serde(tag = "type")]
pub enum Node {
  Element(Element),
  Text(Text),
  Fragment(Fragment)
}

impl fmt::Display for Node {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Node::Element(el) => { write!(f, "{}", el.to_string())},
      Node::Fragment(fragment) => { write!(f, "{}", fragment.to_string())},
      Node::Text(text) => { write!(f, "{}", text.value.to_string())}
    }
  }
}

