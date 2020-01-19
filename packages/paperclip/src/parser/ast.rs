use std::fmt;

#[derive(Debug, PartialEq)]
pub struct Element<'a> {
  pub tag_name: &'a str,
  pub attributes: Vec<Expression<'a>>,
  pub children: Vec<Expression<'a>>
}

impl<'a> fmt::Display for Element<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    let mut curr = write!(f, "<{}", self.tag_name);
    for attribute in &self.attributes {
      curr = write!(f, " {}", attribute.to_string());
    }

    curr = write!(f, ">");

    for child in &self.children {
      curr = write!(f, "{} ", child.to_string());
    }

    curr = write!(f, "</{}>", self.tag_name);

    curr
  }
}

#[derive(Debug, PartialEq)]
pub struct Attribute<'a> {
  pub name: &'a str,
  pub value: Option<Box<Expression<'a>>>,
}


impl<'a> fmt::Display for Attribute<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    let mut curr = write!(f, "{}", self.name);
    if self.value == None {
      return curr;
    } else {
      return write!(f, "={}", self.value.as_ref().unwrap());
    }
  }
}

#[derive(Debug, PartialEq)]
pub struct Fragment<'a> {
  pub children: Vec<Expression<'a>>
}

impl<'a> fmt::Display for Fragment<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    let mut curr = write!(f, "");
    for child in &self.children {
      curr = write!(f, "{}", child.to_string())
    }

    curr
  }
}

#[derive(Debug, PartialEq)]
pub enum Grammar<'a> {
  Element(Element<'a>),
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
      Grammar::Fragment(node) => write!(f, "{}", node.to_string()),
      Grammar::Attribute(attr) => write!(f, "{}", attr.to_string()),
      Grammar::Text(value) => write!(f, "{}", value),
      Grammar::Slot(value) => write!(f, "{{{{{}}}}}", value),
      Grammar::String(value) => write!(f, "'{}'", value),
    }
  }
}