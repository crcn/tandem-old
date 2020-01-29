use super::ast as pc_ast;
use crate::base::parser::{get_buffer, expect_token};
use crate::js::parser::parse as parse_js;
use crate::js::ast as js_ast;
use crate::base::tokenizer::{Token, Tokenizer};
use crate::css::parser::parse as parse_css;


pub fn parse<'a>(source: &'a str) -> Result<pc_ast::Node, &'static str> {
  parse_fragment(&mut Tokenizer::new(source))
}

fn parse_fragment<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Node, &'static str> {
  let mut children: Vec<pc_ast::Node> = vec![];

  while !tokenizer.is_eof() {
    children.push(parse_node(tokenizer)?);
    tokenizer.eat_whitespace();
  }

  if children.len() == 1 {
    Ok(children.pop().unwrap())
  } else {
    Ok(pc_ast::Node::Fragment(pc_ast::Fragment { children }))
  }
}

fn parse_node<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Node, &'static str> {
  tokenizer.eat_whitespace();
  let pos = tokenizer.pos;
  let token = tokenizer.next()?;
  match token {
    Token::SlotOpen => { parse_slot(tokenizer) },
    Token::LessThan => { parse_element(tokenizer) },
    Token::HtmlCommentOpen => { 
      let buffer = get_buffer(tokenizer, |tokenizer| {
        let tok = tokenizer.peek(1)?;
        Ok(tok != Token::HtmlCommentClose)
      })?.to_string();
      tokenizer.next()?; // eat -->
      Ok(pc_ast::Node::Comment(pc_ast::ValueObject { value: buffer }))
    },
    Token::BlockOpen => {
      parse_block(tokenizer)
    }
    _ => {
      tokenizer.pos = pos;
      Ok(pc_ast::Node::Text(pc_ast::ValueObject { 
        value: get_buffer(tokenizer, |tokenizer| {
          let tok = tokenizer.peek(1)?;
          Ok(
            tok != Token::SlotOpen && 
            tok != Token::LessThan && 
            tok != Token::CloseTag && 
            tok != Token::HtmlCommentOpen && 
            tok != Token::BlockOpen && 
            tok != Token::BlockClose
          )
        })?.to_string()
      }))
    }
  }
}

fn parse_slot<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Node, &'static str> {
  let script = parse_slot_script(tokenizer)?;
  Ok(pc_ast::Node::Slot(script))
}


fn parse_slot_script<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<js_ast::Statement, &'static str> {
  let script = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::SlotClose) })?.to_string();
  expect_token(tokenizer.next()?, Token::SlotClose)?;
  parse_js(script.as_str())
}

fn parse_element<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Node, &'static str> {
  let tag_name = parse_tag_name(tokenizer)?;
  let attributes = parse_attributes(tokenizer)?;

  if tag_name == "style" {
    parse_next_style_element_parts(attributes, tokenizer)
  } else {
    parse_next_basic_element_parts(tag_name, attributes, tokenizer)
  }
}

fn parse_next_basic_element_parts<'a>(tag_name: String, attributes: Vec<pc_ast::Attribute>, tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Node, &'static str> {
  let mut children: Vec<pc_ast::Node> = vec![];

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

  Ok(pc_ast::Node::Element(pc_ast::Element {
    tag_name,
    attributes,
    children
  }))
}

fn parse_block<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Node, &'static str> {
  let token = tokenizer.next()?; // eat {{# or {{/
  if let Token::Word(keyword) = token {
    match keyword {
      "if" => parse_if_block(tokenizer),
      _ => {
        Err("Unexpected token")
      }
    }
  } else {
    Err("Unxpected token")
  }
}

fn parse_if_block<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Node, &'static str> {
  Ok(pc_ast::Node::Block(pc_ast::Block::Conditional(
    parse_pass_fail_block(tokenizer)?
  )))
}

fn parse_pass_fail_block<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::ConditionalBlock, &'static str> {
  tokenizer.eat_whitespace();
  let js_source = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::SlotClose) })?;
  let condition = parse_js(js_source)?;
  expect_token(tokenizer.next()?, Token::SlotClose)?;


  let node = parse_block_children(tokenizer)?;
  let fail = parse_else_block(tokenizer)?;

  Ok(pc_ast::ConditionalBlock::PassFailBlock(
    pc_ast::PassFailBlock {
      condition,
      node,
      fail,
    }
  ))
}

fn parse_block_children<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Option<Box<pc_ast::Node>>, &'static str> {

  let mut children = vec![];

  // TODO - we don't really want this since whitespace technically renders. Though, right
  // now it's not handled.
  tokenizer.eat_whitespace();

  while !tokenizer.is_eof() && tokenizer.peek(1)? != Token::BlockClose {
    children.push(parse_node(tokenizer)?);
    tokenizer.eat_whitespace();
  }


  let node = if children.len() == 0 {
    None
  } else if children.len() == 1 {
    Some(Box::new(children.pop().unwrap()))
  } else {
    Some(Box::new(pc_ast::Node::Fragment(pc_ast::Fragment {
      children
    })))
  };

  Ok(node)
}

fn parse_else_block<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Option<Box<pc_ast::ConditionalBlock>>, &'static str> {
  tokenizer.eat_whitespace();
  expect_token(tokenizer.next()?, Token::BlockClose)?;
  tokenizer.eat_whitespace();
  match tokenizer.next()? {
    Token::Word(value) => {
      match value {
        "else" => {
          tokenizer.eat_whitespace();
          match tokenizer.next()? {
            Token::Word(value2) => {
              if value2 == "if" {
                Ok(Some(Box::new(parse_pass_fail_block(tokenizer)?)))
              } else {
                Err("Unexpected token")
              }
            },
            Token::SlotClose => {
              Ok(Some(Box::new(parse_final_condition_block(tokenizer)?)))
            }
            _ => {
              Err("Unexpected token")
            }
          }
        },
        _ => {
          Err("Unexpected token")
        }
      }
    },
    Token::SlotClose => {
      Ok(None)
    },
    _ => {
      Err("Unexpected token")
    }
  }
}

fn parse_final_condition_block<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::ConditionalBlock, &'static str> {
  let node =  parse_block_children(tokenizer)?;
  expect_token(tokenizer.next()?, Token::BlockClose)?;
  expect_token(tokenizer.next()?, Token::SlotClose)?;
  Ok(pc_ast::ConditionalBlock::FinalBlock(pc_ast::FinalBlock {
    node
  }))
}

fn parse_next_style_element_parts<'a>(attributes: Vec<pc_ast::Attribute>, tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Node, &'static str> {
  tokenizer.next()?; // eat >
  let sheet_source = get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != Token::CloseTag && tokenizer.peek(2)? != Token::Word("style"))
  })?;

  // TODO - assert tokens equal these
  expect_token(tokenizer.next()?, Token::CloseTag)?; // eat </
  expect_token(tokenizer.next()?, Token::Word("style"))?; // eat style
  expect_token(tokenizer.next()?, Token::GreaterThan)?; // eat >

  Ok(pc_ast::Node::StyleElement(pc_ast::StyleElement {
    attributes,
    sheet: parse_css(&sheet_source)?
  }))
}

fn parse_tag_name<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<String, &'static str> {
  Ok(get_buffer(tokenizer, |tokenizer| { Ok(!matches!(tokenizer.peek(1)?, Token::Whitespace | Token::GreaterThan | Token::Equals)) })?.to_string())
}

fn parse_attributes<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Vec<pc_ast::Attribute>, &'static str> {

  let mut attributes: Vec<pc_ast::Attribute> = vec![];

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

fn parse_attribute<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Attribute, &'static str> {
  if tokenizer.peek(1)? == Token::SlotOpen {
    tokenizer.next()?;
    parse_shorthand_attribute(tokenizer)
  } else {
    parse_key_value_attribute(tokenizer)
  }
}

fn parse_shorthand_attribute<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Attribute, &'static str> {
  let reference = parse_slot_script(tokenizer)?;

  // TODO - expect script to be reference with path.length === 1

  Ok(pc_ast::Attribute::ShorthandAttribute(pc_ast::ShorthandAttribute {
    reference,
  }))
}

fn parse_key_value_attribute<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::Attribute, &'static str> {
  
  let name = parse_tag_name(tokenizer)?;
  let mut value = None;

  if tokenizer.peek(1)? == Token::Equals {
    tokenizer.next()?; // eat =
    value = Some(parse_attribute_value(tokenizer)?);
  }

  Ok(pc_ast::Attribute::KeyValueAttribute(pc_ast::KeyValueAttribute {
    name,
    value
  }))
}

fn parse_attribute_value<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::AttributeValue, &'static str> {
  match tokenizer.peek(1)? {
    Token::SingleQuote | Token::DoubleQuote => parse_string(tokenizer),
    Token::SlotOpen => parse_attribute_slot(tokenizer),
    _ => Err("Unexpected token")
  }
}

fn parse_attribute_slot<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::AttributeValue, &'static str> {
  expect_token(tokenizer.next()?, Token::SlotOpen)?;
  let script = parse_slot_script(tokenizer)?;
  Ok(pc_ast::AttributeValue::Slot(script))
}


fn parse_string<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<pc_ast::AttributeValue, &'static str> {
  let quote = tokenizer.next()?;
  let value = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != quote) })?.to_string();
  tokenizer.next()?; // eat
  Ok(pc_ast::AttributeValue::String(pc_ast::AttributeStringValue { value }))
}

#[cfg(test)]
mod tests {
  use super::*;

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