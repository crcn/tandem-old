#[macro_use]
extern crate matches;
extern crate neon_serde;

mod pc;
mod css;
mod base;
mod js;
mod engine;

use neon::prelude::*;
use neon::{declare_types, register_module};
use engine::{Engine};

declare_types! {
  pub class JsPaperclipEngine as PaperclipEngine for Engine {
    init(_) {
      Ok(Engine::new())
    }

    method startRuntime(mut cx) {
      let file_path: String = cx.argument::<JsString>(0)?.value();
      let mut this = cx.this();

      cx.borrow_mut(&mut this, |mut engine| {
        engine.start_runtime(file_path);
      });
      
      Ok(cx.undefined().upcast())
    }

    method updateVirtualFileContent(mut cx) {
      let file_path: String = cx.argument::<JsString>(0)?.value();
      let content: String = cx.argument::<JsString>(1)?.value();
      let mut this = cx.this();

      cx.borrow_mut(&mut this, |mut engine| {
        engine.update_virtual_file_content(file_path, content);
      });
      
      Ok(cx.undefined().upcast())
    }
    
    method drainEvents(mut cx) {

      let mut this = cx.this();

      let events = cx.borrow_mut(&mut this, |mut engine| {
        engine.drain_events()
      });

      let js_events = JsArray::new(&mut cx, events.len() as u32);
      for (i, value) in events.iter().enumerate() {
        let js_value = neon_serde::to_value(&mut cx, &value).unwrap();
        js_events.set(&mut cx, i as u32, js_value).unwrap();
      }

      // let file_path: String = cx.argument::<JsString>(0)?.value();
      // let this = cx.this();
      Ok(js_events.upcast())
    }
    method stopRuntime(mut cx)  {
      // let file_path: String = cx.argument::<JsString>(0)?.value();
      // let this = cx.this();
      Ok(cx.boolean(true).upcast())
    }

    method panic(_) {
      panic!("User.prototype.panic")
    }
  }
}

register_module!(mut m, { m.export_class::<JsPaperclipEngine>("Engine") });