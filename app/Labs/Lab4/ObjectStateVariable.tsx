"use client";
import { useState } from "react";
import { FormControl } from "react-bootstrap";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Zhiping", age: 100 });
  return (
    <div id="wd-object-state-variables" className="mt-4">
      <h2>Object State Variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <FormControl
        className="mb-2"
        defaultValue={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
      />
      <FormControl
        defaultValue={person.age} type="number"
        onChange={(e) => setPerson({ ...person,
                                     age: parseInt(e.target.value) })}
      />
      <hr/>
    </div>
  );
}

