use std::fs;
use std::path::Path;
use super::vfs::{VirtualFileSystem};
use crate::pc::{ast as pc_ast, parser};
use std::collections::HashMap;

#[derive(Debug)]
pub struct DependencyGraph {
  pub dependencies: HashMap<String, Dependency>
}

#[allow(dead_code)]
impl DependencyGraph {
  pub fn new() -> DependencyGraph {
    DependencyGraph { dependencies: HashMap::new() }
  }
  pub fn flatten<'a>(&'a self, entry_file_path: &String) -> Vec<&Dependency> {
    let mut deps = vec![];
    let entry = self.dependencies.get(entry_file_path).unwrap();
    deps.push(entry);
    for (_, dep_file_path) in &entry.dependencies {
      deps.extend(self.flatten(dep_file_path));
    }
    return deps;
  }

  pub fn flatten_dependents<'a>(&'a self, entry_file_path: &String) -> Vec<&Dependency> {
    let mut deps = vec![];
    let entry = self.dependencies.get(entry_file_path).unwrap();
    deps.push(entry);
    for (dep_file_path, dep) in &self.dependencies {
      if dep.dependencies.values().any(|file_path| { &file_path == &entry_file_path }) {
        deps.extend(self.flatten_dependents(dep_file_path));
      }
    }
    
    return deps;
  }

  pub async fn load_dependency<'a>(&mut self, file_path: &String, vfs: &mut VirtualFileSystem) -> Result<&Dependency, &'static str> {

    let mut to_load = vec![file_path.to_string()];
    
    while to_load.len() > 0 {
      let curr_file_path = to_load.pop().unwrap();
      let source = vfs.load(&curr_file_path).await?.to_string();
      let dependency = Dependency::from_source(source, &curr_file_path)?;
      for (_id, dep_file_path) in &dependency.dependencies {
        if !self.dependencies.contains_key(&dep_file_path.to_string()) {
          to_load.push(dep_file_path.to_string());
        }
      }
      self.dependencies.insert(curr_file_path.to_string(), dependency);
    }

    Ok(self.dependencies.get(&file_path.to_string()).unwrap())
  }

  pub async fn reload_dependents<'a>(&mut self, file_path: &String, vfs: &mut VirtualFileSystem) -> Result<&Dependency, &'static str> {
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
pub struct Dependency {
  pub file_path: String,
  pub dependencies: HashMap<String, String>,
  pub expression: pc_ast::Node
}

impl<'a> Dependency {
  pub fn from_source(source: String, file_path: &String) -> Result<Dependency, &'static str> {
    let expression = parser::parse(source.as_str())?;
    
    let imports = pc_ast::get_imports(&expression);
    let source_path = Path::new(&file_path);
    let dir = source_path.parent().unwrap();

    let mut dependencies = HashMap::new();
    for import in &imports {
      let src = fs::canonicalize(dir.join(pc_ast::get_attribute_value("src", import).unwrap().as_str())).unwrap();
      dependencies.insert(
        pc_ast::get_attribute_value("id", import).unwrap().as_str().to_string(),
        src.to_str().unwrap().to_string()
      );
    }
    Ok(Dependency {
      file_path: file_path.to_string(),
      expression,
      dependencies
    })
  }
}