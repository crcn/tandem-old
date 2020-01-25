use super::ast as pc_ast;
use crate::base::parser::{get_buffer, expect_token};
use crate::base::ast::{Expression};
use crate::base::tokenizer::{Token, Tokenizer};
use crate::css::parser::parse as parse_css;

pub fn parse<'a>(source: &'a str) -> Result<Expression<pc_ast::Node>, &'static str> {
  parse_fragment(&mut Tokenizer::new(source))
}

fn parse_fragment<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::Node>, &'static str> {
  let mut children: Vec<Expression<pc_ast::Node>> = vec![];

  while !tokenizer.is_eof() {
    children.push(parse_node(tokenizer)?);
    tokenizer.eat_whitespace();
  }

  if children.len() == 1 {
    Ok(children.pop().unwrap())
  } else {
    Ok(Expression {
      item: pc_ast::Node::Fragment(pc_ast::Fragment { children })
    })
  }
}

fn parse_node<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::Node>, &'static str> {
  tokenizer.eat_whitespace();
  let pos = tokenizer.pos;
  let token = tokenizer.next()?;
  match token {
    // Token::Word(text) => Ok(Expression { item: pc_ast::Node::Text(text) }),
    Token::SlotOpen => { parse_slot(tokenizer) },
    Token::LessThan => { parse_element(tokenizer) },
    Token::HtmlCommentOpen => { 
      let buffer = get_buffer(tokenizer, |tokenizer| {
        let tok = tokenizer.peek(1)?;
        Ok(tok != Token::HtmlCommentClose)
      })?.to_string();
      tokenizer.next()?; // eat -->
      Ok(Expression {
        item: pc_ast::Node::Comment(pc_ast::ValueObject { value: buffer })
      })
    },
    _ => {
      tokenizer.pos = pos;
      Ok(Expression {
        item: pc_ast::Node::Text(pc_ast::ValueObject { 
          value: get_buffer(tokenizer, |tokenizer| {
            let tok = tokenizer.peek(1)?;
            Ok(tok != Token::SlotOpen && tok != Token::LessThan && tok != Token::CloseTag && tok != Token::HtmlCommentOpen)
          })?.to_string()
        })
      })
    }
  }
}

fn parse_slot<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::Node>, &'static str> {
  let script = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::SlotClose) })?.to_string();
  tokenizer.next()?;
  Ok(Expression {
    item: pc_ast::Node::Slot(pc_ast::ValueObject { value: script })
  })
}

fn parse_element<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::Node>, &'static str> {
  let tag_name = parse_tag_name(tokenizer)?;
  let attributes = parse_attributes(tokenizer)?;

  if tag_name == "style" {
    parse_next_style_element_parts(attributes, tokenizer)
  } else {
    parse_next_basic_element_parts(tag_name, attributes, tokenizer)
  }
}

fn parse_next_basic_element_parts<'a>(tag_name: String, attributes: Vec<Expression<pc_ast::Attribute>>, tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::Node>, &'static str> {
  let mut children: Vec<Expression<pc_ast::Node>> = vec![];

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
    item: pc_ast::Node::Element(pc_ast::Element {
      tag_name,
      attributes,
      children
    })
  })
}

fn parse_next_style_element_parts<'a>(attributes: Vec<Expression<pc_ast::Attribute>>, tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::Node>, &'static str> {
  tokenizer.next()?; // eat >
  let sheet_source = get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != Token::CloseTag && tokenizer.peek(2)? != Token::Word("style"))
  })?;

  // TODO - assert tokens equal these
  expect_token(tokenizer.next()?, Token::CloseTag)?; // eat </
  expect_token(tokenizer.next()?, Token::Word("style"))?; // eat style
  expect_token(tokenizer.next()?, Token::GreaterThan)?; // eat >

  Ok(Expression {
    item: pc_ast::Node::StyleElement(pc_ast::StyleElement {
      attributes,
      sheet: parse_css(&sheet_source)?
    })
  })
}


fn parse_tag_name<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<String, &'static str> {
  Ok(get_buffer(tokenizer, |tokenizer| { Ok(!matches!(tokenizer.peek(1)?, Token::Whitespace | Token::GreaterThan | Token::Equals)) })?.to_string())
}

fn parse_attributes<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Vec<Expression<pc_ast::Attribute>>, &'static str> {

  let mut attributes: Vec<Expression<pc_ast::Attribute>> = vec![];

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


fn parse_attribute<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::Attribute>, &'static str> {
  let name = parse_tag_name(tokenizer)?;
  let mut value = None;

  if tokenizer.peek(1)? == Token::Equals {
    tokenizer.next()?; // eat =
    value = Some(parse_attribute_value(tokenizer)?);
  }

  Ok(Expression {
    item: pc_ast::Attribute {
      name,
      value
    }
  })
}

fn parse_attribute_value<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::AttributeValue>, &'static str> {
  match tokenizer.peek(1)? {
    Token::SingleQuote | Token::DoubleQuote => parse_string(tokenizer),
    _ => Err("Unexpected token")
  }
}

fn parse_string<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<pc_ast::AttributeValue>, &'static str> {
  let quote = tokenizer.next()?;
  let value = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != quote) })?.to_string();
  tokenizer.next()?; // eat
  Ok(Expression {
    item: pc_ast::AttributeValue::String(pc_ast::Str { value })
  })
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn can_parse_a_simple_text_node() {
    let expr = parse("abc").unwrap();
    let eql = Expression {
      item: pc_ast::Node::Text(pc_ast::ValueObject { value: "abc".to_string() })
    };

    assert_eq!(expr, eql);
  }

  #[test]
  fn can_parse_a_simple_self_closing_element() {
    let expr = parse("<div />").unwrap();
    let eql = Expression {
      item: pc_ast::Node::Element(pc_ast::Element {
        tag_name: "div".to_string(),
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
      item: pc_ast::Node::Element(pc_ast::Element {
        tag_name: "div".to_string(),
        attributes: vec! [
          Expression {
            item: pc_ast::Attribute {
              name: "a".to_string(),
              value: None
            }
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
      item: pc_ast::Node::Element(pc_ast::Element {
        tag_name: "div".to_string(),
        attributes: vec! [
          Expression {
            item: pc_ast::Attribute {
              name: "a".to_string(),
              value: Some(Expression {
                item: pc_ast::AttributeValue::String(pc_ast::Str { value: "b".to_string() })
              })
            }
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
      item: pc_ast::Node::Element(pc_ast::Element {
        tag_name: "div".to_string(),
        attributes: vec! [
          Expression {
            item: pc_ast::Attribute {
              name: "a".to_string(),
              value: Some(Expression {
                item:  pc_ast::AttributeValue::String(pc_ast::Str { value: "b".to_string() })
              })
            }
          },
          Expression {
            item: pc_ast::Attribute {
              name: "c".to_string(),
              value: None
            }
          },
          Expression {
            item: pc_ast::Attribute {
              name: "d".to_string(),
              value: None
            }
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
      item: pc_ast::Node::Element(pc_ast::Element {
        tag_name: "div".to_string(),
        attributes: vec! [],
        children: vec![
          Expression {
            item: pc_ast::Node::Element(pc_ast::Element {
              tag_name: "span".to_string(),
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

  // #[test]
  // fn can_parse_a_style() {
  //   let expr = parse("<style>div { color:red; }</style>").unwrap();
  //   assert_eq!(expr.to_string(), "<style>div  {\n  color:red;\n}\n</style>");
  // }

  #[test]
  fn can_parse_various_nodes() {

    let cases = [

      // text blocks
      "text",

      // comments
      "ab <!--cd-->",

      // slots
      "{{ok}}",

      // elements
      "<div></div>",
      "<div a b></div>",
      "<div a=\"b\" c></div>",
      "<div a=\"\"></div>",

      "<div a=\"b\" c=\"d\">
        <span>
          c {{block}} d {{block}}
        </span>
        <span>
          color {{block}}
        </span>
      </div>",

      // mixed elements
    ];

    for i in 0..cases.len() {
      let case = cases[i];

      // TODO - strip whitespace
      let expr = parse(case).unwrap();
      assert_eq!(expr.to_string().replace("\n", "").replace(" ", ""), case.replace("\n", "").replace(" ", ""));
      println!("{}", case);
    }
  }
}