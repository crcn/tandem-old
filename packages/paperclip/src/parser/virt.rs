
pub struct Element<'a> {
  tag_name: &'a str,
  attributes: Vec<Attribute<'a>>,
  children: Vec<Node<'a>>
}

pub struct Attribute<'a> {
  name: &'a str,
  value: &'a str
}

pub struct Text<'a> {
  value: &'a str
}

pub enum Node<'a> {
  Element(Element<'a>),
  Text(Text<'a>)
}