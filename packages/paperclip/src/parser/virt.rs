
pub struct Element<'a> {
  pub tag_name: &'a str,
  pub attributes: Vec<Attribute<'a>>,
  pub children: Vec<Node<'a>>
}

pub struct Attribute<'a> {
  pub name: &'a str,
  pub value: Option<&'a str>
}

pub struct Text<'a> {
  pub value: &'a str
}

pub enum Node<'a> {
  Element(Element<'a>),
  Text(Text<'a>)
}