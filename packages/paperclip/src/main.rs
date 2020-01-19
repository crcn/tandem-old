#[macro_use]
extern crate matches;

mod parser;


fn main() {

    let expr = parser::parse("
        <import src='ok' style='color: blue;' />
        {{a + 5}}
    ").unwrap();

    println!("{}", expr.to_string());
}
