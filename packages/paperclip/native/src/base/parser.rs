use super::tokenizer::*;

pub fn get_buffer<'a, FF>(tokenizer: &mut Tokenizer<'a>, until: FF) -> Result<&'a str, &'static str> where
FF: Fn(&mut Tokenizer) -> Result<bool, &'static str> {
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

pub fn expect_token(a: Token, b: Token) -> Result<(), &'static str> {
  if a != b {
    Err("Unexpected token")
  } else {
    Ok(())
  }
}


// pub fn expect_token2(a: Token, b: Token) -> Result<(), &'static str> {
//   if a != b {
//     Err("Unexpected token")
//   } else {
//     Ok(())
//   }
// }