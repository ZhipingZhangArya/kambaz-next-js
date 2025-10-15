'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import assignments from '../../../../Database/assignments.json';
import { Assignment } from '../../../../Database';
import CustomDatePicker from './CustomDatePicker';

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const [showOnlineOptions, setShowOnlineOptions] = useState(true);
  
  // Find the assignment from the database
  const assignment = (assignments as Assignment[])
    .find((a: Assignment) => a._id === aid && a.course === cid);
  
  // Default assignment data if not found
  const defaultAssignment = {
    _id: aid as string,
    title: `Assignment ${aid}`,
    course: cid as string,
    description: 'Complete the assignment requirements as specified in the course materials.',
    points: 100,
    dueDate: '2024-05-13T23:59',
    availableDate: '2024-05-06T00:00'
  };
  
  const currentAssignment = assignment || defaultAssignment;
  
  return (
    <div id="wd-assignments-editor" className="container-fluid p-4">
      <Form.Group className="mb-4">
        <Form.Label className="fw-normal text-dark">Assignment Name</Form.Label>
        <Form.Control 
          type="text" 
          id="wd-name"
          defaultValue={currentAssignment.title}
          className="border-secondary"
          style={{ fontSize: '16px', padding: '12px' }}
        />
      </Form.Group>
      
      <Card className="mb-4 border-secondary">
        <Card.Body className="p-3">
          <div className="text-dark" style={{ fontSize: '16px', lineHeight: '1.5' }}>
            {currentAssignment.description}
          </div>
        </Card.Body>
      </Card>
      
      <div className="mb-3 d-flex align-items-center">
        <Form.Label className="fw-normal text-dark mb-0 me-3 text-end" style={{ minWidth: '150px' }}>Points</Form.Label>
        <Form.Control 
          type="number" 
          id="wd-points"
          defaultValue={currentAssignment.points}
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
            <CustomDatePicker
              defaultValue={currentAssignment.dueDate}
              className="border-secondary"
              style={{ fontSize: '16px', padding: '12px' }}
            />
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="fw-bold text-dark mb-2">Available from</div>
              <CustomDatePicker
                defaultValue={currentAssignment.availableDate}
                className="border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </div>
            <div className="col-6">
              <div className="fw-bold text-dark mb-2">Until</div>
              <CustomDatePicker
                className="border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="secondary" className="px-4 py-2">
            Cancel
          </Button>
        </Link>
        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="danger" className="px-4 py-2">
            Save
          </Button>
        </Link>
      </div>
    </div>
  );
}
