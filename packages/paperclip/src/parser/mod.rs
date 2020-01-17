mod tokenizer;
use tokenizer::Tokenizer;

pub fn test() {
  let mut tokenizer = Tokenizer::new("<div></div>");
  
  while !tokenizer.is_eof() {
    println!("{:?}", tokenizer.next());
  }
}