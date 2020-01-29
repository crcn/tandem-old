use crate::pc::{runtime};
use crate::pc::runtime::graph::{DependencyGraph};
use crate::pc::runtime::vfs::{VirtualFileSystem};
use crate::js::runtime::virt as js_virt;
use serde::{Serialize};

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
  pub dependency_graph: DependencyGraph
}

impl Engine {
  pub fn new(http_path: Option<String>) -> Engine {
    Engine {
      vfs: VirtualFileSystem::new(http_path),
      dependency_graph: DependencyGraph::new(),
      events: vec![]
    }
  }
  
  pub fn start_runtime(&mut self, file_path: String) -> Result<(), &'static str> {
    self.dependency_graph.load_dependency(&file_path, &mut self.vfs)?;
    self.evaluate(&file_path)
  }

  pub fn update_virtual_file_content(&mut self, file_path: String, content: String) -> Result<(), &'static str> {
    self.vfs.update(&file_path, &content).unwrap();
    let mut dep_file_paths: Vec<String> = self.dependency_graph.flatten_dependents(&file_path).into_iter().map(|dep| -> String {
      dep.file_path.to_string()
    }).collect();

    for dep_file_path in dep_file_paths.drain(0..).into_iter() {
      self.evaluate(&dep_file_path)?;
    }

    Ok(())
  }

  fn evaluate(&mut self, file_path: &String) -> Result<(), &'static str>  {
    let dependency = self.dependency_graph.dependencies.get(file_path).unwrap();
    self.events.push(EngineEvent::Evaluated(Evaluated {
      file_path: file_path.clone(),
      node: runtime::evaluate(&dependency.expression, file_path, &self.dependency_graph, &js_virt::JsValue::JsObject(js_virt::JsObject::new()))?
    }));
    Ok(())
  }

  pub fn drain_events(&mut self) -> Vec<EngineEvent> {
    self.events.drain(0..).collect()
  }

  pub fn stop_runtime(&mut self, _file_path: String) {
    // self.open_files.push(file_path);
  }
}