"use client";
import { useSelector, useDispatch } from "react-redux";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";
import { addTodo, updateTodo, setTodo } from "./todosReducer";

export default function TodoForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { todo } = useSelector((state: any) => state.todosReducer);
  const dispatch = useDispatch();
  return (
    <ListGroupItem className="d-flex gap-2 align-items-center">
      <FormControl value={todo.title}
                   className="flex-grow-1"
                   onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}/>
      <Button onClick={() => dispatch(updateTodo(todo))}
              id="wd-update-todo-click"
              variant="warning"> Update </Button>
      <Button onClick={() => dispatch(addTodo(todo))}
              id="wd-add-todo-click"
              variant="success"> Add </Button>
    </ListGroupItem>
  );
}

