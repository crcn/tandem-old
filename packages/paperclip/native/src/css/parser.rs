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
  let selector = parse_element_selector(tokenizer)?;
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

fn parse_element_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let pos = tokenizer.pos;
  let token = tokenizer.peek(1)?;
  let selector = match &token {
    Token::Star => {
      tokenizer.next()?; // eat *
      Selector::AllSelector
    }
    Token::Dot => {
      tokenizer.next()?;
      Selector::Class(ClassSelector {
        class_name: parse_selector_text(tokenizer)?.to_string()
      })
    }
    Token::Word(_) => {
      Selector::Element(ElementSelector {
        tag_name: parse_selector_text(tokenizer)?.to_string()
      })
    }
    _ => {
      return Err(ParseError::unexpected_token(pos));

    }
  };
  Ok(selector)
}

fn parse_selector_text<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, ParseError> {
  get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != Token::Whitespace)
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


