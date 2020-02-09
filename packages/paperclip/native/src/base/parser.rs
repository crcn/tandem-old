use super::tokenizer::*;
use serde::{Serialize};

#[derive(Debug, PartialEq, Serialize, Clone)]
pub enum ParseErrorKind {
  EndOfFile,
  Unknown,
  Unexpected,
  Incomplete,
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct ParseError {
  pub kind: ParseErrorKind,
  pub message: String,
  pub pos: usize,
  pub len: usize
}

impl ParseError {
  pub fn new(kind: ParseErrorKind, message: String, pos: usize, len: usize) -> ParseError {
    ParseError {
      kind,
      message,
      pos,
      len
    }
  }
  pub fn unexpected_token(pos: usize) -> ParseError {
    ParseError::new(ParseErrorKind::Unexpected, "Unexpected token".to_string(), pos, 1)
  }
  pub fn incomplete(message: String, pos: usize, len: usize) -> ParseError {
    ParseError::new(ParseErrorKind::Incomplete, message, pos, len)
  }
  pub fn eof() -> ParseError {
    ParseError::new(ParseErrorKind::EndOfFile, "End of file".to_string(), 0, 1)
  }
  pub fn unknown() -> ParseError {
    ParseError::new(ParseErrorKind::Unknown, "An unknown error has occurred".to_string(), 0, 1)
  }
}

pub fn get_buffer<'a, FF>(tokenizer: &mut Tokenizer<'a>, until: FF) -> Result<&'a str, ParseError> where
FF: Fn(&mut Tokenizer) -> Result<bool, ParseError> {
  let start = tokenizer.pos;
  let mut end = start;

  while !tokenizer.is_eof() {
    if !until(tokenizer)? {
      break;
    }
    tokenizer.next()?;
    end = tokenizer.pos;
  }

  Ok(std::str::from_utf8(&tokenizer.source[start..end]).unwrap())
}

// pub fn expect_token(a: Token, b: Token) -> Result<(), ParseError<'a>> {
//   if a != b {
//     Err("Unexpected token")
//   } else {
//     Ok(())
//   }
// }


// pub fn expect_token2(a: Token, b: Token) -> Result<(), &'static str> {
//   if a != b {
//     Err("Unexpected token")
//   } else {
//     Ok(())
//   }
// }