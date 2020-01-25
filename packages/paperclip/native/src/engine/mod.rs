use std::fs;
use std::io;
use std::path::Path;
use std::collections::HashMap;
use crate::pc::{ast as pc_ast, parser, runtime};
use crate::pc::runtime::graph::{Dependency, DependencyGraph};
use crate::pc::runtime::vfs::{VirtualFileSystem};
use crate::base::ast::{Expression};
use serde::{Serialize};


pub struct Runtime {
  pub entry_file: String
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Evaluated {
  pub file_path: String,
  pub node: Option<runtime::virt::Node>
}

#[derive(Debug, PartialEq, Serialize)]
pub struct Diffed {
  // TODO
}

#[derive(Debug, PartialEq, Serialize)]
#[serde(tag = "type")]
pub enum EngineEvent {
  Evaluated(Evaluated),
  Diffed(Diffed)
}

pub struct Engine {
  events: Vec<EngineEvent>,
  pub vfs: VirtualFileSystem,
  pub dependency_graph: DependencyGraph,
  pub runtimes: Vec<Runtime>
}

impl Engine {
  pub fn new() -> Engine {
    Engine {
      vfs: VirtualFileSystem::new(),
      dependency_graph: DependencyGraph::new(),
      runtimes: vec![],
      events: vec![]
    }
  }
  
  pub fn start_runtime(&mut self, file_path: String) {
    let source = self.vfs.load(&file_path).unwrap().to_string();

    let dependency = &self.dependency_graph.load_dependency(&file_path, &mut self.vfs);

    self.evaluate(&file_path);
  }

  pub fn update_virtual_file_content(&mut self, file_path: String, content: String) {
    self.vfs.update(&file_path, &content);
    let dependency = &self.dependency_graph.reload_dependents(&file_path, &mut self.vfs);
    self.evaluate(&file_path);
  }

  fn evaluate(&mut self, file_path: &String) {
    let dependency = self.dependency_graph.dependencies.get(file_path).unwrap();
    self.events.push(EngineEvent::Evaluated(Evaluated {
      file_path: file_path.clone(),
      node: runtime::evaluate(&dependency.expression, file_path, &self.dependency_graph).unwrap()
    }));
    self.runtimes.push(Runtime {
      entry_file: file_path.to_string()
    });
  }

  pub fn drain_events(&mut self) -> Vec<EngineEvent> {
    self.events.drain(0..).collect()
  }

  pub fn stop_runtime(&mut self, file_path: String) {
    // self.open_files.push(file_path);
  }
}