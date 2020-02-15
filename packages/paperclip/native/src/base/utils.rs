use std::path::Path;
use path_abs::{PathAbs};

pub fn resolve(curr_file: &String, relative_file: &String) -> String {
  let curr_path = Path::new(curr_file);
  let curr_dir = curr_path.parent().unwrap();
  let full_path = curr_dir.join(relative_file.as_str()).to_str().unwrap().to_string();
  PathAbs::new(&full_path).unwrap().as_path().to_str().unwrap().to_string()
}