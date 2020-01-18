mod tokenizer;
use tokenizer::*;
mod ast;

pub fn parse<'a>(str: &'a str) -> Result<ast::Expression<'a>, &'static str> {
  parse_fragment(&mut Tokenizer::new(str))
}

fn parse_fragment<'a>(tok: &mut Tokenizer<'a>) -> Result<ast::Expression<'a>, &'static str> {
  let mut children: Vec<ast::Expression<'a>> = vec![];

  while !tok.is_eof() {
    match parse_node(tok) {
      Ok(child) => {
        children.push(child);
      }
      Err(e) => {
        return Err(e);
      }
    }
    
  }

  if children.len() == 1 {
    Ok(children.pop().unwrap())
  } else {
    Ok(ast::Expression {
      item: ast::Grammar::Fragment(ast::Fragment { children })
    })
  }
}

fn parse_node<'a>(tok: &mut Tokenizer<'a>) -> Result<ast::Expression<'a>, &'static str> {
  match tok.next().unwrap() {
    Token::Word(text) => Ok(ast::Expression { item: ast::Grammar::Text(text) }),
    Token::LessThan => parse_element(tok),
    _ => Err("Unknown element")
  }
}

fn parse_element<'a>(tok: &mut Tokenizer<'a>) -> Result<ast::Expression<'a>, &'static str> {
  let tag_name = parse_tag_name(tok)?;
  let attributes = parse_attributes(tok)?;
  
  match tok.next()? {
    Token::SelfCloseTag => {

    },
    _ => {
      return Err("Unexpected token")
    }
  }
  let children = vec![];
  

  Ok(ast::Expression {
    item: ast::Grammar::Element(ast::Element {
      tag_name,
      attributes,
      children
    })
  })
}

fn parse_tag_name<'a>(tok: &mut Tokenizer<'a>) -> Result<&'a str, &'static str> {
  let start = tok.pos;
  let mut end = start;
  while !tok.is_eof() {
    end = tok.pos;
    match tok.next()? {
      tokenizer::Token::Whitespace | tokenizer::Token::GreaterThan => break,
      _ => { }
    }
  }

  Ok(std::str::from_utf8(&tok.source[start..end]).unwrap())
}

fn parse_attributes<'a>(tok: &mut Tokenizer<'a>) -> Result<Vec<ast::Expression<'a>>, &'static str> {
  let name = parse_tag_name(tok)?;
  let mut value = None;

  if tok.peek()? == Token::Equals {

  }

  ast::Expression {
    item: ast::Grammar::Attribute(ast::Attribute {
      name,
      value
    })
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn can_parse_a_simple_text_node() {
    let expr = parse("abc").unwrap();
    let eql = ast::Expression {
      item: ast::Grammar::Text("abc")
    };

    assert_eq!(expr, eql);
  }

  #[test]
  fn can_parse_a_simple_self_closing_element() {
    let expr = parse("<div />").unwrap();
    let eql = ast::Expression {
      item: ast::Grammar::Element(ast::Element {
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
    let eql = ast::Expression {
      item: ast::Grammar::Element(ast::Element {
        tag_name: "div",
        attributes: vec! [
          ast::Expression {
            item: ast::Grammar::Attribute(ast::Attribute {
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

}