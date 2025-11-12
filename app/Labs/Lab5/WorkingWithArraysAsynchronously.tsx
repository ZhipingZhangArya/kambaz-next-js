"use client";

import { useEffect, useState } from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizeTodos = (todos: any[]) =>
    todos.map((todo) => ({ ...todo, editing: todo.editing ?? false }));

  const fetchTodos = async () => {
    try {
      const todos = await client.fetchTodos();
      setTodos(normalizeTodos(todos));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? "Unable to fetch todos");
    }
  };

  const createNewTodo = async () => {
    try {
      const todos = await client.createNewTodo();
      setTodos(normalizeTodos(todos));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? "Unable to create todo");
    }
  };

  const postNewTodo = async () => {
    try {
      const newTodo = await client.postNewTodo({
        title: "New Posted Todo",
        completed: false,
      });
      setTodos((prevTodos) => [...prevTodos, { ...newTodo, editing: false }]);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? "Unable to post todo");
    }
  };

  const removeTodo = async (todo: any) => {
    try {
      const updatedTodos = await client.removeTodo(todo);
      setTodos(normalizeTodos(updatedTodos));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? "Unable to remove todo");
    }
  };

  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo);
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? "Unable to delete todo");
    }
  };

  const editTodo = (todo: any) => {
    setErrorMessage(null);
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todo.id ? { ...t, editing: true } : t
      )
    );
  };

  const updateTodo = async (updatedTodo: any) => {
    const { editing, ...payload } = updatedTodo;
    try {
      await client.updateTodo(payload);
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === updatedTodo.id
            ? { ...t, ...payload, editing: editing ?? false }
            : t
        )
      );
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? "Unable to update todo");
    }
  };

  const updateTodoTitleLocally = (todo: any, title: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todo.id ? { ...t, title } : t
      )
    );
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div id="wd-asynchronous-arrays" className="mt-3">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (
        <div
          id="wd-todo-error-message"
          className="alert alert-danger mb-2 mt-2"
        >
          {errorMessage}
        </div>
      )}
      <h4>
        Todos
        <FaPlusCircle
          id="wd-create-todo"
          onClick={createNewTodo}
          className="text-success float-end fs-3"
          role="button"
        />
        <FaPlusCircle
          id="wd-post-todo"
          onClick={postNewTodo}
          className="text-primary float-end fs-3 me-3"
          role="button"
        />
      </h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id}>
            <div className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={todo.completed ?? false}
                onChange={(e) =>
                  updateTodo({ ...todo, completed: e.target.checked })
                }
              />
              {!todo.editing ? (
                <span
                  className="flex-grow-1"
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.title}
                </span>
              ) : (
                <FormControl
                  className="flex-grow-1"
                  value={todo.title || ""}
                  onChange={(e) => updateTodoTitleLocally(todo, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const newTitle = (e.target as HTMLInputElement).value;
                      updateTodo({ ...todo, title: newTitle, editing: false });
                    }
                  }}
                />
              )}
              <FaPencil
                onClick={() => editTodo(todo)}
                className="text-primary fs-5"
                id="wd-edit-todo"
                role="button"
              />
              <TiDelete
                onClick={() => deleteTodo(todo)}
                className="text-danger fs-3"
                id="wd-delete-todo"
                role="button"
              />
              <FaTrash
                onClick={() => removeTodo(todo)}
                className="text-danger"
                id="wd-remove-todo"
                role="button"
              />
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
