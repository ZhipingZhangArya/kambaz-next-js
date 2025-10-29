"use client";
import { useDispatch } from "react-redux";
import { ListGroupItem, Button } from "react-bootstrap";
import { deleteTodo, setTodo } from "./todosReducer";

export default function TodoItem({ todo }: {
  todo: { id: string; title: string };
}) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem key={todo.id} className="d-flex gap-2 align-items-center">
      <span className="flex-grow-1">{todo.title}</span>
      <Button onClick={() => dispatch(setTodo(todo))}
              id="wd-set-todo-click"
              variant="primary"> Edit </Button>
      <Button onClick={() => dispatch(deleteTodo(todo.id))}
              id="wd-delete-todo-click"
              variant="danger"> Delete </Button>
    </ListGroupItem>
  );
}

