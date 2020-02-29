import { LabelInput, TodoLabel, Item } from "./item.pc";

export const ListItem = (props: Props) => {
  const [editing, setEditing] = useState(true);

  return (
    <Item>{editing ? <LabelInput /> : <TodoLabel label="something" />}</Item>
  );
};
