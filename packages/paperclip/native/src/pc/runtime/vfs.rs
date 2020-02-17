use std::fs;
use std::collections::HashMap;
// use curl::easy::Easy;

pub type FileReaderFn = Fn(&String) -> String;
pub type FileResolverFn = Fn(&String, &String) -> String;

#[allow(dead_code)]
pub struct VirtualFileSystem {
  read_file: Box<FileReaderFn>,
  resolve_file: Box<FileResolverFn>,
  http_path: Option<String>,
  pub contents: HashMap<String, String>
}


fn insert_file_path(file_path: String, content: String, contents: &mut HashMap<String, String>) {
  contents.insert(file_path, content);
}

#[allow(dead_code)]
impl VirtualFileSystem {
  pub fn new(read_file: Box<FileReaderFn>, resolve_file: Box<FileResolverFn>, http_path: Option<String>) -> VirtualFileSystem {
    VirtualFileSystem {
      read_file,
      http_path,
      resolve_file,
      contents: HashMap::new()
    }
  }
  pub async fn load(&mut self, file_path: &String) -> Result<&String, &'static str> {
    if self.contents.contains_key(file_path) {
      Ok(self.contents.get(file_path).unwrap())
    } else {
      self.reload(file_path).await
    }
  }

  pub fn resolve(&self, from_path: &String, relative_path: &String) -> String {
    (self.resolve_file)(from_path, relative_path)
  }

  pub async fn update(&mut self, file_path: &String, content: &String) -> Result<String, &'static str> {
    if !self.contents.contains_key(file_path) {
      self.load(&file_path).await?;
    }

    Ok(self.contents.insert(file_path.to_string(), content.to_string()).unwrap())
  }

  pub async fn reload(&mut self, file_path: &String) -> Result<&String, &'static str> {
    // let content = if let Some(http_path) = &self.http_path {
    //   let file_http_path = format!("{}{}", http_path, file_path).to_string();
    //   let data = http_get(&file_http_path);
    //   data
    // } else {
    //   fs::read_to_string(&file_path).or(Err("Unable to fetch text"))?
    // };
    let content = (self.read_file)(file_path);
    // let content = fs::read_to_string(&file_path).or(Err("Unable to fetch text"))?;
    
    insert_file_path(file_path.to_string(), content, &mut self.contents);
    Ok(self.contents.get(file_path).unwrap())
  }
}
