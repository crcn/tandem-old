mod tokenizer;
use tokenizer::*;
mod ast;

pub fn parse(str: &str) {
  parse_fragment(&mut Tokenizer::new(str))
}

fn parse_fragment(tok: &mut Tokenizer) {
  while !tok.is_eof() {

    println!("{:?}", tok.next());
  }
}

fn parse_node<'a>(tok: &mut Tokenizer) -> Result<ast::Expression<'a>, &'static str> {
  match tok.next().unwrap() {
    Token::Word(text) => Ok(ast::Expression { item: ast::Grammar::Text(text) }),
    // Token::LessThan => Ok(parse_element(tok)),
    _ => Err("invalid")
  }
}
fn parse_element(_tok: &mut Tokenizer) {
}


#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn can_parse_a_simple_element() {
    parse("abc");
  }

}