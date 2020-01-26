use crate::base::ast::{Expression};
// use crate::base::parser::{get_buffer};
use crate::base::parser::{expect_token};
use crate::base::tokenizer::{Tokenizer, Token};
use super::ast;

pub fn parse<'a>(source: &'a str) -> Result<Expression<ast::Statement>, &'static str> {
  let mut tokenizer = Tokenizer::new(source);
  parse_reference(&mut tokenizer)
}

fn parse_reference<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<ast::Statement>, &'static str> {
  // let name = tokenizer.next()?;
  if let Token::Word(name) = tokenizer.next()? {
    Ok(Expression { item: ast::Statement::Reference(ast::Reference { name: name.to_string() }) })
  } else {
    Err("unexpected token")
  }
}