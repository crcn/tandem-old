// see https://github.com/paritytech/jsonrpc/blob/master/pubsub/more-examples/examples/pubsub_ws.rs

#[macro_use]
extern crate matches;

mod base;
mod css;
mod pc;
mod js;

use pc::runtime::graph::{DependencyGraph};
use js::runtime::virt::{JsObject, JsValue};

fn main() {

    /*
    let mut io = IoHandler::new();
	io.add_method("say_hello", |_params: Params| {
		Ok(Value::String("hello".to_string()))
	});

	let server = ServerBuilder::new(io)
		.threads(3)
		.start_http(&"127.0.0.1:3030".parse().unwrap())
		.unwrap();

    server.wait();
    */

    // // let mut f = File::open("test.pc");

    // let buffer = "<style></style> <div></div>".to_string();

    // // let mut buffer = String::new();
    // // // read the whole file
    // // f.unwrap().read_to_string(&mut buffer);

    // println!("---------------------------");
    // println!("Input: ");
    // println!("---------------------------");
    // println!("{}", buffer);
    // println!("---------------------------");

    // println!("OKOK");

    // // // let now = Instant::now();
    // let expr = pc::parser::parse(buffer.as_str()).unwrap();
    // println!("{:?}", &expr);
    // // // println!("micro seconds to parse: {}", now.elapsed().as_micros());


    // // // let now = Instant::now();
    // let result = pc::runtime::evaluate(&expr, &"something".to_string(), &DependencyGraph::new(), &JsValue::JsObject(JsObject::new())).unwrap().unwrap();

    // println!("{:?}", result);

    // // // println!("micro seconds to evaluate: {}", now.elapsed().as_micros());
    // // // println!("{}", result);
    // // let serialized = serde_json::to_string(&result).unwrap();

    // // println!("json: {}", serialized);
}
