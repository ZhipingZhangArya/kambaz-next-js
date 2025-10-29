"use client";
import { useState } from "react";
import { FormControl } from "react-bootstrap";

export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("Zhiping");
  return (
    <div id="wd-string-state-variables" className="mt-4">
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <FormControl
        defaultValue={firstName}
        onChange={(e) => setFirstName(e.target.value)}/>
      <hr/>
    </div>
  );
}

