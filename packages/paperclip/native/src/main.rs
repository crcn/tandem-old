// see https://github.com/paritytech/jsonrpc/blob/master/pubsub/more-examples/examples/pubsub_ws.rs

#[macro_use]
extern crate matches;

mod base;
mod css;
mod pc;
mod js;

use std::sync::Arc;
use std::{thread, time};

use pc::runtime::graph::{DependencyGraph};
use js::runtime::virt::{JsObject, JsValue};
use jsonrpc_core::*;
use jsonrpc_ipc_server::ServerBuilder;
use jsonrpc_ipc_server::jsonrpc_core::*;

use jsonrpc_core::futures::Future;

fn main() {
	let mut io = IoHandler::new();
	io.add_method("say_hello", |_params| {
		Ok(Value::String("hello world".into()))
	});

	let builder = ServerBuilder::new(io);
	let server = builder.start("/tmp/json-ipc-test.ipc").expect("Couldn't open socket");
	server.wait();
}
