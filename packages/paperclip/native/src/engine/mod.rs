use std::collections::HashMap;
use crate::pc::{runtime};
use crate::pc::parser::{parse as parse_pc};
use crate::base::parser::{ParseError};
use crate::pc::ast as pc_ast;
use crate::pc::runtime::graph::{DependencyGraph, DependencyContent};
use crate::pc::runtime::vfs::{VirtualFileSystem};
use crate::pc::runtime::evaluator::{evaluate_document_styles, evaluate as evaluate_pc};
use crate::js::runtime::virt as js_virt;
use crate::base::runtime::{RuntimeError};
use serde::{Serialize};
use crate::pc::runtime::graph::{GraphError};
use crate::css::runtime::virt as css_vrt;

#[derive(Debug, PartialEq, Serialize)]
pub struct EvaluatedEvent {
  
  #[serde(rename = "filePath")]
  pub file_path: String,
  pub node: Option<runtime::virt::Node>
}

#[derive(Debug, PartialEq, Serialize)]
#[serde(tag = "errorKind")]
pub enum EngineError {
  Graph(GraphError),
  Parser(ParseError),
  Runtime(RuntimeError)
}

#[derive(Debug, PartialEq, Serialize)]
#[serde(tag = "kind")]
pub enum EngineEvent {
  Evaluated(EvaluatedEvent),
  Error(EngineError)
}

pub struct EvalOptions {
  part: Option<String>
}

async fn evaluate_content_styles(content: &String, file_path: &String) -> Result<css_vrt::CSSSheet, EngineError> {
  parse_pc(content)
  .map_err(|err| {
    EngineError::Parser(err)
  })
  .and_then(|node_ast| {
    evaluate_document_styles(&node_ast, file_path)
    .map_err(|err| {
      EngineError::Runtime(err)
    })
  })
}

pub struct Engine {
  events: Vec<EngineEvent>,
  pub vfs: VirtualFileSystem,
  pub dependency_graph: DependencyGraph,
  pub load_options: HashMap<String, EvalOptions>
}


impl Engine {
  pub fn new(http_path: Option<String>) -> Engine {
    Engine {
      vfs: VirtualFileSystem::new(http_path),
      dependency_graph: DependencyGraph::new(),
      events: vec![],
      load_options: HashMap::new()
    }
  }
  
  pub async fn load(&mut self, file_path: &String, part: Option<String>) -> Result<(), GraphError> {
    self.load_options.insert(file_path.to_string(), EvalOptions {
      part
    });

    self
    .reload(file_path)
    .await
  }


  pub async fn reload(&mut self, file_path: &String) -> Result<(), GraphError> {
    let load_result = self.dependency_graph.load_dependency(file_path, &mut self.vfs).await;
    if let Err(error) = load_result {
      self.events.push(EngineEvent::Error(EngineError::Graph(error.clone())));
      Err(error)
    } else {
      self.evaluate(file_path);
      Ok(())
    }
  }

  pub async fn parse_file(&mut self, file_path: &String) -> Result<pc_ast::Node, ParseError> {
    let content = self.vfs.reload(file_path).await.unwrap();
    parse_pc(content)
  }

  pub async fn parse_content(&mut self, content: &String) -> Result<pc_ast::Node, ParseError> {
    parse_pc(content)
  }

  pub async fn evaluate_file_styles(&mut self, file_path: &String) -> Result<css_vrt::CSSSheet, EngineError> {
    let content = self.vfs.reload(file_path).await.unwrap();
    evaluate_content_styles(content, file_path).await
  }

  pub async fn evaluate_content_styles(&mut self, content: &String, file_path: &String) -> Result<css_vrt::CSSSheet, EngineError> {
    evaluate_content_styles(content, file_path).await
  }

  pub async fn update_virtual_file_content(&mut self, file_path: &String, content: &String) -> Result<(), GraphError> {
    self.vfs.update(file_path, content).await;
    self.reload(file_path).await?;

    let mut dep_file_paths: Vec<String> = self.dependency_graph.flatten_dependents(file_path).into_iter().map(|dep| -> String {
      dep.file_path.to_string()
    }).collect();

    println!("UPDATE {}", file_path);
    println!("deps {:?}", dep_file_paths);

    for dep_file_path in dep_file_paths.drain(0..).into_iter() {
      self.reload(&dep_file_path).await?;
    }

    Ok(())
  }

  fn evaluate(&mut self, file_path: &String) {
    let dependency = self.dependency_graph.dependencies.get(file_path).unwrap();

    let event_option = match &dependency.content {
      DependencyContent::Node(node) => {
        let node_result = evaluate_pc(
          node, 
          file_path, 
          &self.dependency_graph, 
          &js_virt::JsValue::JsObject(js_virt::JsObject::new()),
          self.load_options.get(file_path).and_then(|options| {
            options.part.clone()
          })
        );

        match node_result {
          Ok(node) => Some(EngineEvent::Evaluated(EvaluatedEvent {
            file_path: file_path.clone(),
            node,
          })),
          Err(err) => Some(EngineEvent::Error(EngineError::Runtime(err)))
        }
      },
      _ => None
    };

    if let Some(event) = event_option {
      self.events.push(event);
    }
  }

  pub fn drain_events(&mut self) -> Vec<EngineEvent> {
    self.events.drain(0..).collect()
  }

  pub fn unload(&mut self, _file_path: String) {
    // self.open_files.push(file_path);
  }
}