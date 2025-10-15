"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import { FaSearch, FaPlus, FaChevronDown, FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import assignments from "../../../Database/assignments.json";
import { Assignment } from "../../../Database";

export default function Assignments() {
  const { cid } = useParams();
  
  // Filter assignments for the current course
  const courseAssignments = (assignments as Assignment[])
    .filter((assignment: Assignment) => assignment.course === cid);

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
        <div className="d-flex gap-2">
          <Button variant="secondary" className="text-nowrap">
            <FaPlus className="me-1" /> Group
          </Button>
          <Button variant="danger" className="text-nowrap">
            <FaPlus className="me-1" /> Assignment
          </Button>
        </div>
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
              <Link 
                href={`/Courses/${cid}/Assignments/${assignment._id}`}
                className="text-decoration-none text-dark"
              >
                <div className="d-flex align-items-start justify-content-between">
                  <div className="d-flex align-items-start flex-fill">
                    <BsGripVertical className="me-2 fs-3" />
                    <FaFileAlt className="me-2 fs-4 text-secondary mt-1" />
                    <div>
                      <div className="fw-bold fs-5 mb-1">{assignment.title}</div>
                      <div className="text-secondary">Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaCheckCircle className="me-2 fs-5 text-success" />
                    <IoEllipsisVertical className="fs-4 text-secondary" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
