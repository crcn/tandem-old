import List, { Item, styled } from "./index.pc";

const Div = styled("div");

export class EnhancedList extends React.Component {
  render() {
    return (
      <List>
        {this.props.items.map(item => (
          <Item>{item}</Item>
        ))}
        <Div />
      </List>
    );
  }
}
