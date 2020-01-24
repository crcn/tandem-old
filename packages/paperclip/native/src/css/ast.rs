use std::fmt;
use crate::base::ast::{Expression};
use serde::{Serialize};

#[derive(Debug, PartialEq, Serialize)]
pub struct Declaration {
  pub name: String,
  pub value: String
}

impl fmt::Display for Declaration {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    writeln!(f, "{}:{};", &self.name, &self.value)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Rule {
  pub condition: String,
  pub declarations: Vec<Expression<Declaration>>
}

impl fmt::Display for Rule {
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
pub struct Sheet {
  pub rules: Vec<Expression<Rule>>
}

impl fmt::Display for Sheet {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    for rule in &self.rules {
      write!(f, "{}", &rule.item.to_string())?;
    }
    Ok(())
  }
}
