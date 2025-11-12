"use client";

import { useState } from "react";
import { FormCheck, FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [module, setModule] = useState({
    id: "MOD-101",
    name: "Introduction to Express",
    description: "Implement basic REST endpoints with Express.js",
    course: "CS5610",
  });

  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects" className="mt-3">
      <h3>Working With Objects</h3>

      <section className="mb-4">
        <h4>Retrieving Assignment</h4>
        <a
          id="wd-retrieve-assignments"
          className="btn btn-primary me-2"
          href={ASSIGNMENT_API_URL}
        >
          Get Assignment
        </a>
        <a
          id="wd-retrieve-assignment-title"
          className="btn btn-secondary"
          href={`${ASSIGNMENT_API_URL}/title`}
        >
          Get Title
        </a>
      </section>

      <section className="mb-4">
        <h4>Modifying Assignment</h4>
        <div className="mb-3">
          <label htmlFor="wd-assignment-title" className="form-label">
            Title
          </label>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <FormControl
              className="w-auto"
              id="wd-assignment-title"
              value={assignment.title}
              onChange={(e) =>
                setAssignment({ ...assignment, title: e.target.value })
              }
            />
            <a
              id="wd-update-assignment-title"
              className="btn btn-success"
              href={`${ASSIGNMENT_API_URL}/title/${encodeURIComponent(assignment.title)}`}
            >
              Update Title
            </a>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="wd-assignment-score" className="form-label">
            Score
          </label>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <FormControl
              className="w-auto"
              id="wd-assignment-score"
              type="number"
              value={assignment.score}
              onChange={(e) =>
                setAssignment({ ...assignment, score: Number(e.target.value) })
              }
            />
            <a
              id="wd-update-assignment-score"
              className="btn btn-outline-primary"
              href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
            >
              Update Score
            </a>
          </div>
        </div>

        <div className="mb-3">
          <FormCheck
            id="wd-assignment-completed"
            type="checkbox"
            label="Completed"
            checked={assignment.completed}
            onChange={(e) =>
              setAssignment({ ...assignment, completed: e.target.checked })
            }
          />
          <a
            id="wd-update-assignment-completed"
            className="btn btn-outline-secondary mt-2"
            href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
          >
            Update Completed
          </a>
        </div>
      </section>

      <hr />

      <section className="mb-4">
        <h4>Retrieving Module</h4>
        <a
          id="wd-retrieve-module"
          className="btn btn-primary me-2"
          href={MODULE_API_URL}
        >
          Get Module
        </a>
        <a
          id="wd-retrieve-module-name"
          className="btn btn-secondary"
          href={`${MODULE_API_URL}/name`}
        >
          Get Module Name
        </a>
      </section>

      <section>
        <h4>Modifying Module</h4>
        <div className="mb-3">
          <label htmlFor="wd-module-name" className="form-label">
            Module Name
          </label>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <FormControl
              className="w-auto"
              id="wd-module-name"
              value={module.name}
              onChange={(e) => setModule({ ...module, name: e.target.value })}
            />
            <a
              id="wd-update-module-name"
              className="btn btn-success"
              href={`${MODULE_API_URL}/name/${encodeURIComponent(module.name)}`}
            >
              Update Module Name
            </a>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="wd-module-description" className="form-label">
            Module Description
          </label>
          <div className="d-flex gap-2 align-items-start flex-wrap">
            <FormControl
              as="textarea"
              rows={3}
              className="w-50"
              id="wd-module-description"
              value={module.description}
              onChange={(e) =>
                setModule({ ...module, description: e.target.value })
              }
            />
            <a
              id="wd-update-module-description"
              className="btn btn-outline-success"
              href={`${MODULE_API_URL}/description/${encodeURIComponent(module.description)}`}
            >
              Update Module Description
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
