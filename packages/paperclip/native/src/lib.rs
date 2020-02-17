extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;


#[macro_use]
extern crate matches;

mod base;
mod css;
mod pc;
mod js;
mod engine;

use serde::{Deserialize, Serialize};
use std::env;
use ::futures::executor::block_on;
use engine::{Engine};

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub struct NativeEngine {
  target: Engine
}

#[wasm_bindgen]
impl NativeEngine {
    pub fn new(read_file: js_sys::Function, resolve_file: js_sys::Function) -> NativeEngine {


      NativeEngine {
        target: Engine::new(Box::new(move |file_path| {
          let this = JsValue::NULL;
          let arg = JsValue::from(file_path);
          read_file.call1(&this, &arg).unwrap().as_string().unwrap()
        }), Box::new(move |from_path, relative_path| {
          let this = JsValue::NULL;
          let arg = JsValue::from(from_path);
          let arg2 = JsValue::from(relative_path);
          resolve_file.call2(&this, &arg, &arg2).unwrap().as_string().unwrap()
        }), None)
      }
    }
    pub fn load(&mut self, file_path: String, part: Option<String>) {
      block_on(self.target.load(&file_path, part));
    }
    pub fn addListener(&mut self, listener: js_sys::Function) {
      self.target.addListener(Box::new(move |event| {
        let this = JsValue::NULL;
        let json = serde_json::to_string(&event).unwrap();
        let arg = JsValue::from(json);
        listener.call1(&this, &arg).unwrap();
      }));
    }
    pub fn evaluateContentStyles(&mut self, content: String, file_path: String) -> String {
      let result = block_on(self.target.evaluate_content_styles(&content, &file_path)).unwrap();
      serde_json::to_string(&result).unwrap()
    }
    pub fn evaluateFileStyles(&mut self, file_path: String) -> String {
      let result = block_on(self.target.evaluate_file_styles(&file_path)).unwrap();
      serde_json::to_string(&result).unwrap()
    }
    pub fn parseContent(&mut self, content: String, file_path: String) -> String {
      let result = block_on(self.target.parse_content(&content)).unwrap();
      serde_json::to_string(&result).unwrap()
    }
    pub fn parseFile(&mut self, file_path: String) -> String {
      let result = block_on(self.target.parse_file(&file_path)).unwrap();
      serde_json::to_string(&result).unwrap()
    }
    pub fn updateVirtualFileContent(&mut self, file_path: String, content: String) {
      block_on(self.target.update_virtual_file_content(&file_path, &content));
    }
}