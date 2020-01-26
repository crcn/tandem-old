#[macro_use]
extern crate matches;

mod base;
mod css;
mod pc;
mod js;

use pc::runtime::graph::{DependencyGraph};
use js::runtime::virt::{JsObject};

fn main() {

    // let mut f = File::open("test.pc");

    let buffer = "<style></style> <div></div>".to_string();

    // let mut buffer = String::new();
    // // read the whole file
    // f.unwrap().read_to_string(&mut buffer);

    println!("---------------------------");
    println!("Input: ");
    println!("---------------------------");
    println!("{}", buffer);
    println!("---------------------------");

    println!("OKOK");

    // // let now = Instant::now();
    let expr = pc::parser::parse(buffer.as_str()).unwrap();
    println!("{:?}", &expr);
    // // println!("micro seconds to parse: {}", now.elapsed().as_micros());


    // // let now = Instant::now();
    let result = pc::runtime::evaluate(&expr, &"something".to_string(), &DependencyGraph::new(), &JsObject::new()).unwrap().unwrap();

    println!("{:?}", result);

    // // println!("micro seconds to evaluate: {}", now.elapsed().as_micros());
    // // println!("{}", result);
    // let serialized = serde_json::to_string(&result).unwrap();

    // println!("json: {}", serialized);
}
