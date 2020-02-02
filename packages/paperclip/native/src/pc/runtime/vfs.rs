use std::fs;
use std::collections::HashMap;
use curl::easy::Easy;

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
  pub async fn load(&mut self, file_path: &String) -> Result<&String, &'static str> {
    if self.contents.contains_key(file_path) {
      Ok(self.contents.get(file_path).unwrap())
    } else {
      self.reload(file_path).await
    }
  }

  pub async fn update(&mut self, file_path: &String, content: &String) -> Result<String, &'static str> {
    if !self.contents.contains_key(file_path) {
      self.load(&file_path).await?;
    }

    Ok(self.contents.insert(file_path.to_string(), content.to_string()).unwrap())
  }

  pub async fn reload(&mut self, file_path: &String) -> Result<&String, &'static str> {
    let content = if let Some(http_path) = &self.http_path {
      let file_http_path = format!("{}{}", http_path, file_path).to_string();
      let data = http_get(&file_http_path);
      data
    } else {
      fs::read_to_string(&file_path).or(Err("Unable to fetch text"))?
    };
    
    insert_file_path(file_path.to_string(), content, &mut self.contents);
    Ok(self.contents.get(file_path).unwrap())
  }
}


fn http_get(url: &String) -> String {
  let mut buffer = Vec::new();
  let mut handle = Easy::new();
  handle.url(url).unwrap();
  {
      let mut transfer = handle.transfer();
      transfer.write_function(|data| {
          buffer.extend_from_slice(data);
          Ok(data.len())
      }).unwrap();
      transfer.perform().unwrap();
  }
  String::from_utf8(buffer.to_vec()).unwrap()
}