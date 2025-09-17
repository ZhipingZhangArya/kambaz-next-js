export default function Assignments() {
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments"
             id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button>
      </h3>
      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <a href="/Courses/1234/Assignments/123"
             className="wd-assignment-link">
            A1 - ENV + HTML
          </a>
          <br />
          Multiple Modules | <strong>Not available until</strong> May 6 at 12:00am | <strong>Due</strong> May 13 at 11:59pm | 100 pts
        </li>
        <li className="wd-assignment-list-item">
          <a href="/Courses/1234/Assignments/124"
             className="wd-assignment-link">
            A2 - CSS + BOOTSTRAP
          </a>
          <br />
          Multiple Modules | <strong>Not available until</strong> May 13 at 12:00am | <strong>Due</strong> May 20 at 11:59pm | 100 pts
        </li>
        <li className="wd-assignment-list-item">
          <a href="/Courses/1234/Assignments/125"
             className="wd-assignment-link">
            A3 - JAVASCRIPT + REACT
          </a>
          <br />
          Multiple Modules | <strong>Not available until</strong> May 20 at 12:00am | <strong>Due</strong> May 27 at 11:59pm | 100 pts
        </li>
        <li className="wd-assignment-list-item">
          <a href="/Courses/1234/Assignments/126"
             className="wd-assignment-link">
            A4 - STATE + REDUX
          </a>
          <br />
          Multiple Modules | <strong>Not available until</strong> May 27 at 12:00am | <strong>Due</strong> June 3 at 11:59pm | 100 pts
        </li>
        <li className="wd-assignment-list-item">
          <a href="/Courses/1234/Assignments/127"
             className="wd-assignment-link">
            A5 - NODE + SESSION
          </a>
          <br />
          Multiple Modules | <strong>Not available until</strong> June 3 at 12:00am | <strong>Due</strong> June 10 at 11:59pm | 100 pts
        </li>
        <li className="wd-assignment-list-item">
          <a href="/Courses/1234/Assignments/128"
             className="wd-assignment-link">
            A6 - MONGO + MONGOOSE
          </a>
          <br />
          Multiple Modules | <strong>Not available until</strong> June 10 at 12:00am | <strong>Due</strong> June 17 at 11:59pm | 100 pts
        </li>
      </ul>
    </div>
  );
}
