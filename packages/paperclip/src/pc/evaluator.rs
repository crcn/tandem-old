use super::ast;
use super::virt;

pub fn evaluate<'a>(node_expr: &ast::Expression<ast::Node<'a>>) -> Result<Option<virt::Node<'a>>, &'static str>  {
  evaluate_node(node_expr)
}

fn evaluate_node<'a>(node_expr: &ast::Expression<ast::Node<'a>>) -> Result<Option<virt::Node<'a>>, &'static str> {
  match &node_expr.item {
    ast::Node::Element(el) => {
      evaluate_element(&el)
    },
    ast::Node::StyleElement(el) => {
      evaluate_style_element(&el)
    },
    ast::Node::Text(text) => {
      Ok(Some(virt::Node::Text(virt::Text { value: &text })))
    },
    ast::Node::Slot(value) => {
      Ok(Some(virt::Node::Text(virt::Text { value: &value })))
    },
    ast::Node::Fragment(el) => {
      evaluate_fragment(&el)
    },
    _ => {
      Err("Not found")
    }
  }
}
fn evaluate_element<'a>(element: &ast::Element<'a>) -> Result<Option<virt::Node<'a>>, &'static str> {
  match element.tag_name {
    "import" => evaluate_import_element(element),
    _ => evaluate_basic_element(element)
  }
}

fn evaluate_basic_element<'a>(element: &ast::Element<'a>) -> Result<Option<virt::Node<'a>>, &'static str> {
  
  let mut attributes = vec![];

  for attrExpr in &element.attributes {
    let attr = &attrExpr.item;

    let value;

    if attr.value == None {
      value = None;
    } else {
      value = evaluate_attribute_value(&attr.value.as_ref().unwrap().item)?;
    }
    attributes.push(virt::Attribute {
      name: attr.name, 
      value,
    });
  }

  let children = evaluate_children(&element.children)?;


  Ok(Some(virt::Node::Element(virt::Element {
    tag_name: element.tag_name,
    attributes,
    children
  })))
}

fn evaluate_import_element<'a>(element: &ast::Element<'a>) -> Result<Option<virt::Node<'a>>, &'static str> {

  // TODO - import into context
  Ok(None)
}

fn evaluate_style_element<'a>(element: &ast::StyleElement<'a>) -> Result<Option<virt::Node<'a>>, &'static str> {
  Ok(None)
}
  

fn evaluate_children<'a>(children_expr: &Vec<ast::Expression<ast::Node<'a>>>) -> Result<Vec<virt::Node<'a>>, &'static str> {
  
  let mut children: Vec<virt::Node<'a>> = vec![];

  for child_expr in children_expr {
    match evaluate_node(child_expr)? {
      Some(c) => { children.push(c); },
      None => { }
    }
  }

  Ok(children)
}

fn evaluate_fragment<'a>(fragment: &ast::Fragment<'a>) -> Result<Option<virt::Node<'a>>, &'static str> {
  Ok(Some(virt::Node::Fragment(virt::Fragment {
    children: evaluate_children(&fragment.children)?
  })))
}

fn evaluate_attribute_value<'a>(value: &ast::AttributeValue<'a>) -> Result<Option<&'a str>, &'static str> {
  match value {
    ast::AttributeValue::String(st) => {
      Ok(Some(st.value))
    }
  }
}
