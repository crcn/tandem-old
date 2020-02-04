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
  Group(GroupSelector),
  Combo(ComboSelector),
  Descendent(DescendentSelector),
  PseudoElement(PseudoElementSelector),
  PseudoParamElement(PseudoParamElementSelector),
  Not(Box<Selector>),
  Child(ChildSelector),
  Adjacent(AdjacentSelector),
  Sibling(SiblingSelector),
  Id(IdSelector),
  Element(ElementSelector),
  Attribute(AttributeSelector),
  Class(ClassSelector),
  AllSelector
}

impl fmt::Display for Selector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self {
      Selector::Group(selector) => write!(f, "{}", selector.to_string()),
      Selector::Combo(selector) => write!(f, "{}", selector.to_string()),
      Selector::Element(selector) => write!(f, "{}", selector.to_string()),
      Selector::Descendent(selector) => write!(f, "{}", selector.to_string()),
      Selector::Not(selector) => write!(f, ":not({})", selector.to_string()),
      Selector::Adjacent(selector) => write!(f, "{}", selector.to_string()),
      Selector::PseudoElement(selector) => write!(f, "{}", selector.to_string()),
      Selector::PseudoParamElement(selector) => write!(f, "{}", selector.to_string()),
      Selector::Sibling(selector) => write!(f, "{}", selector.to_string()),
      Selector::Child(selector) => write!(f, "{}", selector.to_string()),
      Selector::Class(selector) => write!(f, "{}", selector.to_string()),
      Selector::Id(selector) => write!(f, "{}", selector.to_string()),
      Selector::Attribute(selector) => write!(f, "{}", selector.to_string()),
      Selector::AllSelector => write!(f, "*")
    }
  }
}

// a, b, h1, h2 { }
#[derive(Debug, PartialEq, Serialize)]
pub struct GroupSelector {
  pub selectors: Vec<Selector>
}

impl fmt::Display for GroupSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    let text: Vec<String> = (&self.selectors).into_iter().map(|selector| {
      selector.to_string()
    }).collect();

    write!(f, "{}", text.join(", "))
  }
}

// a.b[c=d] {}
#[derive(Debug, PartialEq, Serialize)]
pub struct ComboSelector {
  pub selectors: Vec<Selector>
}

impl fmt::Display for ComboSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    let text: Vec<String> = (&self.selectors).into_iter().map(|selector| {
      selector.to_string()
    }).collect();

    write!(f, "{}", text.join(""))
  }
}

// a b {}
#[derive(Debug, PartialEq, Serialize)]
pub struct DescendentSelector {
  pub parent: Box<Selector>,
  pub descendent: Box<Selector>
}

impl fmt::Display for DescendentSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{} {}", self.parent.to_string(), self.descendent.to_string())
  }
}

// a > b {}
#[derive(Debug, PartialEq, Serialize)]
pub struct ChildSelector {
  pub parent: Box<Selector>,
  pub child: Box<Selector>
}

impl fmt::Display for ChildSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{} > {}", self.parent.to_string(), self.child.to_string())
  }
}

// a + b {}
#[derive(Debug, PartialEq, Serialize)]
pub struct AdjacentSelector {
  pub selector: Box<Selector>,
  pub next_sibling_selector: Box<Selector>
}

impl fmt::Display for AdjacentSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{} + {}", self.selector.to_string(), self.next_sibling_selector.to_string())
  }
}

// a ~ b {}
#[derive(Debug, PartialEq, Serialize)]
pub struct SiblingSelector {
  pub selector: Box<Selector>,
  pub sibling_selector: Box<Selector>
}

impl fmt::Display for SiblingSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "{} ~ {}", self.selector.to_string(), self.sibling_selector.to_string())
  }
}

// div:before, div::after { }
#[derive(Debug, PartialEq, Serialize)]
pub struct PseudoElementSelector {
  pub name: String
}

impl fmt::Display for PseudoElementSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, ":{}", &self.name)?;
    Ok(())
  }
}

// :nth-of-type(div) { }
#[derive(Debug, PartialEq, Serialize)]
pub struct PseudoParamElementSelector {
  pub name: String,
  pub param: String
}

impl fmt::Display for PseudoParamElementSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, ":{}({})", &self.name, &self.param)?;
    Ok(())
  }
}

// div { }
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

// .div { }
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

// #div { }
#[derive(Debug, PartialEq, Serialize)]
pub struct IdSelector {
  pub id: String
}


impl fmt::Display for IdSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "#{}", &self.id)?;
    Ok(())
  }
}

// #div { }
#[derive(Debug, PartialEq, Serialize)]
pub struct AttributeSelector {
  pub name: String,
  pub value: Option<String>
}


impl fmt::Display for AttributeSelector {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    write!(f, "[{}", &self.name)?;
    if let Some(value) = &self.value {
      write!(f, "=\"{}\"", value)?;
    }
    write!(f, "]")?;
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
