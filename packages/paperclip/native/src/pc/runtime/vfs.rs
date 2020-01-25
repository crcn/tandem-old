use std::fs;
use std::io;
use std::collections::HashMap;

pub struct VirtualFileSystem {
  pub contents: HashMap<String, String>
}

fn insert_file_path(file_path: String, content: String, contents: &mut HashMap<String, String>) {
  contents.insert(file_path, content);
}

impl VirtualFileSystem {
  pub fn new() -> VirtualFileSystem {
    VirtualFileSystem {
      contents: HashMap::new()
    }
  }
  pub fn load(&mut self, file_path: &String) -> io::Result<&String> {
    if self.contents.contains_key(file_path) {
      return Ok(self.contents.get(file_path).unwrap());
    } else {
      return self.reload(file_path);
    }

  }

  pub fn update(&mut self, file_path: &String, content: &String) -> io::Result<String> {
    if self.contents.contains_key(file_path) {
      return Ok(self.contents.insert(file_path.to_string(), content.to_string()).unwrap());
    }
    return Ok("".to_string());
  }

  pub fn reload(&mut self, file_path: &String) -> io::Result<&String> {
    let content = fs::read_to_string(&file_path)?;
    insert_file_path(file_path.to_string(), content, &mut self.contents);
    Ok(self.contents.get(file_path).unwrap())
  }
}
