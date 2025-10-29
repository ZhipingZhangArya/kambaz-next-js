"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl, Form } from "react-bootstrap";
import { addAssignment, updateAssignment } from "./reducer";

export default function AssignmentEditor() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const aid = searchParams.get('aid');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  
  // Check if we're in edit mode (aid exists)
  const isEditMode = !!aid;
  
  // Find existing assignment if editing
  const existingAssignment = aid ? assignments.find((a: any) => a._id === aid && a.course === cid) : null;
  
  const [assignment, setAssignment] = useState({
    _id: "",
    title: "",
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    availableUntil: "",
    course: cid as string,
  });
  
  useEffect(() => {
    if (isEditMode && existingAssignment) {
      setAssignment({
        _id: existingAssignment._id,
        title: existingAssignment.title || "",
        description: existingAssignment.description || "",
        points: existingAssignment.points || 100,
        dueDate: existingAssignment.dueDate || "",
        availableDate: existingAssignment.availableDate || "",
        availableUntil: existingAssignment.availableUntil || "",
        course: existingAssignment.course,
      });
    }
  }, [isEditMode, existingAssignment]);
  
  const handleSave = () => {
    if (isEditMode) {
      // Update existing assignment
      dispatch(updateAssignment(assignment));
    } else {
      // Create new assignment
      const newAssignment = {
        ...assignment,
        course: cid,
      };
      dispatch(addAssignment(newAssignment));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };
  
  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };
  
  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <label className="form-label fw-normal text-dark">Assignment Name</label>
        <FormControl
          type="text"
          id="wd-name"
          placeholder="New Assignment"
          value={assignment.title}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          className="border-secondary"
          style={{ fontSize: '16px', padding: '12px' }}
        />
      </div>
      
      <div className="mb-4">
        <label className="form-label fw-normal text-dark">New Assignment Description</label>
        <FormControl
          as="textarea"
          rows={5}
          id="wd-description"
          placeholder="Assignment Description"
          value={assignment.description}
          onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          className="border-secondary"
          style={{ fontSize: '16px', padding: '12px' }}
        />
      </div>
      
      <div className="mb-3 d-flex align-items-center">
        <label className="form-label fw-normal text-dark mb-0 me-3 text-end" style={{ minWidth: '150px' }}>Points</label>
        <FormControl
          type="number"
          id="wd-points"
          value={assignment.points}
          onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })}
          className="border-secondary"
          style={{ fontSize: '16px', padding: '12px' }}
        />
      </div>

      <div className="mb-3 d-flex align-items-start">
        <label className="form-label fw-normal text-dark mb-0 me-3 text-end" style={{ minWidth: '150px' }}>Assign</label>
        <div className="flex-fill border border-secondary rounded p-3" style={{ backgroundColor: 'white' }}>
          <div className="mb-3">
            <div className="mb-2">
              <label className="fw-bold text-dark mb-0">Due</label>
            </div>
            <FormControl
              type="datetime-local"
              value={assignment.dueDate}
              onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
              className="border-secondary"
              style={{ fontSize: '16px', padding: '12px' }}
            />
          </div>
          
          <div className="row">
            <div className="col-6">
              <div className="fw-bold text-dark mb-2">Available from</div>
              <FormControl
                type="datetime-local"
                value={assignment.availableDate}
                onChange={(e) => setAssignment({ ...assignment, availableDate: e.target.value })}
                className="border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </div>
            <div className="col-6">
              <div className="fw-bold text-dark mb-2">Until</div>
              <FormControl
                type="datetime-local"
                value={assignment.availableUntil}
                onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
                className="border-secondary"
                style={{ fontSize: '16px', padding: '12px' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="secondary" onClick={handleCancel} className="px-4 py-2">
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave} className="px-4 py-2">
          Save
        </Button>
      </div>
    </div>
  );
}

