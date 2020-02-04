// https://www.w3schools.com/cssref/css_selectors.asp
// https://www.w3schools.com/cssref/css3_pr_mediaquery.asp
// https://www.w3schools.com/cssref/css3_pr_animation-keyframes.asp
// https://www.w3schools.com/cssref/pr_charset_rule.asp

use super::ast::*;
use crate::base::parser::{get_buffer, ParseError};
use crate::base::tokenizer::{Token, Tokenizer};

pub fn parse<'a>(source: &'a str) -> Result<Sheet, ParseError> {
  let mut tokenizer = Tokenizer::new(&source);
  parse_with_tokenizer(&mut tokenizer, |_token| { true })
}

pub fn parse_with_tokenizer<'a, FWhere>(tokenizer: &mut Tokenizer<'a>, until: FWhere) -> Result<Sheet, ParseError> where
FWhere: Fn(Token) -> bool {
  parse_sheet(tokenizer, until)
}

fn eat_comments<'a>(tokenizer: &mut Tokenizer<'a>, start: Token, end: Token) -> Result<(), ParseError> {
  if tokenizer.is_eof() || tokenizer.peek(1)? != start {
    return Ok(())
  }
  tokenizer.next()?; // eat <!--
  while !tokenizer.is_eof()  {
    let curr = tokenizer.next()?;
    if curr == end {
      break;
    }
  }
  Ok(())
}

fn parse_sheet<'a, FWhere>(tokenizer: &mut Tokenizer<'a>, until: FWhere) -> Result<Sheet, ParseError> where
FWhere: Fn(Token) -> bool {
  let mut rules = vec![];
  tokenizer.eat_whitespace();
  while !&tokenizer.is_eof() && until(tokenizer.peek(1)?) {
    rules.push(parse_rule(tokenizer)?);
  }
  Ok(Sheet {
    rules,
  })
}

fn parse_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Rule, ParseError> {
  tokenizer.eat_whitespace();
  eat_script_comments(tokenizer)?;
  tokenizer.eat_whitespace();
  let selector = parse_selector(tokenizer)?;
  tokenizer.eat_whitespace();
  tokenizer.next_expect(Token::CurlyOpen); // eat {
  let declarations = parse_declarations(tokenizer)?;
  tokenizer.next_expect(Token::CurlyClose); // eat }
  tokenizer.eat_whitespace();
  Ok(Rule {
    selector,
    declarations,
  })
}
fn parse_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  parse_group_selector(tokenizer)
}

// select, select, select
fn parse_group_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let mut selectors: Vec<Selector> = vec![];
  loop {
    tokenizer.eat_whitespace();
    selectors.push(parse_pair_selector(tokenizer)?);
    tokenizer.eat_whitespace();
    if tokenizer.peek(1)? == Token::Comma {
      tokenizer.next(); // eat ,
    } else {
      break;
    }
  }
  if selectors.len() == 1 {
    Ok(selectors.pop().unwrap())
  } else {
    Ok(Selector::Group(GroupSelector {
      selectors
    }))
  }
}

// // parent > child
fn parse_pair_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let selector = parse_combo_selector(tokenizer)?;
  tokenizer.eat_whitespace(); 
  let delim = tokenizer.peek(1)?;
  match delim {
    Token::GreaterThan => {
      tokenizer.next()?; // eat >
      tokenizer.eat_whitespace();
      let child = parse_pair_selector(tokenizer)?;
      Ok(Selector::Child(ChildSelector {
        parent: Box::new(selector),
        child: Box::new(child)
      }))
    }
    Token::Plus => {
      tokenizer.next()?; // eat +
      tokenizer.eat_whitespace();
      let sibling = parse_pair_selector(tokenizer)?;
      Ok(Selector::Adjacent(AdjacentSelector {
        selector: Box::new(selector),
        next_sibling_selector: Box::new(sibling)
      }))

    }
    Token::Squiggle => {
      tokenizer.next()?; // eat ~
      tokenizer.eat_whitespace();
      let sibling = parse_pair_selector(tokenizer)?;
      Ok(Selector::Sibling(SiblingSelector {
        selector: Box::new(selector),
        sibling_selector: Box::new(sibling)
      }))
    }
    Token::CurlyOpen => {
      Ok(selector)
    }
    _ => {
      // try parsing child

      let descendent_result = parse_pair_selector(tokenizer);
      if let Ok(descendent) = descendent_result {

        Ok(Selector::Descendent(DescendentSelector {
          parent: Box::new(selector),
          descendent: Box::new(descendent)
        }))
      } else {
        Ok(selector)
      }
    }
  }
  // if delim == Token::GreaterThan {
  //   tokenizer.next()?; // eat >
  //   tokenizer.eat_whitespace();
  //   let child = parse_pair_selector(tokenizer)?;
  //   Ok(Selector::Child(ChildSelector {
  //     parent: Box::new(parent),
  //     child: Box::new(child)
  //   }))
  // } else if delim != Token::CurlyOpen {
  //   let descendent_result = parse_combo_selector(tokenizer);
  //   if let Ok(descendent) = descendent_result {

  //     Ok(Selector::Descendent(DescendentSelector {
  //       parent: Box::new(parent),
  //       descendent: Box::new(descendent)
  //     }))
  //   } else {
  //     Ok(parent)
  //   }
  // } else {
  //   Ok(parent)
  // }
}


// div.combo[attr][another]
fn parse_combo_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let pos = tokenizer.pos;
  let mut selectors = vec![];
  loop {
    let result = parse_element_selector(tokenizer);
    if let Ok(child_selector) = result {
      selectors.push(child_selector);
    } else {
      break;
    }
  }
  if selectors.len() == 0 {
    return Err(ParseError::unexpected_token(pos));
  }

  if selectors.len() == 1 {
    Ok(selectors.pop().unwrap())
  } else {
    Ok(Selector::Combo(ComboSelector {
      selectors
    }))
  }
}

fn parse_element_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let pos = tokenizer.pos;
  let token = tokenizer.peek(1)?;
  let selector: Selector = match token {
    Token::Star => {
      tokenizer.next()?; // eat *
      Selector::AllSelector
    }
    Token::Dot => {
      tokenizer.next()?;
      Selector::Class(ClassSelector {
        class_name: parse_selector_name(tokenizer)?.to_string()
      })
    }
    Token::Hash => {
      tokenizer.next()?;
      Selector::Id(IdSelector {
        id: parse_selector_name(tokenizer)?.to_string()
      })
    }
    Token::SquareOpen => {
      tokenizer.next()?;
      parse_attribute_selector(tokenizer)?
    }
    Token::Word(_) => {
      Selector::Element(ElementSelector {
        tag_name: parse_selector_name(tokenizer)?.to_string()
      })
    }
    _ => {
      return Err(ParseError::unexpected_token(pos));
    }
  };
  Ok(selector)
}

fn parse_attribute_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let name = parse_selector_name(tokenizer)?.to_string();
  let mut value = None;
  if tokenizer.peek(1)? == Token::Equals {
    tokenizer.next()?; // eat =
    value = Some(parse_attribute_selector_value(tokenizer)?.to_string());
  }

  tokenizer.next_expect(Token::SquareClose)?;

  Ok(Selector::Attribute(AttributeSelector {
    name, 
    value
  }))
}

fn parse_attribute_selector_value<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, ParseError> {

  let initial = tokenizer.peek(1)?;
  let value = if initial == Token::SingleQuote || initial == Token::DoubleQuote {
    tokenizer.next()?; // eat quote
    let buffer = get_buffer(tokenizer, |tokenizer| {
      Ok(tokenizer.peek(1)? != initial)
    })?;
    tokenizer.next()?; // eat quote
    buffer
  } else {
    get_buffer(tokenizer, |tokenizer| {
      Ok(tokenizer.peek(1)? != Token::SquareClose)
    })?
  };
  
  Ok(value)
}

fn parse_selector_name<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, ParseError> {
  get_buffer(tokenizer, |tokenizer| {
    let tok = tokenizer.peek(1)?;
    Ok(match tok {
      Token::Word(_) => true,
      Token::Byte(c) => c == b'-' || c == b'_' || c == b'$',
      _ => false
    })
  })
}


fn parse_declarations<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Vec<Declaration>, ParseError> {
  let mut declarations = vec![];
  while !tokenizer.is_eof() {
    tokenizer.eat_whitespace();
    if tokenizer.peek(1)? == Token::CurlyClose {
      break
    }
    declarations.push(parse_declaration(tokenizer)?);
  }

  Ok(declarations)
}

fn eat_script_comments<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<(), ParseError> {
  eat_comments(tokenizer, Token::ScriptCommentOpen, Token::ScriptCommentClose)
}

fn parse_declaration<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Declaration, ParseError> {
  let name = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::Colon) })?.to_string();
  tokenizer.next()?; // eat :
  tokenizer.eat_whitespace();
  let value = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::Semicolon) })?.to_string();
  tokenizer.next()?; // eat ;
  Ok(Declaration {
    name, 
    value
  })
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn can_smoke_parse_various_selectors() {

    let source = "
    .selector {}
    selector {}
    #id {}
    [attr] {}
    [attr=value] {}
    [attr='value'] {}
    [attr=\"value\"] {}
    a, b {}
    a.b.c {}
    a#id {}
    a[attr] {}
    a[attr][ab] {}
    a, b, c, d {}
    a.b, c[d][e], [f], g, .h {}
    a > b {}
    a > b[attr] {}
    a > b, c, d {}
    a ~ b {}
    a + b {}
    a + b, c, d[e=f] {}
    ";

    let result = parse(source).unwrap();

    println!("{:?}", result);
    panic!("OK");
  }
}
