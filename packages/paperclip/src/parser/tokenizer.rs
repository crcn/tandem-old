

#[derive(PartialEq, Debug)]
pub enum Token<'a> {
    
  // <
  LessThan,

  // -
  Minus,

  // *
  Star,

  // +
  Plus,

  // >
  GreaterThan,

  // />
  SelfCloseTag,

  // </
  CloseTag,

  // {{
  SlotOpen,

  // }}
  SlotClose,

  // {{#
  BlockOpen,

  // {{/
  BlockClose,

  // {
  CurlyOpen,


  // }
  CurlyClose,

  // "
  DoubleQuote,

  // '
  SingleQuote,

  // =
  Equals,

  // ==
  DoubleEquals,

  // ===
  TrippleEquals,

  // /
  Backslash,

  // 
  Whitespace,

  // ...
  Spread,

  // .
  Dot,

  // ,
  Comma,

  // :
  Colon,

  // /*
  ScriptCommentOpen,

  // */
  ScriptCommentClose,

  // -->
  HtmlCommentOpen,

  // -->
  HtmlCommentClose,


  // div, blay
  Word(&'a str),

  // 5, .5, 0.5
  Number(&'a str),


  Byte(u8),
}

pub struct Tokenizer<'a> {
  source: &'a [u8],
  pos: usize
}


impl<'a> Tokenizer<'a> {

  pub fn next(&mut self) -> Option<Token> {

    match self.curr_char() {
      Some(c) => match c {
        b'/' => { 
          if self.starts_with(b"/>") {
            self.forward(2);
            Some(Token::SelfCloseTag)
          } else if self.starts_with(b"/*") {
            self.forward(2);
            Some(Token::ScriptCommentOpen)
          } else {
            self.forward(1);
            Some(Token::Backslash)
          }
        },
        b'>' => { self.forward(1); Some(Token::GreaterThan) },
        b'<' => {
          if self.starts_with(b"</") {
            self.forward(2);
            Some(Token::CloseTag)
          } else if self.starts_with(b"<!--") {
            self.forward(4);
            Some(Token::HtmlCommentOpen)
          } else {
            self.forward(1);
            Some(Token::LessThan)
          }
        },
        b'-' => {
          if self.starts_with(b"-->") {
            self.forward(3);
            Some(Token::HtmlCommentClose)
          } else {
            self.forward(1);
            Some(Token::Minus)
          }
        },
        b'*' => {
          if self.starts_with(b"*/") {
            self.forward(2);
            Some(Token::ScriptCommentClose)
          } else {
            self.forward(1);
            Some(Token::Star)
          }
        },
        b'+' => {
          self.forward(1);
          Some(Token::Plus)
        },
        b',' => {
          self.forward(1);
          Some(Token::Comma)
        },
        b':' => {
          self.forward(1);
          Some(Token::Colon)
        },
        b'.' => {
          if self.starts_with(b"...") {
            self.forward(3);
            Some(Token::Spread)
          } else {
            self.forward(1);
            let is_number = |c| { matches!(c, b'0'..=b'9') };

            if !self.is_eof() && is_number(self.curr_char().unwrap()) {
              let start = self.pos - 1;
              self.scan(is_number);
              Some(Token::Number(self.since(start)))
            } else {
              Some(Token::Dot)
            }          
          }
        },
        b'{' => {
          if self.starts_with(b"{{") {
            self.forward(2);
            if self.starts_with(b"#") {
              self.forward(1);
              Some(Token::BlockOpen)
            } else if self.starts_with(b"/") {
              self.forward(1);
              Some(Token::BlockClose)
            } else {
              Some(Token::SlotOpen)
            }
          } else {
            self.forward(1);
            Some(Token::CurlyOpen)
          }
        },
        b'}' => {
          if self.starts_with(b"}}") {
            self.forward(2);
            Some(Token::SlotClose)
          } else {
            self.forward(1);
            Some(Token::CurlyClose)
          }
        },
        b'0'..=b'9' => {
          let start = self.pos;
          let is_number = |c| { matches!(c, b'0'..=b'9') };
          self.scan(is_number);
          if self.starts_with(b".") {
            self.forward(1);
            self.scan(is_number);
          }

          Some(Token::Number(self.since(start)))
        },
        b'"' => { self.forward(1); Some(Token::DoubleQuote) },
        b'\'' => { self.forward(1); Some(Token::SingleQuote) },
        b'=' => { 
          if self.starts_with(b"===") {
            self.forward(3); 
            Some(Token::TrippleEquals)
          } else if self.starts_with(b"==") {
            self.forward(2); 
            Some(Token::DoubleEquals)
          } else {
            self.forward(1); 
            Some(Token::Equals)
          }
        },
        b'a'..=b'z' | b'A'..=b'Z' => Some(Token::Word(self.search(|c| -> bool { matches!(c, b'a'..=b'z' | b'A'..=b'Z') }))),
        b' ' | b'\t' | b'\r' | b'\n' => { self.scan(|c| -> bool { matches!(c, b' ' | b'\t' | b'\r' | b'\n') }); Some(Token::Whitespace) },
        _ => { self.forward(1); Some(Token::Byte(c)) }
      },
      None => None
    }
  }

  fn starts_with(&mut self, pattern: &[u8]) -> bool {
    self.source[self.pos..].starts_with(pattern)
  }
  fn forward(&mut self, pos: usize) {
    self.pos += pos;
  }
  fn curr_char(&mut self) -> Option<u8> {
    if self.is_eof() {
      None
    } else {
      Some(self.source[self.pos])
    }
  }
  fn search<FF>(&mut self, test: FF) -> &str where 
    FF: Fn(u8) -> bool {
    let start = self.pos;
    self.scan(test);
    self.since(start)
  }

  fn since(&mut self, start: usize) -> &str {
    std::str::from_utf8(&self.source[start..self.pos]).unwrap()
  }
  
  fn scan<FF>(&mut self, test: FF) where 
    FF: Fn(u8) -> bool {
    while !self.is_eof() {
      let c = self.source[self.pos];
      self.pos += 1;
      if !test(c) {
        self.pos-=1;
        break;
      }
    }
  }
  pub fn is_eof(&mut self) -> bool {
    self.pos >= self.source.len()
  }
  pub fn new(source: &'a str) -> Tokenizer {
      Tokenizer { source: source.as_bytes(), pos: 0 }
  }
}

#[cfg(test)]
mod tests {

  use super::*;

  #[test]
  fn can_tokenize_a_less_than_tag() {
    let mut tokenizer = Tokenizer::new("<");
    assert_eq!(tokenizer.next(), Some(Token::LessThan));
    assert_eq!(tokenizer.next(), None);
  }
  #[test]
  fn can_tokenize_a_word() {
    let mut tokenizer = Tokenizer::new("div");
    assert_eq!(tokenizer.next(), Some(Token::Word("div")));
    assert_eq!(tokenizer.next(), None);
  }
  #[test]
  fn can_tokenize_a_char() {
    let mut tokenizer = Tokenizer::new("$");
    assert_eq!(tokenizer.next(), Some(Token::Byte(b'$')));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_a_self_close_tag() {
    let mut tokenizer = Tokenizer::new("</");
    assert_eq!(tokenizer.next(), Some(Token::CloseTag));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_a_self_closing_tag() {
    let mut tokenizer = Tokenizer::new("/>");
    assert_eq!(tokenizer.next(), Some(Token::SelfCloseTag));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_a_simple_self_closing_element() {
    let mut tokenizer = Tokenizer::new("<some-div />");
    assert_eq!(tokenizer.next(), Some(Token::LessThan));
    assert_eq!(tokenizer.next(), Some(Token::Word("some")));
    assert_eq!(tokenizer.next(), Some(Token::Minus));
    assert_eq!(tokenizer.next(), Some(Token::Word("div")));
    assert_eq!(tokenizer.next(), Some(Token::Whitespace));
    assert_eq!(tokenizer.next(), Some(Token::SelfCloseTag));
    assert_eq!(tokenizer.next(), None);
  }
  #[test]
  fn can_tokenize_an_element_with_a_child() {
    let mut tokenizer = Tokenizer::new("<div><span /></div>");
    assert_eq!(tokenizer.next(), Some(Token::LessThan));
    assert_eq!(tokenizer.next(), Some(Token::Word("div")));
    assert_eq!(tokenizer.next(), Some(Token::GreaterThan));
    assert_eq!(tokenizer.next(), Some(Token::LessThan));
    assert_eq!(tokenizer.next(), Some(Token::Word("span")));
    assert_eq!(tokenizer.next(), Some(Token::Whitespace));
    assert_eq!(tokenizer.next(), Some(Token::SelfCloseTag));
    assert_eq!(tokenizer.next(), Some(Token::CloseTag));
    assert_eq!(tokenizer.next(), Some(Token::Word("div")));
    assert_eq!(tokenizer.next(), Some(Token::GreaterThan));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_open_slot() {
    let mut tokenizer = Tokenizer::new("{{");
    assert_eq!(tokenizer.next(), Some(Token::SlotOpen));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_curly_open() {
    let mut tokenizer = Tokenizer::new("{");
    assert_eq!(tokenizer.next(), Some(Token::CurlyOpen));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_close_slot() {
    let mut tokenizer = Tokenizer::new("}}");
    assert_eq!(tokenizer.next(), Some(Token::SlotClose));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_curly_close() {
    let mut tokenizer = Tokenizer::new("}");
    assert_eq!(tokenizer.next(), Some(Token::CurlyClose));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_comment_parts() {
    let mut tokenizer = Tokenizer::new("<!---->/**/");
    assert_eq!(tokenizer.next(), Some(Token::HtmlCommentOpen));
    assert_eq!(tokenizer.next(), Some(Token::HtmlCommentClose));
    assert_eq!(tokenizer.next(), Some(Token::ScriptCommentOpen));
    assert_eq!(tokenizer.next(), Some(Token::ScriptCommentClose));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_spread_operator() {
    let mut tokenizer = Tokenizer::new("...");
    assert_eq!(tokenizer.next(), Some(Token::Spread));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_comma() {
    let mut tokenizer = Tokenizer::new(",");
    assert_eq!(tokenizer.next(), Some(Token::Comma));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_colon() {
    let mut tokenizer = Tokenizer::new(":");
    assert_eq!(tokenizer.next(), Some(Token::Colon));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_dot() {
    let mut tokenizer = Tokenizer::new(".");
    assert_eq!(tokenizer.next(), Some(Token::Dot));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_double_quote() {
    let mut tokenizer = Tokenizer::new("\"");
    assert_eq!(tokenizer.next(), Some(Token::DoubleQuote));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_single_quote() {
    let mut tokenizer = Tokenizer::new("'");
    assert_eq!(tokenizer.next(), Some(Token::SingleQuote));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_double_equals() {
    let mut tokenizer = Tokenizer::new("==");
    assert_eq!(tokenizer.next(), Some(Token::DoubleEquals));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_tripple_equals() {
    let mut tokenizer = Tokenizer::new("===");
    assert_eq!(tokenizer.next(), Some(Token::TrippleEquals));
    assert_eq!(tokenizer.next(), None);
  }

  #[test]
  fn can_tokenize_equals() {
    let mut tokenizer = Tokenizer::new("=");
    assert_eq!(tokenizer.next(), Some(Token::Equals));
  }

  #[test]
  fn can_tokenize_open_block() {
    let mut tokenizer = Tokenizer::new("{{#");
    assert_eq!(tokenizer.next(), Some(Token::BlockOpen));
  }

  #[test]
  fn can_tokenize_close_block() {
    let mut tokenizer = Tokenizer::new("{{/");
    assert_eq!(tokenizer.next(), Some(Token::BlockClose));
  }

  #[test]
  fn can_tokenize_a_number() {
    let mut tokenizer = Tokenizer::new("56 3.2 .5 4.4.10 -32 533-9");
    assert_eq!(tokenizer.next(), Some(Token::Number("56")));
    assert_eq!(tokenizer.next(), Some(Token::Whitespace));
    assert_eq!(tokenizer.next(), Some(Token::Number("3.2")));
    assert_eq!(tokenizer.next(), Some(Token::Whitespace));
    assert_eq!(tokenizer.next(), Some(Token::Number(".5")));
    assert_eq!(tokenizer.next(), Some(Token::Whitespace));
    assert_eq!(tokenizer.next(), Some(Token::Number("4.4")));
    assert_eq!(tokenizer.next(), Some(Token::Number(".10")));
    assert_eq!(tokenizer.next(), Some(Token::Whitespace));
    assert_eq!(tokenizer.next(), Some(Token::Minus));
    assert_eq!(tokenizer.next(), Some(Token::Number("32")));
    assert_eq!(tokenizer.next(), Some(Token::Whitespace));
    assert_eq!(tokenizer.next(), Some(Token::Number("533")));
    assert_eq!(tokenizer.next(), Some(Token::Minus));
    assert_eq!(tokenizer.next(), Some(Token::Number("9")));
  }
} 