use std::fmt;
use crate::base::ast::{Expression};
use serde::{Serialize};

#[derive(Debug, PartialEq, Serialize)]
pub struct Declaration<'a> {
  pub name: &'a str,
  pub value: &'a str
}

impl<'a> fmt::Display for Declaration<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    writeln!(f, "{}:{};", &self.name, &self.value)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Rule<'a> {
  pub condition: &'a str,
  pub declarations: Vec<Expression<Declaration<'a>>>
}

impl<'a> fmt::Display for Rule<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    writeln!(f, "{} {{", &self.condition)?;
    for decl in &self.declarations {
      write!(f, "  {}", &decl.item.to_string())?;
    }
    writeln!(f, "}}")?;

    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Sheet<'a> {
  pub rules: Vec<Expression<Rule<'a>>>
}

impl<'a> fmt::Display for Sheet<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    for rule in &self.rules {
      write!(f, "{}", &rule.item.to_string())?;
    }
    Ok(())
  }
}


// impl<'a> fmt::Display for Expression<'a> {
//   fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
//     match &self.item {
//       Grammar::Sheet(sheet) => write!(f, "{}", sheet.to_string())?,
//       Grammar::Rule(rule) => write!(f, "{}", rule.to_string())?,
//       Grammar::Declaration(decl) => write!(f, "{}", decl.to_string())?
//     }

//     Ok(())
//   }
// }