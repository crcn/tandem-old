use super::ast::*;
use crate::base::parser::{get_buffer};
use crate::base::tokenizer::{Token, Tokenizer};
use crate::base::ast::{Expression};

pub fn parse<'a>(source: &'a str) -> Result<Expression<Sheet>, &'static str> {
  let mut tokenizer = Tokenizer::new(&source);
  parse_sheet(&mut tokenizer)
}


fn eat_comments<'a>(tokenizer: &mut Tokenizer<'a>, start: Token, end: Token) -> Result<(), &'static str> {
  if tokenizer.is_eof() || tokenizer.peek(1)? != start {
    return Ok(())
  }
  tokenizer.next()?; // eat <!--
  while !tokenizer.is_eof() {
    let curr = tokenizer.next()?;
    if curr == end {
      break;
    }
  }
  Ok(())
}

fn parse_sheet<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<Sheet>, &'static str> {
  let mut rules = vec![];
  while !&tokenizer.is_eof() {
    rules.push(parse_rule(tokenizer)?);
  }
  Ok(Expression {
    item: Sheet {
      rules,
    }
  })
}

fn parse_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<Rule>, &'static str> {
  tokenizer.eat_whitespace();
  eat_script_comments(tokenizer)?;
  tokenizer.eat_whitespace();
  let selector = parse_element_selector(tokenizer)?;
  tokenizer.eat_whitespace();
  tokenizer.next()?; // eat {
  let declarations = parse_declarations(tokenizer)?;
  tokenizer.next()?; // eat }
  tokenizer.eat_whitespace();
  Ok(Expression {
    item: Rule {
      selector,
      declarations,
    }
  })
}

fn parse_element_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, &'static str> {
  let token = tokenizer.peek(1)?;
  let selector = match &token {
    Token::Dot => {
      tokenizer.next()?;
      Selector::Class(ClassSelector {
        class_name: parse_selector_text(tokenizer)?.to_string()
      })
    }
    Token::Word(_) => {
      Selector::Element(ElementSelector {
        tag_name: parse_selector_text(tokenizer)?.to_string()
      })
    }
    _ => {
      return Err("Unexpected selector token");

    }
  };
  Ok(selector)
}

fn parse_selector_text<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, &'static str> {
  get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != Token::Whitespace)
  })
}


fn parse_declarations<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Vec<Expression<Declaration>>, &'static str> {
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

fn eat_script_comments<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<(), &'static str> {
  eat_comments(tokenizer, Token::ScriptCommentOpen, Token::ScriptCommentClose)
}

fn parse_declaration<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<Declaration>, &'static str> {
  let name = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::Colon) })?.to_string();
  tokenizer.next()?; // eat :
  tokenizer.eat_whitespace();
  let value = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::Semicolon) })?.to_string();
  tokenizer.next()?; // eat ;
  Ok(Expression {
    item: Declaration {
      name, 
      value
    }
  })
}



// #[cfg(test)]
// mod tests {
//   use super::*;

//   #[test]
//   fn can_parse_comments() {
//     let expr = parse("/*ok*/ div { color: red; }").unwrap();
//     assert_eq!(expr, Expression {
//       item: Sheet {
//         rules: vec![
//           Expression {
//             item: Rule {
//               selector: "div ".to_string(),
//               declarations: vec![
//                 Expression {
//                   item: Declaration {
//                     name: "color".to_string(),
//                     value: "red".to_string()
//                   }
//                 }
//               ]
//             }
//           }
//         ]
//       }
//     })
//   }
// }