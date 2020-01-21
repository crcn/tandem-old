/*



*/

trait Disposable {
  pub fn terminate();
}

pub struct Bridge {
}

impl Disposable for Bridge {
  pub fn terminate() {

  }
}

impl for Bridge {
  pub fn new() {
    Bridge { }
  }
}
