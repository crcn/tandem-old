use crc::{crc32};

pub fn get_document_style_scope<'a>(uri: &String) -> String {

  let mut buff = uri.clone();

  if (!uri.starts_with("file://")) {
    buff = format!("file://{}", buff);
  }

  format!("{:x}", crc32::checksum_ieee(buff.as_bytes())).to_string()
}