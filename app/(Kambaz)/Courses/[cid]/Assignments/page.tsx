"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Modal } from "react-bootstrap";
import { FaSearch, FaPlus, FaChevronDown, FaFileAlt, FaCheckCircle, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { Assignment } from "../../../Database";
import { deleteAssignment } from "./reducer";

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<any>(null);
  
  // Check if current user is faculty
  const isFaculty = currentUser?.role === "FACULTY";
  
  // Filter assignments for the current course
  const courseAssignments = assignments.filter((assignment: any) => assignment.course === cid);
  
  const handleDeleteClick = (assignment: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAssignmentToDelete(assignment);
    setShowDeleteModal(true);
  };
  
  const handleDeleteConfirm = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete._id));
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

  return (
    <div id="wd-assignments">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-fill me-3">
          <div className="position-relative">
            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
            <Form.Control 
              type="text" 
              placeholder="Search for Assignment" 
              className="ps-5"
              style={{ border: '1px solid #dee2e6' }}
            />
          </div>
        </div>
        {isFaculty && (
          <div className="d-flex gap-2">
            <Button variant="secondary" className="text-nowrap">
              <FaPlus className="me-1" /> Group
            </Button>
            <Button 
              variant="danger" 
              className="text-nowrap"
              onClick={() => router.push(`/Courses/${cid}/Assignments/Editor`)}
            >
              <FaPlus className="me-1" /> Assignment
            </Button>
          </div>
        )}
      </div>

      {/* Assignments Section */}
      <div className="mb-4">
        <div className="bg-secondary p-3 ps-2 mb-0 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <FaChevronDown className="me-2 fs-5 text-dark" />
            <h5 className="mb-0 fw-bold text-dark">ASSIGNMENTS</h5>
          </div>
          <div className="d-flex align-items-center">
            <span className="bg-secondary border border-secondary rounded px-3 py-2 me-2 fs-6">40% of Total</span>
            <FaPlus className="me-2 fs-6 text-dark" />
            <IoEllipsisVertical className="me-2 fs-6 text-dark" />
          </div>
        </div>
        
        <div className="border border-top-0">
          {courseAssignments.map((assignment) => (
            <div key={assignment._id} className="border-bottom p-3" style={{ borderLeft: '3px solid green' }}>
              <div className="d-flex align-items-start justify-content-between">
                {isFaculty ? (
                  <Link 
                    href={`/Courses/${cid}/Assignments/Editor?aid=${assignment._id}`}
                    className="text-decoration-none text-dark d-flex align-items-start flex-fill"
                  >
                    <BsGripVertical className="me-2 fs-3" />
                    <FaFileAlt className="me-2 fs-4 text-secondary mt-1" />
                    <div>
                      <div className="fw-bold fs-5 mb-1">{assignment.title}</div>
                      <div className="text-secondary">
                        <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 6 at 12:00am
                        <br />
                        Due May 13 at 11:59pm | 100 pts
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="text-dark d-flex align-items-start flex-fill">
                    <BsGripVertical className="me-2 fs-3" />
                    <FaFileAlt className="me-2 fs-4 text-secondary mt-1" />
                    <div>
                      <div className="fw-bold fs-5 mb-1">{assignment.title}</div>
                      <div className="text-secondary">
                        <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 6 at 12:00am
                        <br />
                        Due May 13 at 11:59pm | 100 pts
                      </div>
                    </div>
                  </div>
                )}
                <div className="d-flex align-items-center">
                  <FaCheckCircle className="me-2 fs-5 text-success" />
                  {isFaculty && (
                    <button
                      onClick={(e) => handleDeleteClick(assignment, e)}
                      className="btn btn-link text-dark p-1"
                    >
                      <FaTrash />
                    </button>
                  )}
                  <IoEllipsisVertical className="fs-4 text-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this assignment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
