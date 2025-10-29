"use client";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { todos } = useSelector((state: any) => state.todosReducer);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables" className="mt-4">
      <h2>Array State Variable</h2>
      <button onClick={addElement} className="btn btn-success mb-2">
        Add Element
      </button>
      <ul className="list-group mb-4">
        {array.map((item, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {item}
            <button onClick={() => deleteElement(index)} className="btn btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
      <h3>Redux State Todos</h3>
      <ul className="list-group">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {todos.map((todo: any) => (
          <li key={todo.id} className="list-group-item">
            {todo.title}
          </li>
        ))}
      </ul>
      <hr/>
    </div>
  );
}

