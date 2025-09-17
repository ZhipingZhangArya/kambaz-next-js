'use client';

import { usePathname } from 'next/navigation';

export default function AssignmentEditor() {
  const pathname = usePathname();
  const assignmentId = pathname.split('/').pop(); // Get the last part of the URL (assignment ID)
  
  // Map assignment IDs to their names and descriptions
  const getAssignmentData = (id: string) => {
    switch (id) {
      case '123':
        return {
          name: 'A1 - ENV + HTML',
          description: 'The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.'
        };
      case '124':
        return {
          name: 'A2 - CSS + BOOTSTRAP',
          description: 'Create a responsive web page using CSS and Bootstrap. Implement a mobile-first design with proper grid layout, navigation components, and custom styling. Include at least 3 different Bootstrap components and ensure the page looks good on all screen sizes.'
        };
      case '125':
        return {
          name: 'A3 - JAVASCRIPT + REACT',
          description: 'Build a React application with JavaScript functionality. Create interactive components, handle state management, and implement user interactions. Include forms, event handlers, and dynamic content rendering. Deploy the application to a hosting platform.'
        };
      case '126':
        return {
          name: 'A4 - STATE + REDUX',
          description: 'Implement state management using Redux in a React application. Create actions, reducers, and connect components to the Redux store. Handle complex state updates, middleware, and asynchronous operations. Demonstrate proper Redux patterns and best practices.'
        };
      case '127':
        return {
          name: 'A5 - NODE + SESSION',
          description: 'Develop a Node.js backend application with session management. Implement user authentication, session handling, and API endpoints. Use Express.js, middleware, and database integration. Include proper error handling and security measures.'
        };
      case '128':
        return {
          name: 'A6 - MONGO + MONGOOSE',
          description: 'Create a full-stack application with MongoDB and Mongoose. Design database schemas, implement CRUD operations, and handle data relationships. Include data validation, query optimization, and proper error handling. Deploy with a cloud database service.'
        };
      default:
        return {
          name: 'A1 - ENV + HTML',
          description: 'The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.'
        };
    }
  };
  
  const assignment = getAssignmentData(assignmentId || '123');
  
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <br />
      <input id="wd-name" defaultValue={assignment.name} /><br /><br />
      
      <textarea id="wd-description" 
          cols={40} 
          rows={8} 
          defaultValue={assignment.description} />
      <br />
      
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select id="wd-group">
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-display-grade-as">Display Grade as</label>
            </td>
            <td>
              <select id="wd-display-grade-as">
                <option value="Percentage">Percentage</option>
                <option value="Points">Points</option>
                <option value="Letter Grade">Letter Grade</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type" onChange={(e) => {
                const onlineOptions = document.getElementById('wd-online-options');
                if (onlineOptions) {
                  onlineOptions.style.display = e.target.value === 'Online' ? 'block' : 'none';
                }
              }}>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="On Paper">On Paper</option>
              </select>
              <br />
              <br />
              <div id="wd-online-options">
                Online Entry Options
                <br />
                <input type="checkbox" id="wd-text-entry" />
                <label htmlFor="wd-text-entry">Text Entry</label><br />
                <input type="checkbox" id="wd-website-url" />
                <label htmlFor="wd-website-url">Website URL</label><br />
                <input type="checkbox" id="wd-media-recordings" />
                <label htmlFor="wd-media-recordings">Media Recordings</label><br />
                <input type="checkbox" id="wd-student-annotation" />
                <label htmlFor="wd-student-annotation">Student Annotation</label><br />
                <input type="checkbox" id="wd-file-upload" />
                <label htmlFor="wd-file-upload">File Uploads</label>
              </div>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              Assign
            </td>
            <td>
              <div>
                <label htmlFor="wd-assign-to">Assign to</label><br />
                <input id="wd-assign-to" defaultValue="Everyone" /><br /><br />
                
                <label htmlFor="wd-due-date">Due</label><br />
                <input type="date" id="wd-due-date" defaultValue="2024-05-13" /><br /><br />
                
                <label htmlFor="wd-available-from">Available from</label>
                <label htmlFor="wd-available-until" style={{ marginLeft: '20px' }}>Until</label><br />
                <input type="date" id="wd-available-from" defaultValue="2024-05-06" />
                <input type="date" id="wd-available-until" defaultValue="2024-05-20" style={{ marginLeft: '5px' }} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <div style={{ textAlign: "right" }}>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </div>
  );
}
