use std::fmt;
use std::path::Path;
use super::vfs::{VirtualFileSystem};
use crate::pc::{ast as pc_ast, parser};
use crate::base::ast::{Expression};
use std::collections::HashMap;

#[derive(Debug)]
pub struct DependencyGraph {
  pub dependencies: HashMap<String, Dependency>
}

impl DependencyGraph {
  pub fn new() -> DependencyGraph {
    DependencyGraph { dependencies: HashMap::new() }
  }
  pub fn load_dependency<'a>(&mut self, file_path: &String, vfs: &mut VirtualFileSystem) -> &Dependency {
    let source = vfs.load(&file_path).unwrap().to_string();
    let dependency = Dependency::from_source(source, &file_path);
    for (id, dep_file_path) in &dependency.dependencies {
      if !self.dependencies.contains_key(&dep_file_path.to_string()) {
        self.load_dependency(&dep_file_path, vfs);
      }
    }
    
    self.dependencies.insert(file_path.to_string(), dependency);
  
    return self.dependencies.get(&file_path.to_string()).unwrap();
  }
}

#[derive(Debug)]
pub struct Dependency {
  pub dependencies: HashMap<String, String>,
  pub expression: Expression<pc_ast::Node>
}

impl<'a> Dependency {
  pub fn from_source(source: String, file_path: &String) -> Dependency {
    let expression = parser::parse(source.as_str()).unwrap();
    let imports = pc_ast::get_imports(&expression);
    let source_path = Path::new(&file_path);
    let dir = source_path.parent().unwrap();

    let mut dependencies = HashMap::new();
    for import in &imports {
      let src = dir.join(pc_ast::get_attribute_value("src", import).unwrap().as_str());
      dependencies.insert(
        pc_ast::get_attribute_value("id", import).unwrap().as_str().to_string(),
        src.to_str().unwrap().to_string()
      );
    }
    Dependency {
      expression,
      dependencies
    }
  }
}

// pub fn load_dependency<'a>(file_path: &String, dependency_graph: &'a mut DependencyGraph, vfs: &mut VirtualFileSystem) -> &'a Dependency {
//   let source = vfs.load(&file_path).unwrap().to_string();
//   let dependency = Dependency::from_source(source, &file_path);
//   for dep_file_path in &dependency.dependencies {
//     if !dependency_graph.contains_key(&dep_file_path.to_string()) {
//       load_dependency(&dep_file_path, dependency_graph, vfs);
//     }
//   }
  
//   dependency_graph.insert(file_path.to_string(), dependency);

//   return dependency_graph.get(&file_path.to_string()).unwrap();
// }