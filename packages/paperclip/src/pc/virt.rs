use std::fmt;

#[derive(Debug, PartialEq)]
pub struct Fragment<'a> {
  pub children: Vec<Node<'a>>
}

impl<'a> fmt::Display for Fragment<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    for child in &self.children {
      write!(f, " {}", &child.to_string());
    }
    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub struct Element<'a> {
  pub tag_name: &'a str,
  pub attributes: Vec<Attribute<'a>>,
  pub children: Vec<Node<'a>>
}

impl<'a> fmt::Display for Element<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "<{}", self.tag_name);
    for attribute in &self.attributes {
      if attribute.value == None {
        write!(f, " {}", &attribute.name);
      } else {
        write!(f, " {}=\"{}\"", attribute.name, attribute.value.unwrap());
      }
    }
    write!(f, ">");

    for child in &self.children {
      write!(f, " {}", &child.to_string());
    }

    write!(f, "</{}>", &self.tag_name);

    Ok(())
  }
}


#[derive(Debug, PartialEq)]
pub struct Attribute<'a> {
  pub name: &'a str,
  pub value: Option<&'a str>
}

#[derive(Debug, PartialEq)]
pub struct Text<'a> {
  pub value: &'a str
}

#[derive(Debug, PartialEq)]
pub enum Node<'a> {
  Element(Element<'a>),
  Text(Text<'a>),
  Fragment(Fragment<'a>)
}

impl<'a> fmt::Display for Node<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Node::Element(el) => { write!(f, "{}", el.to_string())},
      Node::Fragment(fragment) => { write!(f, "{}", fragment.to_string())},
      Node::Text(text) => { write!(f, "{}", text.value.to_string())}
    }
  }
}