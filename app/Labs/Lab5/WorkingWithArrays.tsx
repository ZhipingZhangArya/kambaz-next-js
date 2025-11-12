"use client";

import { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithArrays() {
  const API = `${HTTP_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({
    id: "1",
    title: "Task 1",
    description: "Description",
    completed: false,
  });

  return (
    <div id="wd-working-with-arrays" className="mt-3">
      <h3>Working with Arrays</h3>

      <section className="mb-4">
        <h4>Retrieving Arrays</h4>
        <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
          Get Todos
        </a>
        <div className="mt-3">
          <h5>Filtering Array Items</h5>
          <a
            id="wd-retrieve-completed-todos"
            className="btn btn-secondary"
            href={`${API}?completed=true`}
          >
            Get Completed Todos
          </a>
        </div>
      </section>

      <section className="mb-4">
        <h4>Creating new Items in an Array</h4>
        <a
          id="wd-create-todo"
          className="btn btn-primary"
          href={`${API}/create`}
        >
          Create Todo
        </a>
      </section>

      <section className="mb-4">
        <h4>Retrieving an Item from an Array by ID</h4>
        <a
          id="wd-retrieve-todo-by-id"
          className="btn btn-primary float-end"
          href={`${API}/${todo.id}`}
        >
          Get Todo by ID
        </a>
        <FormControl
          id="wd-todo-id"
          className="w-50"
          value={todo.id}
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
      </section>

      <section className="mb-4">
        <h4>Updating an Item in an Array</h4>
        <a
          id="wd-update-todo"
          className="btn btn-outline-primary float-end"
          href={`${API}/${todo.id}/title/${encodeURIComponent(todo.title)}`}
        >
          Update Todo
        </a>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <FormControl
            id="wd-update-todo-id"
            className="w-25"
            value={todo.id}
            onChange={(e) => setTodo({ ...todo, id: e.target.value })}
          />
          <FormControl
            id="wd-update-todo-title"
            className="w-50"
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          />
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
          <FormControl
            as="textarea"
            rows={2}
            id="wd-update-todo-description"
            className="w-50"
            value={todo.description}
            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          />
          <a
            id="wd-update-todo-description"
            className="btn btn-outline-success"
            href={`${API}/${todo.id}/description/${encodeURIComponent(todo.description)}`}
          >
            Update Description
          </a>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
          <FormControl
            id="wd-update-todo-completed-state"
            className="d-none"
            value={todo.completed ? "true" : "false"}
            readOnly
          />
          <div className="form-check">
            <input
              id="wd-update-todo-completed"
              className="form-check-input"
              type="checkbox"
              checked={todo.completed}
              onChange={(e) =>
                setTodo({ ...todo, completed: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="wd-update-todo-completed">
              Completed
            </label>
          </div>
          <a
            id="wd-update-todo-completed-link"
            className="btn btn-outline-warning"
            href={`${API}/${todo.id}/completed/${todo.completed}`}
          >
            Update Completed
          </a>
        </div>
      </section>

      <section className="mb-4">
        <h4>Removing from an Array</h4>
        <a
          id="wd-remove-todo"
          className="btn btn-danger float-end"
          href={`${API}/${todo.id}/delete`}
        >
          Remove Todo with ID = {todo.id}
        </a>
        <FormControl
          className="w-50"
          value={todo.id}
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
      </section>

      <hr />
    </div>
  );
}
