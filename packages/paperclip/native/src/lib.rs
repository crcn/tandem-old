#[macro_use]
extern crate matches;

mod pc;
mod css;
mod base;
mod js;

use neon::prelude::*;
use neon::register_module;

use pc::*;

fn parse(mut cx: FunctionContext) -> JsResult<JsValue> {

  let source = cx.argument::<JsString>(0)?.value();

  let expr = pc::parser::parse(source.as_str()).unwrap();

  let js_value = neon_serde::to_value(&mut cx, &expr)?;

  Ok(js_value)
}

register_module!(mut m, { m.export_function("parse", parse) });