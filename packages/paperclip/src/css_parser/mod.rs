use ast::*;
use crate::base_parser::*;
use crate::base_parser::tokenizer::*;

pub mod ast;

pub fn parse<'a>(source: &'a str) -> Result<Expression<'a>, &'static str> {
  let mut tokenizer = Tokenizer::new(&source);
  parse_sheet(&mut tokenizer)
}

fn parse_sheet<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let mut rules = vec![];
  while !&tokenizer.is_eof() {
    rules.push(parse_rule(tokenizer)?);
  }
  Ok(Expression {
    item: Grammar::Sheet(Sheet {
      rules,
    })
  })
}

fn parse_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  tokenizer.eat_whitespace();
  let condition = parse_condition(tokenizer)?;
  tokenizer.next()?; // eat {
  let declarations = parse_declarations(tokenizer)?;
  tokenizer.next()?; // eat }
  tokenizer.eat_whitespace();
  Ok(Expression {
    item: Grammar::Rule(Rule {
      condition,
      declarations,
    })
  })
}

fn parse_condition<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, &'static str> {
  get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::CurlyOpen) })
}

fn parse_declarations<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Vec<Expression<'a>>, &'static str> {
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

fn parse_declaration<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let name = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::Colon) })?;
  tokenizer.next()?; // eat :
  let value = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::Semicolon) })?;
  tokenizer.next()?; // eat ;
  Ok(Expression {
    item: Grammar::Declaration(Declaration {
      name, 
      value
    })
  })
}