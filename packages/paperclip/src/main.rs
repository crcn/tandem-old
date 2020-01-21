#[macro_use]
extern crate matches;

mod base;
mod css;
mod pc;


fn main() {

    let expr = pc::parser::parse("
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
    let result = pc::evaluator::evaluate(&expr).unwrap().unwrap();
    println!("{}", result);
}
