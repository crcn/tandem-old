#[macro_use]
extern crate matches;

mod parser;


fn main() {
    parser::parse("<div />");
}
