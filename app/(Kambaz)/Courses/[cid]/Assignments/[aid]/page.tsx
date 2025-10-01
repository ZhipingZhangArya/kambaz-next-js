'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Form, Card, Button } from 'react-bootstrap';

export default function AssignmentEditor() {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const courseId = pathParts[2]; // Course ID
  const assignmentId = pathParts[4]; // Assignment ID
  const [showOnlineOptions, setShowOnlineOptions] = useState(true);
  
  // Map course and assignment IDs to their names and descriptions
  const getAssignmentData = (cid: string, aid: string) => {
    // Course-specific assignments
    if (cid === '1234') {
      switch (aid) {
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
      }
    } else if (cid === '2345') {
      switch (aid) {
        case '201':
          return {
            name: 'A1 - Node.js Setup',
            description: 'Set up a Node.js development environment. Install Node.js, npm, and configure your development tools. Create a basic Express server and test the setup with a simple "Hello World" endpoint.'
          };
        case '202':
          return {
            name: 'A2 - Express Server',
            description: 'Build a RESTful API using Express.js. Implement CRUD operations, middleware, error handling, and proper HTTP status codes. Include input validation and API documentation.'
          };
        case '203':
          return {
            name: 'A3 - REST API',
            description: 'Design and implement a comprehensive REST API. Include authentication, authorization, rate limiting, and API versioning. Test the API using Postman or similar tools.'
          };
        case '204':
          return {
            name: 'A4 - Authentication',
            description: 'Implement JWT-based authentication and authorization. Create user registration, login, password hashing, and protected routes. Include session management and security best practices.'
          };
      }
    } else if (cid === '3456') {
      switch (aid) {
        case '301':
          return {
            name: 'A1 - Database Design',
            description: 'Design a MongoDB database schema for a specific application. Create collections, define relationships, and implement proper indexing strategies. Document your design decisions.'
          };
        case '302':
          return {
            name: 'A2 - MongoDB Queries',
            description: 'Write complex MongoDB queries using aggregation pipelines. Implement filtering, sorting, grouping, and data transformation operations. Optimize query performance.'
          };
        case '303':
          return {
            name: 'A3 - Data Modeling',
            description: 'Implement advanced MongoDB data modeling techniques. Handle one-to-many and many-to-many relationships, implement data validation, and design for scalability.'
          };
        case '304':
          return {
            name: 'A4 - Performance Tuning',
            description: 'Optimize MongoDB database performance. Implement proper indexing, query optimization, and database monitoring. Analyze and improve slow queries.'
          };
      }
    }
    
    // Default fallback
    return {
      name: `A1 - Course ${cid} Assignment ${aid}`,
      description: `Assignment for Course ${cid}. Complete the requirements as specified in the course materials.`
    };
  };
  
  const assignment = getAssignmentData(courseId, assignmentId);
  
  return (
    <div id="wd-assignments-editor" className="container-fluid p-4">
      <Form.Group className="mb-4">
        <Form.Label className="fw-normal text-dark">Assignment Name</Form.Label>
        <Form.Control 
          type="text" 
          id="wd-name"
          defaultValue={assignment.name}
          className="border-secondary"
          style={{ fontSize: '16px', padding: '12px' }}
        />
      </Form.Group>
      
      <Card className="mb-4 border-secondary">
        <Card.Body className="p-3">
          <div className="text-dark" style={{ fontSize: '16px', lineHeight: '1.5' }}>
            {assignment.description.split('**').map((part, index) => {
              if (index % 2 === 1) {
                return <strong key={index} className="text-danger" style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>{part}</strong>;
              }
              return part;
            })}
          </div>
        </Card.Body>
      </Card>
      
      <div className="mb-3 d-flex align-items-center">
        <Form.Label className="fw-normal text-dark mb-0 me-3 text-end" style={{ minWidth: '150px' }}>Points</Form.Label>
        <Form.Control 
          type="number" 
          id="wd-points"
          defaultValue={100}
          className="border-secondary"
          style={{ fontSize: '16px', padding: '12px' }}
        />
      </div>

      <div className="mb-3 d-flex align-items-center">
        <Form.Label className="fw-normal text-dark mb-0 me-3 text-end" style={{ minWidth: '150px' }}>Assignment Group</Form.Label>
        <Form.Select 
          id="wd-group"
          className="border-secondary"
          style={{ fontSize: '16px', padding: '12px' }}
        >
          <option value="ASSIGNMENTS">ASSIGNMENTS</option>
          <option value="QUIZZES">QUIZZES</option>
          <option value="EXAMS">EXAMS</option>
          <option value="PROJECT">PROJECT</option>
        </Form.Select>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <Form.Label className="fw-normal text-dark mb-0 me-3 text-end" style={{ minWidth: '150px' }}>Display Grade as</Form.Label>
        <Form.Select 
          id="wd-display-grade-as"
          className="border-secondary"
          style={{ fontSize: '16px', padding: '12px' }}
        >
          <option value="Percentage">Percentage</option>
          <option value="Points">Points</option>
          <option value="Letter Grade">Letter Grade</option>
        </Form.Select>
      </div>

      <div className="mb-3 d-flex align-items-start">
        <Form.Label className="fw-normal text-dark mb-0 me-3 text-end" style={{ minWidth: '150px' }}>Submission Type</Form.Label>
        <div className="flex-fill border border-secondary rounded p-3" style={{ backgroundColor: 'white' }}>
          <Form.Select 
            id="wd-submission-type"
            className="border-secondary mb-3"
            style={{ fontSize: '16px', padding: '12px' }}
            defaultValue="Online"
            onChange={(e) => setShowOnlineOptions(e.target.value === 'Online')}
          >
            <option value="Online">Online</option>
            <option value="On Paper">On Paper</option>
            <option value="External Tool">External Tool</option>
            <option value="No Submission">No Submission</option>
          </Form.Select>
          
          {showOnlineOptions && (
            <div>
              <div className="fw-bold text-dark mb-2">Online Entry Options</div>
              <div>
                <Form.Check
                  type="checkbox"
                  id="wd-text-entry"
                  label="Text Entry"
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-website-url"
                  label="Website URL"
                  defaultChecked
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-media-recordings"
                  label="Media Recordings"
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-student-annotation"
                  label="Student Annotation"
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  id="wd-file-uploads"
                  label="File Uploads"
                  className="mb-2"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 d-flex align-items-start">
        <Form.Label className="fw-normal text-dark mb-0 me-3 text-end" style={{ minWidth: '150px' }}>Assign</Form.Label>
        <div className="flex-fill border border-secondary rounded p-3" style={{ backgroundColor: 'white' }}>
          <div className="mb-3">
            <div className="fw-bold text-dark mb-2">Assign to</div>
            <Form.Control
              type="text"
              defaultValue="Everyone"
              className="border-secondary"
              style={{ fontSize: '16px', padding: '12px' }}
            />
          </div>
          
          <div className="mb-3">
            <div className="fw-bold text-dark mb-2">Due</div>
            <Form.Control
              type="datetime-local"
              defaultValue="2024-05-13T23:59"
              className="border-secondary"
              style={{ fontSize: '16px', padding: '12px' }}
            />
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="fw-bold text-dark mb-2">Available from</div>
              <Form.Control
                type="datetime-local"
                defaultValue="2024-05-06T00:00"
                className="border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </div>
            <div className="col-6">
              <div className="fw-bold text-dark mb-2">Until</div>
              <Form.Control
                type="datetime-local"
                className="border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" className="px-4 py-2">
          Cancel
        </Button>
        <Button variant="danger" className="px-4 py-2">
          Save
        </Button>
      </div>
    </div>
  );
}
