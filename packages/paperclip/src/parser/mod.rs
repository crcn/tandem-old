// mod base;
use crate::base::tokenizer::*;
use crate::css_parser::parse as parse_css;
mod ast;
use ast::*;

pub fn parse<'a>(str: &'a str) -> Result<Expression<'a>, &'static str> {
  parse_fragment(&mut Tokenizer::new(str))
}

fn parse_fragment<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let mut children: Vec<Expression<'a>> = vec![];

  while !tokenizer.is_eof() {
    children.push(parse_node(tokenizer)?);
    tokenizer.eat_whitespace();
  }

  if children.len() == 1 {
    Ok(children.pop().unwrap())
  } else {
    Ok(Expression {
      item: Grammar::Fragment(ast::Fragment { children })
    })
  }
}

fn parse_node<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  tokenizer.eat_whitespace();
  let token = tokenizer.next()?;
  match token {
    Token::Word(text) => Ok(Expression { item: Grammar::Text(text) }),
    Token::SlotOpen => parse_slot(tokenizer),
    Token::LessThan => parse_element(tokenizer),
    _ => Err("Unkown element")
  }
}

fn parse_slot<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let script = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::SlotClose) })?;
  tokenizer.next()?;
  Ok(Expression {
    item: Grammar::Slot(script)
  })
}

fn parse_element<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let tag_name = parse_tag_name(tokenizer)?;
  let attributes = parse_attributes(tokenizer)?;

  if tag_name == "style" {
    parse_next_style_element_parts(attributes, tokenizer)
  } else {
    parse_next_basic_element_parts(tag_name, attributes, tokenizer)
  }
}

fn parse_next_basic_element_parts<'a>(tag_name: &'a str, attributes: Vec<Expression<'a>>, tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let mut children: Vec<Expression<'a>> = vec![];

  tokenizer.eat_whitespace();
  
  match tokenizer.next()? {
    Token::SelfCloseTag => {
    },
    Token::GreaterThan => {
      tokenizer.eat_whitespace();
      while tokenizer.peek(1)? != Token::CloseTag {
        children.push(parse_node(tokenizer)?);
        tokenizer.eat_whitespace();
      }

      tokenizer.next()?;
      parse_tag_name(tokenizer)?;
      tokenizer.next()?; 
    },
    _ => {
      return Err("Unexpected token")
    }
  }

  Ok(Expression {
    item: Grammar::Element(ast::Element {
      tag_name,
      attributes,
      children
    })
  })
}

fn parse_next_style_element_parts<'a>(attributes: Vec<Expression<'a>>, tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  tokenizer.next()?; // eat >
  let sheet_source = get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != Token::CloseTag && tokenizer.peek(2)? != Token::Word("style"))
  })?;

  // TODO - assert tokens equal these
  tokenizer.next()?; // eat </
  tokenizer.next()?; // eat style
  tokenizer.next()?; // eat >

  Ok(Expression {
    item: Grammar::StyleElement(ast::StyleElement {
      attributes,
      sheet: parse_css(&sheet_source)?
    })
  })
}


fn get_buffer<'a, FF>(tokenizer: &mut Tokenizer<'a>, until: FF) -> Result<&'a str, &'static str> where
  FF: Fn(&mut Tokenizer) -> Result<bool, &'static str> {
  let start = tokenizer.pos;
  let mut end = start;
  tokenizer.next()?;
  while !tokenizer.is_eof() {
    end = tokenizer.pos;
    if !until(tokenizer)? {
      break;
    }
    tokenizer.next()?;
  }

  Ok(std::str::from_utf8(&tokenizer.source[start..end]).unwrap())
}

fn parse_tag_name<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, &'static str> {
  get_buffer(tokenizer, |tokenizer| { Ok(!matches!(tokenizer.peek(1)?, Token::Whitespace | Token::GreaterThan | Token::Equals)) })
}

fn parse_attributes<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Vec<Expression<'a>>, &'static str> {

  let mut attributes: Vec<Expression<'a>> = vec![];

  loop {
    tokenizer.eat_whitespace();
    match tokenizer.peek(1)? {
      Token::SelfCloseTag | Token::GreaterThan => break,
      _ => {
        attributes.push(parse_attribute(tokenizer)?);
      }
    }
  }

  Ok(attributes)
}


fn parse_attribute<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let name = parse_tag_name(tokenizer)?;
  let mut value = None;

  if tokenizer.peek(1)? == Token::Equals {
    tokenizer.next()?; // eat =
    value = Some(Box::new(parse_attribute_value(tokenizer)?));
  }

  Ok(Expression {
    item: Grammar::Attribute(ast::Attribute {
      name,
      value
    })
  })
}

fn parse_attribute_value<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  match tokenizer.peek(1)? {
    Token::SingleQuote | Token::DoubleQuote => parse_string(tokenizer),
    _ => Err("Unexpected token")
  }
}

fn parse_string<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let quote = tokenizer.next()?;
  let value = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != quote) })?;
  tokenizer.next()?; // eat
  Ok(Expression {
    item: Grammar::String(value)
  })
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn can_parse_a_simple_text_node() {
    let expr = parse("abc").unwrap();
    let eql = Expression {
      item: Grammar::Text("abc")
    };

    assert_eq!(expr, eql);
  }

  #[test]
  fn can_parse_a_simple_self_closing_element() {
    let expr = parse("<div />").unwrap();
    let eql = Expression {
      item: Grammar::Element(ast::Element {
        tag_name: "div",
        attributes: vec![],
        children: vec![]
      })
    };

    assert_eq!(expr, eql);
  }

  #[test]
  fn can_parse_an_element_with_an_attribute_name() {
    let expr = parse("<div a />").unwrap();
    let eql = Expression {
      item: Grammar::Element(ast::Element {
        tag_name: "div",
        attributes: vec! [
          Expression {
            item: Grammar::Attribute(ast::Attribute {
              name: "a",
              value: None
            })
          }
        ],
        children: vec![]
      })
    };

    assert_eq!(expr, eql);
  }
  #[test]
  fn can_parse_an_element_with_an_attribute_value() {
    let expr = parse("<div a='b' />").unwrap();
    let eql = Expression {
      item: Grammar::Element(ast::Element {
        tag_name: "div",
        attributes: vec! [
          Expression {
            item: Grammar::Attribute(ast::Attribute {
              name: "a",
              value: Some(Box::new(Expression {
                item: Grammar::String("b")
              }))
            })
          }
        ],
        children: vec![]
      })
    };

    assert_eq!(expr, eql);
  }

  #[test]
  fn can_parse_multiple_values() {
    let expr = parse("<div a='b' c d />").unwrap();
    let eql = Expression {
      item: Grammar::Element(ast::Element {
        tag_name: "div",
        attributes: vec! [
          Expression {
            item: Grammar::Attribute(ast::Attribute {
              name: "a",
              value: Some(Box::new(Expression {
                item: Grammar::String("b")
              }))
            })
          },
          Expression {
            item: Grammar::Attribute(ast::Attribute {
              name: "c",
              value: None
            })
          },
          Expression {
            item: Grammar::Attribute(ast::Attribute {
              name: "d",
              value: None
            })
          }
        ],
        children: vec![]
      })
    };

    assert_eq!(expr, eql);
  }


  #[test]
  fn can_parse_children() {
    let expr = parse("<div> <span /></div>").unwrap();
    let eql = Expression {
      item: Grammar::Element(ast::Element {
        tag_name: "div",
        attributes: vec! [],
        children: vec![
          Expression {
            item: Grammar::Element(ast::Element {
              tag_name: "span",
              attributes: vec! [],
              children: vec![]
            })
          }
        ]
      })
    };

    assert_eq!(expr, eql);
  }

  #[test]
  fn can_parse_blocks() {
    let expr = parse("{{block}}").unwrap();
    assert_eq!(expr.to_string(), "{{block}}");
  }

  #[test]
  fn can_parse_a_style() {
    let expr = parse("<style>div { color: red; }</style>").unwrap();
    assert_eq!(expr.to_string(), "<style>div { color: red; }</style>");
  }
}