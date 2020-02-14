use crate::base::tokenizer::{Tokenizer, Token};
use crate::base::parser::{ParseError};
use super::ast;

fn _parse<'a>(source: &'a str) -> Result<ast::Statement, ParseError> {
  let mut tokenizer = Tokenizer::new(source);
  parse_with_tokenizer(&mut tokenizer, |_token| { true })
}

pub fn parse_with_tokenizer<'a, FUntil>(tokenizer: &mut Tokenizer<'a>, _until: FUntil) -> Result<ast::Statement, ParseError> where
FUntil: Fn(Token) -> bool {
  parse_reference(tokenizer)
}

fn parse_reference<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<ast::Statement, ParseError> {
  let pos = tokenizer.pos;
  if let Token::Word(name) = tokenizer.next()? {
    let mut path = vec![name.to_string()];
    while !tokenizer.is_eof() && tokenizer.peek(1)? == Token::Dot {
      tokenizer.next()?; // eat .
      let pos = tokenizer.pos;
      match tokenizer.next()? {
        Token::Word(part) => {
          path.push(part.to_string());
        }
        _ => {
          return Err(ParseError::unexpected_token(pos));
        }
      }
    }
    Ok(ast::Statement::Reference(ast::Reference { path: path }))
  } else {
    Err(ParseError::unexpected_token(pos))
  }
}
