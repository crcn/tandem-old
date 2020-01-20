pub mod tokenizer;
use tokenizer::*;

pub fn get_buffer<'a, FF>(tokenizer: &mut Tokenizer<'a>, until: FF) -> Result<&'a str, &'static str> where
  FF: Fn(&mut Tokenizer) -> Result<bool, &'static str> {
  let start = tokenizer.pos;
  let mut end = start;
  tokenizer.next()?;
  while !tokenizer.is_eof() {
    end = tokenizer.pos;
    if !until(tokenizer)? {
      break;
    }
    tokenizer.next()?;
  }

  Ok(std::str::from_utf8(&tokenizer.source[start..end]).unwrap())
}