use crate::base::tokenizer::{Tokenizer, Token};
use super::ast;

pub fn parse<'a>(source: &'a str) -> Result<ast::Statement, &'static str> {
  let mut tokenizer = Tokenizer::new(source);
  parse_reference(&mut tokenizer)
}

fn parse_reference<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<ast::Statement, &'static str> {
  // let name = tokenizer.next()?;
  if let Token::Word(name) = tokenizer.next()? {
    let mut path = vec![name.to_string()];
    while !tokenizer.is_eof() && tokenizer.peek(1)? == Token::Dot {
      tokenizer.next()?; // eat .
      match tokenizer.next()? {
        Token::Word(part) => {
          path.push(part.to_string());
        }
        _ => {
          return Err("Unexpected token");
        }
      }
    }
    Ok(ast::Statement::Reference(ast::Reference { path: path }))
  } else {
    Err("unexpected token")
  }
}
