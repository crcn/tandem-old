

#[derive(Debug, PartialEq)]
pub struct Element<'a> {
  pub tag_name: &'a str,
  pub attributes: Vec<Expression<'a>>,
  pub children: Vec<Expression<'a>>
}

#[derive(Debug, PartialEq)]
pub struct Attribute<'a> {
  pub name: &'a str,
  pub value: Option<Box<Expression<'a>>>,
}

#[derive(Debug, PartialEq)]
pub struct Fragment<'a> {
  pub children: Vec<Expression<'a>>
}

#[derive(Debug, PartialEq)]
pub enum Grammar<'a> {
  Element(Element<'a>),
  Attribute(Attribute<'a>),
  Text(&'a str),
  String(&'a str),
  Fragment(Fragment<'a>),
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