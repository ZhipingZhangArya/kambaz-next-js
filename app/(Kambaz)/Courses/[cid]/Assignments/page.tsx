import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import { FaSearch, FaPlus, FaChevronDown, FaFileAlt, FaCheckCircle } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";

interface AssignmentsProps {
  params: Promise<{ cid: string }>;
}

export default async function Assignments({ params }: AssignmentsProps) {
  const { cid } = await params;
  
  // Course-specific assignments based on course ID
  const getCourseAssignments = (courseId: string) => {
    switch (courseId) {
      case '1234':
        return [
          { id: '123', title: 'A1', description: 'Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts' },
          { id: '124', title: 'A2', description: 'Multiple Modules | Not available until May 13 at 12:00am | Due May 20 at 11:59pm | 100 pts' },
          { id: '125', title: 'A3', description: 'Multiple Modules | Not available until May 20 at 12:00am | Due May 27 at 11:59pm | 100 pts' },
          { id: '126', title: 'A4', description: 'Multiple Modules | Not available until May 27 at 12:00am | Due Jun 3 at 11:59pm | 100 pts' },
          { id: '127', title: 'A5', description: 'Multiple Modules | Not available until Jun 3 at 12:00am | Due Jun 10 at 11:59pm | 100 pts' }
        ];
      case '2345':
        return [
          { id: '201', title: 'A1', description: 'Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts' },
          { id: '202', title: 'A2', description: 'Multiple Modules | Not available until May 13 at 12:00am | Due May 20 at 11:59pm | 100 pts' },
          { id: '203', title: 'A3', description: 'Multiple Modules | Not available until May 20 at 12:00am | Due May 27 at 11:59pm | 100 pts' },
          { id: '204', title: 'A4', description: 'Multiple Modules | Not available until May 27 at 12:00am | Due Jun 3 at 11:59pm | 100 pts' }
        ];
      case '3456':
        return [
          { id: '301', title: 'A1', description: 'Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts' },
          { id: '302', title: 'A2', description: 'Multiple Modules | Not available until May 13 at 12:00am | Due May 20 at 11:59pm | 100 pts' },
          { id: '303', title: 'A3', description: 'Multiple Modules | Not available until May 20 at 12:00am | Due May 27 at 11:59pm | 100 pts' },
          { id: '304', title: 'A4', description: 'Multiple Modules | Not available until May 27 at 12:00am | Due Jun 3 at 11:59pm | 100 pts' }
        ];
      default:
        return [
          { id: '001', title: 'A1', description: 'Multiple Modules | Not available until May 6 at 12:00am | Due May 13 at 11:59pm | 100 pts' },
          { id: '002', title: 'A2', description: 'Multiple Modules | Not available until May 13 at 12:00am | Due May 20 at 11:59pm | 100 pts' }
        ];
    }
  };

  const assignments = getCourseAssignments(cid);

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
          {assignments.map((assignment, index) => (
            <div key={assignment.id} className="border-bottom p-3" style={{ borderLeft: '3px solid green' }}>
              <Link 
                href={`/Courses/${cid}/Assignments/${assignment.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="d-flex align-items-start justify-content-between">
                  <div className="d-flex align-items-start flex-fill">
                    <BsGripVertical className="me-2 fs-3" />
                    <FaFileAlt className="me-2 fs-4 text-secondary mt-1" />
                    <div>
                      <div className="fw-bold fs-5 mb-1">{assignment.title}</div>
                      <div className="text-secondary">{assignment.description}</div>
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
