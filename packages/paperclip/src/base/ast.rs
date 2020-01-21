
#[derive(Debug, PartialEq)]
pub struct Location {
  pub start: usize,
  pub length: usize,
}

#[derive(Debug, PartialEq)]
pub struct Expression<TItem> {
  // TODO - location: Location
  pub item: TItem
}