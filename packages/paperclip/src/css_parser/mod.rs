use ast::*;
use crate::base::tokenizer::*;

pub mod ast;

pub fn parse<'a>(source: &'a str) -> Result<Expression<'a>, &'static str> {
  let mut tokenizer = Tokenizer::new(&source);

  Ok(Expression { item: Grammar::Declaration(Declaration {
    name: "OK",
    value: &source
  }) })
}

fn parse_sheet<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  let rules = vec![];
  while !&tokenizer.is_eof() {
    rules.push(parse_rule(&tokenizer)?);
  }
  Ok(Expression {
    item: Grammar::Sheet(Sheet {
      rules,
    })
  })
}

fn parse_rule<'a>(tokenizer: &mut Tokenizer<'a>) -> Result<Expression<'a>, &'static str> {
  tokenizer.eat_whitespace();
  let condition = parse_condition(tokenizer);
  tokenizer.next(); // eat {
  let declarations = parse_declarations(tokenixer);
  tokenizer.next(); // eat }
  Ok(Expression {
    item: Grammar::Rule(Rule {
      condition,
      declarations,
    })
  })
}

fn parse_condition<'a>(tokenixer: &mut Tokenizer<'a>) {

}