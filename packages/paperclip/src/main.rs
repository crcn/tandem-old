enum Token {
    
    // <
    LessThan,

    // >
    GreaterThan,

    // />
    SelfClosingTag,

    // {{
    BlockOpen,

    // }}
    BlockClose,

    // "
    DoubleQuote,

    // '
    SingleQuote,

    // div, blay
    Word(String),
}

struct Tokenizer<'a> {
    source: &'a str,
    pos: i32
}

impl Tokenizer<'_> {
    fn next(self: &Self) {
        println!("{}!", self.source);
    }
    fn new<'a>(source: &'a str) -> Tokenizer {
        Tokenizer { source, pos: 0 }
    }
}

fn parse(source: &str) {
    let tokenizer = Tokenizer::new("<div />");
    tokenizer.next();
    println!("ok");
}


fn main() {
    parse("<div />");
}
