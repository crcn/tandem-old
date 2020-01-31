
use std::io;
use std::fs;
use std::collections::HashMap;

#[allow(dead_code)]
pub struct VirtualFileSystem {
  http_path: Option<String>,
  pub contents: HashMap<String, String>
}

fn insert_file_path(file_path: String, content: String, contents: &mut HashMap<String, String>) {
  contents.insert(file_path, content);
}

#[allow(dead_code)]
impl VirtualFileSystem {
  pub fn new(http_path: Option<String>) -> VirtualFileSystem {
    VirtualFileSystem {
      http_path,
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
    if !self.contents.contains_key(file_path) {
      self.load(&file_path)?;
    }

    Ok(self.contents.insert(file_path.to_string(), content.to_string()).unwrap())
  }

  pub fn reload(&mut self, file_path: &String) -> io::Result<&String> {
    // let content = if let Some(http_path) = self.http_path {
    //   let file_http_path = format!("{}{}", http_path, file_path).to_string();
    // } else {
    // };

    let content =fs::read_to_string(&file_path)?;
    
    insert_file_path(file_path.to_string(), content, &mut self.contents);
    Ok(self.contents.get(file_path).unwrap())
  }
}
