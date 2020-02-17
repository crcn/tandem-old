use std::collections::HashMap;
// use curl::easy::Easy;

pub type FileReaderFn = dyn Fn(&String) -> String;
pub type FileResolverFn = dyn Fn(&String, &String) -> String;

#[allow(dead_code)]
pub struct VirtualFileSystem {
  read_file: Box<FileReaderFn>,
  resolve_file: Box<FileResolverFn>,
  http_path: Option<String>,
  pub contents: HashMap<String, String>
}

fn insert_content(uri: String, content: String, contents: &mut HashMap<String, String>) {
  contents.insert(uri, content);
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
  pub async fn load(&mut self, uri: &String) -> Result<&String, &'static str> {
    if self.contents.contains_key(uri) {
      Ok(self.contents.get(uri).unwrap())
    } else {
      self.reload(uri).await
    }
  }

  pub fn resolve(&self, from_path: &String, relative_path: &String) -> String {
    (self.resolve_file)(from_path, relative_path)
  }

  pub async fn update(&mut self, uri: &String, content: &String) -> Result<String, &'static str> {
    if !self.contents.contains_key(uri) {
      self.load(&uri).await?;
    }

    Ok(self.contents.insert(uri.to_string(), content.to_string()).unwrap())
  }

  pub async fn reload(&mut self, uri: &String) -> Result<&String, &'static str> {
    // let content = if let Some(http_path) = &self.http_path {
    //   let file_http_path = format!("{}{}", http_path, uri).to_string();
    //   let data = http_get(&file_http_path);
    //   data
    // } else {
    //   fs::read_to_string(&uri).or(Err("Unable to fetch text"))?
    // };
    let content = (self.read_file)(uri);
    // let content = fs::read_to_string(&uri).or(Err("Unable to fetch text"))?;
    
    insert_content(uri.to_string(), content, &mut self.contents);
    Ok(self.contents.get(uri).unwrap())
  }
}
