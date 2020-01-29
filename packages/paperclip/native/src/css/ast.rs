use std::fmt;
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
  pub selector: Selector,
  pub declarations: Vec<Declaration>
}

impl fmt::Display for Rule {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    writeln!(f, "{} {{", &self.selector)?;
    for decl in &self.declarations {
      write!(f, "  {}", &decl.to_string())?;
    }
    writeln!(f, "}}")?;

    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub enum Selector {
  Element(ElementSelector),
  Class(ClassSelector),
  AllSelector
}

impl fmt::Display for Selector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Selector::Element(child) => write!(f, "{}", child.to_string()),
      Selector::Class(child) => write!(f, "{}", child.to_string()),
      Selector::AllSelector => write!(f, "*")
    }
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct ElementSelector {
  pub tag_name: String
}

impl fmt::Display for ElementSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{}", &self.tag_name)?;
    Ok(())
  }
}

#[derive(Debug, PartialEq, Serialize)]
pub struct ClassSelector {
  pub class_name: String
}


impl fmt::Display for ClassSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, ".{}", &self.class_name)?;
    Ok(())
  }
}


#[derive(Debug, PartialEq, Serialize)]
pub struct Sheet {
  pub rules: Vec<Rule>
}

impl fmt::Display for Sheet {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    for rule in &self.rules {
      write!(f, "{}", &rule.to_string())?;
    }
    Ok(())
  }
}
