use serde::{Serialize};

#[derive(Debug, PartialEq, Serialize)]
pub struct Location {
  pub start: usize,
  pub length: usize,
}


// TODO - change to trait
#[derive(Debug, PartialEq, Serialize)]
pub struct Expression<TItem> {
  // TODO - location: Location
  pub item: TItem
}