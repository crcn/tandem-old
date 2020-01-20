use std::fmt;

#[derive(Debug, PartialEq)]
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

#[derive(Debug, PartialEq)]
pub struct Rule<'a> {
  pub condition: &'a str,
  pub declarations: Vec<Expression<'a>>
}

impl<'a> fmt::Display for Rule<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    writeln!(f, "{} {{", &self.condition)?;
    for decl in &self.declarations {
      write!(f, "  {}", &decl.to_string())?;
    }
    writeln!(f, "}}")?;

    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub struct Sheet<'a> {
  pub rules: Vec<Expression<'a>>
}

impl<'a> fmt::Display for Sheet<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    for decl in &self.rules {
      write!(f, "{}", &decl.to_string())?;
    }
    Ok(())
  }
}

#[derive(Debug, PartialEq)]
pub enum Grammar<'a> {
  Sheet(Sheet<'a>),
  Rule(Rule<'a>),
  Declaration(Declaration<'a>)
}

#[derive(Debug, PartialEq)]
pub struct Expression<'a> {
  pub item: Grammar<'a>
}

impl<'a> fmt::Display for Expression<'a> {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match &self.item {
      Grammar::Sheet(sheet) => write!(f, "{}", sheet.to_string())?,
      Grammar::Rule(rule) => write!(f, "{}", rule.to_string())?,
      Grammar::Declaration(decl) => write!(f, "{}", decl.to_string())?
    }

    Ok(())
  }
}