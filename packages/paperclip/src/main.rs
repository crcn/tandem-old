#[macro_use]
extern crate matches;

mod base_parser;
mod css_parser;
mod parser;


fn main() {

    let expr = parser::parse("
        <import src='ok' style='color: blue;' />
        <div>
            something like this
            <style>
                div {
                    color: red;
                }
                bore {
                    color: blue;
                }
            </style>
        </div>
        {{a + 5}}
    ").unwrap();

    println!("{}", expr.to_string());
}
