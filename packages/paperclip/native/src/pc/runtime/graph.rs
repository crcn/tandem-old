use super::vfs::{VirtualFileSystem};
use crate::pc::{ast as pc_ast, parser as pc_parser};
use crate::css::{ast as css_ast, parser as css_parser};
use crate::base::parser::{ParseError};
use crate::base::ast::{Location};
use std::collections::HashMap;
use serde::{Serialize};
use crate::base::utils;

#[derive(Debug, PartialEq, Serialize, Clone)]
#[serde(tag = "kind")]
pub enum GraphErrorInfo {

  // <import />, <img />, <logic />
  IncludeNotFound(IncludeNodeFoundError),

  Syntax(ParseError),

  NotFound
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct IncludeNodeFoundError {

  #[serde(rename = "filePath")]
  pub file_path: String,
  pub location: Location,
  pub message: String
}

#[derive(Debug, PartialEq, Serialize, Clone)]
pub struct GraphError {
  
  #[serde(rename = "filePath")]
  file_path: String,
  info: GraphErrorInfo
}

#[derive(Debug)]
pub struct DependencyGraph {
  pub dependencies: HashMap<String, Dependency>
}

#[allow(dead_code)]
impl DependencyGraph {
  pub fn new() -> DependencyGraph {
    DependencyGraph { dependencies: HashMap::new() }
  }
  pub fn flatten<'a>(&'a self, entry_file_path: &String) -> Vec<(&Dependency, Option<&Dependency>)> {
    let mut deps: Vec<(&Dependency, Option<&Dependency>)> = vec![];
    if !self.dependencies.contains_key(entry_file_path) {
      return deps;
    }

    let entry = self.dependencies.get(entry_file_path).unwrap();
    deps.push((entry, None));
    
    let mut dependents = vec![entry];

    while dependents.len() > 0 {
      let dependent = dependents.pop().unwrap();
      for (_, dep_file_path) in &dependent.dependencies {
        let dep = self.dependencies.get(dep_file_path).unwrap();
        deps.push((dep, Some(dependent)));
        dependents.push(dep);
      }
    }
    return deps;
  }

  pub fn flatten_dependents<'a>(&'a self, entry_file_path: &String) -> Vec<&Dependency> {
    let mut deps = vec![];
    let entry_option = self.dependencies.get(entry_file_path);

    if let None = entry_option {
      return deps;
    }

    for (dep_file_path, dep) in &self.dependencies {
      if dep.dependencies.values().any(|file_path| { &file_path == &entry_file_path }) {
        deps.push(dep);
        deps.extend(self.flatten_dependents(dep_file_path));
      }
    }
    
    return deps;
  }

  pub async fn load_dependency<'a>(&mut self, file_path: &String, vfs: &mut VirtualFileSystem) -> Result<&Dependency, GraphError> {

    let mut to_load: Vec<(String, Option<(String, String)>)> = vec![(file_path.to_string(), None)];
    
    while to_load.len() > 0 {
      let (curr_file_path, import) = to_load.pop().unwrap();
      let source = vfs.load(&curr_file_path).await
      .or_else(|_| {
        let err: GraphError = match import {
          Some((origin_file_path, import_id)) => {
            let origin_dep = self.dependencies.get(&origin_file_path).unwrap();

            let location = match &origin_dep.content {
              DependencyContent::Node(node) => {
                pc_ast::get_import_by_id(&import_id, node).unwrap().open_tag_location.clone()
              }
              DependencyContent::StyleSheet(_) => {
                // TODO once imports are working in CSS sheets
                Location { start: 0, end: 0 }
              }
            };

            let info = GraphErrorInfo::IncludeNotFound(IncludeNodeFoundError {
              message: "import not found".to_string(),
              file_path: curr_file_path.to_string(),
              location,
            });

            GraphError {
              file_path: origin_file_path.to_string(),
              info,
            }
          },
          None => {
            GraphError { 
              file_path: curr_file_path.to_string(),
              info: GraphErrorInfo::NotFound
            }
          }
        };

        Err(err)
      })?.to_string();
      
      let dependency = Dependency::from_source(source, &curr_file_path).or_else(|error| {
        Err(GraphError {
          file_path: curr_file_path.to_string(),
          info: GraphErrorInfo::Syntax(error)
        })
      })?;

      for (_id, dep_file_path) in &dependency.dependencies {
        if !self.dependencies.contains_key(&dep_file_path.to_string()) {
          to_load.push((
            dep_file_path.to_string(),
            Some((curr_file_path.to_string(), _id.to_string()))
          ));
        }
      }

      self.dependencies.insert(curr_file_path.to_string(), dependency);

    }

    Ok(self.dependencies.get(&file_path.to_string()).unwrap())
  }

  pub async fn reload_dependents<'a>(&mut self, file_path: &String, vfs: &mut VirtualFileSystem) -> Result<&Dependency, GraphError> {
    if !self.dependencies.contains_key(&file_path.to_string()) {
      return self.load_dependency(file_path, vfs).await;
    }
    self.dependencies.remove(file_path);
    self.dependencies.retain(|_dep_file_path, dep| {
      return !dep.dependencies.contains_key(file_path);
    });
    self.load_dependency(file_path, vfs).await
  }
}

#[derive(Debug)]
pub enum DependencyContent {
  Node(pc_ast::Node),
  StyleSheet(css_ast::Sheet)
}

#[derive(Debug)]
pub struct Dependency {
  pub file_path: String,
  pub dependencies: HashMap<String, String>,
  pub content: DependencyContent
}

impl<'a> Dependency {
  pub fn from_source(source: String, file_path: &String) -> Result<Dependency, ParseError> {
    if file_path.ends_with(".css") {
      Dependency::from_css_source(source, file_path)
    } else {
      Dependency::from_pc_source(source, file_path)
    }
  }

  fn from_css_source(source: String, file_path: &String) -> Result<Dependency, ParseError> {
    let expression_result = css_parser::parse(source.as_str());
    if let Err(err) = expression_result {
      return Err(err);
    }
    let expression = expression_result.unwrap();

    Ok(Dependency {
      file_path: file_path.to_string(),
      content: DependencyContent::StyleSheet(expression),
      dependencies: HashMap::new()
    })
  }

  fn from_pc_source(source: String, file_path: &String) -> Result<Dependency, ParseError> {

    let expression_result = pc_parser::parse(source.as_str());

    if let Err(err) = expression_result {
      return Err(err);
    }

    let expression = expression_result.unwrap();
    
    let imports = pc_ast::get_imports(&expression);

    let mut dependencies = HashMap::new();
    for import in &imports {
      dependencies.insert(
        pc_ast::get_import_identifier(import).unwrap().as_str().to_string(),
        utils::resolve(file_path, pc_ast::get_attribute_value("src", import).unwrap())
      );
    }

    Ok(Dependency {
      file_path: file_path.to_string(),
      content: DependencyContent::Node(expression),
      dependencies
    })
  }
}