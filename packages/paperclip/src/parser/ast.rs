

#[derive(Debug)]
pub struct Element<'a> {
  pub tag_name: &'a str,
  pub attributes: Vec<Expression<'a>>,
  pub children: Vec<Expression<'a>>
}

#[derive(Debug)]
pub struct Text<'a> {
  pub value: &'a str,
}

#[derive(Debug)]
pub enum Grammar<'a> {
  Element(Element<'a>),
  Text(&'a str),
  Fragment,
}

#[derive(Debug)]
pub struct Location {
  start: usize,
  end: usize,
}

#[derive(Debug)]
pub struct Expression<'a> {
  // location: Location,
  item: Grammar<'a>
}