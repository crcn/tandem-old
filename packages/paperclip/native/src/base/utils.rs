use std::path::Path;
// use path_abs::{PathAbs};
use ::to_absolute::to_absolute;
use std::path::PathBuf;
use std::path::Component;

pub fn resolve(curr_file: &String, relative_file: &String) -> String {
  let curr_path = Path::new(curr_file);
  let curr_dir = curr_path.parent().unwrap();
  return relative_file.to_string();
  // return to_absolute(curr_dir.to_str().unwrap(), relative_file.as_str()).unwrap().to_str().unwrap().to_string();

  // let full_path = curr_dir.join(relative_file.as_str()).to_str().unwrap().to_string();
  // PathAbs::new(&full_path).unwrap().as_path().to_str().unwrap().to_string()
}

// fn normalize(p: &Path) -> PathBuf {
//     let mut stack: Vec<Component> = vec![];

//     // We assume .components() removes redundant consecutive path separators.
//     // Note that .components() also does some normalization of '.' on its own anyways.
//     // This '.' normalization happens to be compatible with the approach below.
//     for component in p.components() {
//       match component {

//       }
//     }


//     let mut norm_path = PathBuf::new();

//     // for item in &stack {
//     //     norm_path.push(item.as_ref());
//     // }

//     norm_path
// }