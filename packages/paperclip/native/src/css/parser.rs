// https://www.w3schools.com/cssref/css_selectors.asp
// https://www.w3schools.com/cssref/css3_pr_mediaquery.asp
// https://www.w3schools.com/cssref/css3_pr_animation-keyframes.asp
// https://www.w3schools.com/cssref/pr_charset_rule.asp

use super::ast::*;
use crate::base::parser::{get_buffer, ParseError};
use crate::base::tokenizer::{Token, Tokenizer};

pub fn parse<'a>(source: &'a str) -> Result<Sheet, ParseError> {
  let mut tokenizer = Tokenizer::new(&source);
  parse_with_tokenizer(&mut tokenizer, |_token| { true })
}

pub fn parse_with_tokenizer<'a, FWhere>(tokenizer: &mut Tokenizer<'a>, until: FWhere) -> Result<Sheet, ParseError> where
FWhere: Fn(Token) -> bool {
  parse_sheet(tokenizer, until)
}

fn eat_comments<'a>(tokenizer: &mut Tokenizer<'a>, start: Token, end: Token) -> Result<(), ParseError> {
  if tokenizer.is_eof() || tokenizer.peek(1)? != start {
    return Ok(())
  }
  tokenizer.next()?; // eat <!--
  while !tokenizer.is_eof()  {
    let curr = tokenizer.next()?;
    if curr == end {
      break;
    }
  }
  Ok(())
}

fn parse_sheet<'a, FWhere>(tokenizer: &mut Tokenizer<'a>, until: FWhere) -> Result<Sheet, ParseError> where
FWhere: Fn(Token) -> bool {
  Ok(Sheet {
    rules: parse_rules(tokenizer, until)?
  })
}


fn parse_rules<'a, FWhere>(tokenizer: &mut Tokenizer<'a>, until: FWhere) -> Result<Vec<Rule>, ParseError> where
FWhere: Fn(Token) -> bool {
  let mut rules = vec![];
  eat_superfluous(tokenizer);
  while !&tokenizer.is_eof() && until(tokenizer.peek(1)?) {
    rules.push(parse_rule(tokenizer)?);
    eat_superfluous(tokenizer);
  }
  Ok(rules)
}

fn eat_superfluous<'a>(tokenizer: &mut Tokenizer<'a>) {
  while !tokenizer.is_eof() {
    let tok = tokenizer.peek(1).unwrap();
    if tok == Token::Whitespace {
      tokenizer.next();
    } else if tok == Token::ScriptCommentOpen {
      eat_script_comments(tokenizer);
    } else {
      break;
    }
  }
}

fn parse_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Rule, ParseError> {
  eat_superfluous(tokenizer);
  eat_script_comments(tokenizer)?;
  eat_superfluous(tokenizer);
  match tokenizer.peek(1)? {
    Token::At => {
      parse_at_rule(tokenizer)
    }
    _ => {
      parse_style_rule(tokenizer)
    }
  }
}

fn parse_style_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Rule, ParseError> {
  Ok(Rule::Style(parse_style_rule2(tokenizer)?))
}

fn parse_style_rule2<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<StyleRule, ParseError> {
  let selector = parse_selector(tokenizer)?;
  let declarations = parse_declaration_body(tokenizer)?;
  Ok(StyleRule {
    selector,
    declarations,
  })
}


fn parse_declaration_body<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Vec<Declaration>, ParseError> {
  eat_superfluous(tokenizer);
  tokenizer.next_expect(Token::CurlyOpen)?; // eat {
  let declarations = parse_declarations(tokenizer)?;
  tokenizer.next_expect(Token::CurlyClose)?; // eat }
  eat_superfluous(tokenizer);
  Ok(declarations)
}

fn parse_at_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Rule, ParseError> {
  tokenizer.next_expect(Token::At)?;
  let name = parse_selector_name(tokenizer)?;
  eat_superfluous(tokenizer);
  match name {
    "charset" => {
      let value = parse_string(tokenizer)?;
      tokenizer.next_expect(Token::Semicolon)?;
      Ok(Rule::Charset(value.to_string()))
    },
    "namespace" => {
      let value = get_buffer(tokenizer, |tokenizer| {
        Ok(tokenizer.peek(1)? != Token::Semicolon)
      })?;
      tokenizer.next_expect(Token::Semicolon)?;
      Ok(Rule::Namespace(value.to_string()))
    },
    "supports" => {
      Ok(Rule::Supports(parse_condition_rule(name.to_string(), tokenizer)?))
    },
    "media" => {
      Ok(Rule::Media(parse_condition_rule(name.to_string(), tokenizer)?))
    },
    "keyframes" => {
      Ok(Rule::Keyframes(parse_keyframes_rule(tokenizer)?))
    },
    "font-face" => {
      Ok(Rule::FontFace(parse_font_face_rule(tokenizer)?))
    },
    "document" => {
      Ok(Rule::Document(parse_condition_rule(name.to_string(), tokenizer)?))
    },
    "page" => {
      Ok(Rule::Page(parse_condition_rule(name.to_string(), tokenizer)?))
    },
    _ => {
      Err(ParseError::unexpected_token(tokenizer.pos))
    }
  }
}

fn parse_condition_rule<'a>(name: String, tokenizer: &mut Tokenizer<'a>) -> Result<ConditionRule, ParseError> {
  let condition_text = get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != Token::CurlyOpen)
  })?.to_string();
  
  tokenizer.next_expect(Token::CurlyOpen)?;
  eat_superfluous(tokenizer);

  let mut rules = vec![];

  while tokenizer.peek(1)? != Token::CurlyClose {
    rules.push(parse_style_rule2(tokenizer)?);
  }
  tokenizer.next_expect(Token::CurlyClose)?;

  Ok(ConditionRule {
    name,
    condition_text,
    rules,
  })
}

fn parse_font_face_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<FontFaceRule, ParseError> {
  
  Ok(FontFaceRule {
    declarations: parse_declaration_body(tokenizer)?
  })
}


fn parse_keyframes_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<KeyframesRule, ParseError> {
  let name = get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != Token::CurlyOpen)
  })?.to_string();

  let mut rules = vec![];
  eat_superfluous(tokenizer);

  while tokenizer.peek(1)? != Token::CurlyClose {
    rules.push(parse_keyframe_rule(tokenizer)?);
  }

  tokenizer.next_expect(Token::CurlyClose)?;

  Ok(KeyframesRule {
    name,
    rules,
  })
}

fn parse_keyframe_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<KeyframeRule, ParseError> {
  let key = get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != Token::CurlyOpen)
  })?.to_string();


  Ok(KeyframeRule {
    key,
    declarations: parse_declaration_body(tokenizer)?
  })
}

fn parse_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  parse_group_selector(tokenizer)
}

// select, select, select
fn parse_group_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let mut selectors: Vec<Selector> = vec![];
  loop {
    eat_superfluous(tokenizer);
    selectors.push(parse_pair_selector(tokenizer)?);
    eat_superfluous(tokenizer);
    if tokenizer.peek(1)? == Token::Comma {
      tokenizer.next()?; // eat ,
    } else {
      break;
    }
  }
  if selectors.len() == 1 {
    Ok(selectors.pop().unwrap())
  } else {
    Ok(Selector::Group(GroupSelector {
      selectors
    }))
  }
}

// // parent > child
fn parse_pair_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let selector = parse_combo_selector(tokenizer)?;
  eat_superfluous(tokenizer);
  let delim = tokenizer.peek(1)?;
  match delim {
    Token::GreaterThan => {
      tokenizer.next()?; // eat >
      eat_superfluous(tokenizer);
      let child = parse_pair_selector(tokenizer)?;
      Ok(Selector::Child(ChildSelector {
        parent: Box::new(selector),
        child: Box::new(child)
      }))
    }
    Token::Plus => {
      tokenizer.next()?; // eat +
      eat_superfluous(tokenizer);
      let sibling = parse_pair_selector(tokenizer)?;
      Ok(Selector::Adjacent(AdjacentSelector {
        selector: Box::new(selector),
        next_sibling_selector: Box::new(sibling)
      }))

    }
    Token::Squiggle => {
      tokenizer.next()?; // eat ~
      eat_superfluous(tokenizer);
      let sibling = parse_pair_selector(tokenizer)?;
      Ok(Selector::Sibling(SiblingSelector {
        selector: Box::new(selector),
        sibling_selector: Box::new(sibling)
      }))
    }
    Token::CurlyOpen => {
      Ok(selector)
    }
    _ => {
      // try parsing child
      let descendent_result = parse_pair_selector(tokenizer);
      if let Ok(descendent) = descendent_result {
        Ok(Selector::Descendent(DescendentSelector {
          parent: Box::new(selector),
          descendent: Box::new(descendent)
        }))
      } else {
        Ok(selector)
      }
    }
  }
}


// div.combo[attr][another]
fn parse_combo_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let pos = tokenizer.pos;
  let mut selectors = vec![];
  loop {
    let result = parse_element_selector(tokenizer);
    if let Ok(child_selector) = result {
      selectors.push(child_selector);
    } else {
      break;
    }
  }
  if selectors.len() == 0 {
    return Err(ParseError::unexpected_token(pos));
  }

  if selectors.len() == 1 {
    Ok(selectors.pop().unwrap())
  } else {
    Ok(Selector::Combo(ComboSelector {
      selectors
    }))
  }
}

fn parse_element_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let pos = tokenizer.pos;
  let token = tokenizer.peek(1)?;
  let selector: Selector = match token {
    Token::Star => {
      tokenizer.next()?; // eat *
      Selector::AllSelector
    }
    Token::Dot => {
      tokenizer.next()?;
      Selector::Class(ClassSelector {
        class_name: parse_selector_name(tokenizer)?.to_string()
      })
    }
    Token::Colon => {
      parse_psuedo_element_selector(tokenizer)?
    }
    Token::Hash => {
      tokenizer.next()?;
      Selector::Id(IdSelector {
        id: parse_selector_name(tokenizer)?.to_string()
      })
    }
    Token::SquareOpen => {
      tokenizer.next()?;
      parse_attribute_selector(tokenizer)?
    }
    Token::Word(_) => {
      Selector::Element(ElementSelector {
        tag_name: parse_selector_name(tokenizer)?.to_string()
      })
    }
    _ => {
      return Err(ParseError::unexpected_token(pos));
    }
  };
  Ok(selector)
}
fn parse_psuedo_element_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> { 
  tokenizer.next()?;
  if tokenizer.peek(1)? == Token::Colon {
    tokenizer.next()?;
  }
  let name = parse_selector_name(tokenizer)?.to_string();
  let selector: Selector = if tokenizer.peek(1)? == Token::ParenOpen {
    tokenizer.next()?;
    let selector = if name == "not" {
      let sel = parse_pair_selector(tokenizer)?;
      Selector::Not(Box::new(sel))
    } else {
      let param = get_buffer(tokenizer, |tokenizer| {
        Ok(tokenizer.peek(1)? != Token::ParenClose)
      })?.to_string();

      Selector::PseudoParamElement(PseudoParamElementSelector {
        name,
        param
      })
    };

    tokenizer.next_expect(Token::ParenClose)?;
    selector
  } else {
    Selector::PseudoElement(PseudoElementSelector {
      name
    })
  };

  Ok(selector)
}

fn parse_attribute_selector<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Selector, ParseError> {
  let name = parse_attribute_name(tokenizer)?.to_string();
  let mut value = None;
  if tokenizer.peek(1)? == Token::Equals {
    tokenizer.next()?; // eat =
    value = Some(parse_attribute_selector_value(tokenizer)?.to_string());
  }

  tokenizer.next_expect(Token::SquareClose)?;

  Ok(Selector::Attribute(AttributeSelector {
    name, 
    value
  }))
}

fn parse_string<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, ParseError> {
  let initial = tokenizer.next()?; // eat quote
  let buffer = get_buffer(tokenizer, |tokenizer| {
    Ok(tokenizer.peek(1)? != initial)
  });
  tokenizer.next_expect(initial)?; // eat quote
  buffer
}

fn parse_attribute_selector_value<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, ParseError> {

  let initial = tokenizer.peek(1)?;
  let value = if initial == Token::SingleQuote || initial == Token::DoubleQuote {
    parse_string(tokenizer)?
  } else {
    get_buffer(tokenizer, |tokenizer| {
      Ok(tokenizer.peek(1)? != Token::SquareClose)
    })?
  };
  
  Ok(value)
}

fn parse_selector_name<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, ParseError> {
  get_buffer(tokenizer, |tokenizer| {
    let tok = tokenizer.peek(1)?;
    Ok(match tok {
      Token::Whitespace | 
      Token::Comma | 
      Token::Colon | 
      Token::ParenOpen | 
      Token::ParenClose | 
      Token::SingleQuote | 
      Token::DoubleQuote | 
      Token::Dot | 
      Token::Hash | 
      Token::Squiggle | 
      Token::GreaterThan | 
      Token::CurlyOpen | 
      Token::SquareOpen |
      Token::SquareClose => false,
      _ => true
    })
  })
}

fn parse_attribute_name<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<&'a str, ParseError> {
  get_buffer(tokenizer, |tokenizer| {
    let tok = tokenizer.peek(1)?;
    Ok(match tok {
      Token::Whitespace | 
      Token::Comma | 
      Token::Colon | 
      Token::ParenOpen | 
      Token::ParenClose | 
      Token::Equals | 
      Token::SingleQuote | 
      Token::DoubleQuote | 
      Token::Dot | 
      Token::Hash | 
      Token::Squiggle | 
      Token::GreaterThan | 
      Token::CurlyOpen | 
      Token::SquareOpen |
      Token::SquareClose => false,
      _ => true
    })
  })
}


fn parse_declarations<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Vec<Declaration>, ParseError> {
  let mut declarations = vec![];
  while !tokenizer.is_eof() {
    eat_superfluous(tokenizer);
    if tokenizer.peek(1)? == Token::CurlyClose {
      break
    }
    declarations.push(parse_declaration(tokenizer)?);
  }

  Ok(declarations)
}

fn eat_script_comments<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<(), ParseError> {
  eat_comments(tokenizer, Token::ScriptCommentOpen, Token::ScriptCommentClose)
}

fn parse_declaration<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Declaration, ParseError> {
  let name = get_buffer(tokenizer, |tokenizer| { Ok(tokenizer.peek(1)? != Token::Colon) })?.to_string();
  tokenizer.next()?; // eat :
  eat_superfluous(tokenizer);
  let value = get_buffer(tokenizer, |tokenizer| { 
    let tok = tokenizer.peek(1)?;
    Ok(tok != Token::Semicolon && tok != Token::CurlyClose) 
  })?.to_string();
  
  if tokenizer.peek(1)? == Token::Semicolon {
    tokenizer.next()?; // eat ;
  }
  Ok(Declaration {
    name, 
    value
  })
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn can_smoke_parse_various_selectors() {

    let source = "
    .selector {}
    selector {}
    #id {}
    [attr] {}
    [attr=value] {}
    [attr='value'] {}
    [attr=\"value\"] {}
    a, b {}
    a.b.c {}
    a#id {}
    a[attr] {}
    a[attr][ab] {}
    a5d, b, c, d {}
    a.b, c[d][e], [f], g, .h {}
    a > b {}
    a > b[attr] {}
    a > b, c, d {}
    a ~ b {}
    a + b {}
    a + b, c, d[e=f] {}
    :before {}
    ::after {}
    :not(:after) {}
    :not(.a.b > c ~ d + e) {}
    :nth-child(1) {}
    /**/
    ::nth-last-child(1) { /**/ }
    :nth-last-of-type(1) {}
    :nth-last-of-type(div) {}
    :nth-of-type(div) {}
    :dir(div) {}
    /*comment*/.c5a, .ca a:link, .ca a:visited { /**/color:#5a5a5a; } /**/

    .c5a, .ca a:link, .ca a:visited { a: b; }
    ._3LS4zudUBagjFS7HjWJYxo{margin:0 4px}
    ._abcd{white-space:pre;word-break:normal;/**/padding:0 4px}
    .md-spoiler-text:not([data-revealed])>*{opacity:0}
    img[src='s.gif'][width='40'] { width: 12px; }
    ._aff=aadd { width: 12px; }
    /*comment*/
    ";

    let result = parse(source).unwrap();

    // println!("{:?}", result);
    // panic!("OK");
  }

  #[test]
  fn can_smoke_parse_various_at_rules() {


    let source = "
      @charset \"utf-8\";
      @namespace svg \"http://google.com\";
      @font-face {
        font-family: 'abcd';
      }
      @keyframes abc {
        0% {
          color: red;
        }
        100% {
          color: red;
        }
      }
      @media (max-width:640px){._3nRJIwLuth2pKYrXnr2jPN{width:360px } }
      @media print {
        div {
          color: red;
        }
        .span {
          color: blue;
        }
      }
      @page :first {
  
      }
      @supports (display: flex) {
        .el {
          display: flex;
        }
      }

      @media ab {._a{a:b;}}
    ";

    let result = parse(source).unwrap();
  }
}
