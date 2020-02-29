
import ListView, { TodoItem } from "./list.pc";
import React, { useState } from "react";

export default () => {
  const [todos, setTodos] = useState([
    createTodo("Wash car"),
    createTodo("Groceries"),
  ]);

  const onNewInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    if (event.key === "Enter" && value) {
      setTodos([...todos, createTodo(value)]);
      target.value = "";
    }
  };

  return <ListView
    onNewInputKeyPress={onNewInputKeyPress}
    todoItems={todos.map(todo => {
      return <TodoItem label={todo.label} key={todo.id}  />;
    })}
  />;
};

let _idCount = 0;
const createTodo = (label: string) => ({
  label,
  id: _idCount++
});