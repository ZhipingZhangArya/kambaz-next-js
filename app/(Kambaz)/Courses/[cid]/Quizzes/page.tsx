"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Modal, Dropdown } from "react-bootstrap";
import { 
  FaSearch, 
  FaPlus, 
  FaChevronDown, 
  FaRocket, 
  FaCheckCircle, 
  FaTrash, 
  FaPencilAlt,
  FaBan,
  FaEllipsisV,
  FaEye,
  FaCopy,
  FaSort
} from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { setQuizzes, deleteQuiz, updateQuiz, addQuiz } from "./reducer";
import * as client from "./client";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [isStudentView, setIsStudentView] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if current user is faculty
  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";
  
  // Show faculty controls only if faculty AND not in student view mode
  const showFacultyControls = isFaculty && !isStudentView;

  // Filter quizzes for current course
  const courseQuizzes = quizzes
    .filter((quiz: any) => quiz.course === cid)
    .filter((quiz: any) => {
      // In student view or for actual students, only show published quizzes
      if (!showFacultyControls) {
        return quiz.published;
      }
      return true;
    })
    .filter((quiz: any) => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const fetchQuizzes = async () => {
    if (!cid) {
      dispatch(setQuizzes([]));
      return;
    }
    setIsLoading(true);
    try {
      console.log("[Quizzes] Fetching quizzes for course:", cid);
      const data = await client.findQuizzesForCourse(cid as string);
      console.log("[Quizzes] Received quizzes:", data?.length || 0);
      dispatch(setQuizzes(data || []));
      setError(null);
    } catch (err: any) {
      console.error("[Quizzes] Error fetching quizzes", err);
      setError("Unable to load quizzes.");
      dispatch(setQuizzes([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  // Get quiz availability status
  const getQuizStatus = (quiz: any) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;
    const dueDate = quiz.dueDate ? new Date(quiz.dueDate) : null;

    // Not available until - if current date is before Available Date
    if (availableDate && now < availableDate) {
      return {
        status: "Not available until",
        date: availableDate,
        showDate: true,
        className: ""
      };
    }
    
    // Closed - if current date is after Available Until Date
    if (availableUntil && now > availableUntil) {
      return {
        status: "Closed",
        date: null,
        showDate: false,
        className: ""
      };
    }
    
    // Available - if current date is between Available Date and Available Until Date
    return {
      status: "Available",
      date: null,
      showDate: false,
      className: ""
    };
  };

  // Format date for display (e.g., "Sep 21 at 1pm")
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Multiple Dates";
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;
    const minuteStr = minute > 0 ? `:${minute.toString().padStart(2, "0")}` : "";
    return `${month} ${day} at ${hour12}${minuteStr}${ampm}`;
  };

  // Handle add new quiz - navigate to editor
  const handleAddQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/new/Editor`);
  };

  // Old handleAddQuiz - kept for reference but not used
  const handleAddQuizOld = async () => {
    try {
      const newQuiz = {
        title: "New Quiz",
        description: "New Quiz Description",
        quizType: "Graded Quiz",
        points: 100,
        numberOfQuestions: 0,
        published: false,
        timeLimit: 20,
        multipleAttempts: false,
        attemptsAllowed: 1,
        shuffleAnswers: true,
        showCorrectAnswers: false,
        accessCode: "",
        assignmentGroup: "Quizzes",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        availableDate: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
      };
      
      const createdQuiz = await client.createQuiz(cid as string, newQuiz);
      dispatch(addQuiz(createdQuiz));
      router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}`);
    } catch (err) {
      console.error("Error creating quiz", err);
      setError("Unable to create quiz.");
    }
  };

  // Handle delete
  const handleDeleteClick = (quiz: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (quizToDelete) {
      try {
        await client.deleteQuiz(quizToDelete._id);
        dispatch(deleteQuiz(quizToDelete._id));
        setShowDeleteModal(false);
        setQuizToDelete(null);
      } catch (err) {
        console.error("Error deleting quiz", err);
        setError("Unable to delete quiz.");
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setQuizToDelete(null);
  };

  // Handle publish toggle
  const handleTogglePublish = async (quiz: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updatedQuiz = await client.togglePublishQuiz(quiz._id);
      dispatch(updateQuiz(updatedQuiz));
    } catch (err) {
      console.error("Error toggling publish", err);
      setError("Unable to update quiz.");
    }
  };

  // Handle edit
  const handleEdit = (quiz: any) => {
    router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Editor`);
  };

  // Handle create new quiz
  const handleCreateQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/new/Editor`);
  };

  return (
    <div id="wd-quizzes" className="position-relative">
      {/* Student View Toggle - positioned at top right */}
      {isFaculty && (
        <div className="position-absolute" style={{ top: "-50px", right: "0" }}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setIsStudentView(!isStudentView)}
          >
            <FaEye className="me-1" />
            {isStudentView ? "Faculty View" : "Student View"}
          </Button>
        </div>
      )}

      {/* Search and Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-fill me-3" style={{ maxWidth: "300px" }}>
          <div className="position-relative">
            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
            <Form.Control
              type="text"
              placeholder="Search for Quiz"
              className="ps-5"
              style={{ border: "1px solid #dee2e6" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {showFacultyControls && (
          <div className="d-flex gap-2">
            <Button
              variant="danger"
              className="text-nowrap"
              onClick={handleAddQuiz}
            >
              <FaPlus className="me-1" /> Quiz
            </Button>
            <Button variant="outline-secondary">
              <IoEllipsisVertical />
            </Button>
          </div>
        )}
      </div>

      {/* Quiz List */}
      <div className="mb-4">
        {/* Assignment Quizzes Header */}
        <div 
          className="bg-light p-3 ps-2 mb-0 d-flex align-items-center justify-content-between"
          style={{ borderBottom: "1px solid #dee2e6" }}
        >
          <div className="d-flex align-items-center">
            <FaChevronDown className="me-2 text-dark" />
            <h5 className="mb-0 fw-bold text-dark">Assignment Quizzes</h5>
          </div>
        </div>

        {/* Quiz Items */}
        <div className="border border-top-0">
          {isLoading && (
            <div className="p-4 text-muted text-center">Loading quizzes...</div>
          )}
          {error && !isLoading && (
            <div className="p-4 text-danger text-center">{error}</div>
          )}
          
          {/* Empty State Message */}
          {!isLoading && !error && courseQuizzes.length === 0 && (
            <div className="p-5 text-center">
              <FaRocket className="text-secondary mb-3" style={{ fontSize: "3rem" }} />
              <p className="text-muted mb-3">
                No quizzes available yet.
                {showFacultyControls && (
                  <span> Click the <strong className="text-danger">+ Quiz</strong> button to create your first quiz.</span>
                )}
              </p>
              {showFacultyControls && (
                <Button variant="danger" onClick={handleAddQuiz}>
                  <FaPlus className="me-1" /> Quiz
                </Button>
              )}
            </div>
          )}
          
          {courseQuizzes.map((quiz: any) => {
            const status = getQuizStatus(quiz);
            
            return (
              <div 
                key={quiz._id} 
                className="border-bottom p-3 d-flex align-items-center"
                style={{ borderLeft: "4px solid #198754" }}
              >
                {/* Quiz Icon */}
                <div className="me-3">
                  <FaRocket className="text-success fs-4" />
                </div>

                {/* Quiz Info */}
                <div className="flex-grow-1">
                  {/* Quiz Title - Clickable for both faculty (edit) and students (take quiz) */}
                  <div className="fw-bold fs-5 mb-1">
                    <Link
                      href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                      className="text-dark text-decoration-none"
                    >
                      {quiz.title}
                    </Link>
                  </div>
                  
                  {/* Quiz Details */}
                  <div className="text-secondary small">
                    {/* Availability Status */}
                    <span className={status.className}>
                      <strong>{status.status}</strong>
                      {status.showDate && status.date && (
                        <span> {formatDate(status.date.toISOString())}</span>
                      )}
                    </span>
                    
                    {" | "}
                    
                    {/* Due Date */}
                    <strong>Due</strong>{" "}
                    {quiz.dueDate ? (
                      formatDate(quiz.dueDate)
                    ) : (
                      <span className="text-danger">Multiple Dates</span>
                    )}
                    
                    {" | "}
                    
                    {/* Points */}
                    {quiz.points} pts
                    
                    {" | "}
                    
                    {/* Number of Questions */}
                    {quiz.numberOfQuestions} Questions
                    
                    {/* Score - for students only (placeholder) */}
                    {isStudent && !isStudentView && (
                      <>
                        {" | "}
                        <span>Score: --</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex align-items-center gap-2">
                  {/* Published/Unpublished Status Indicator */}
                  {showFacultyControls && (
                    <button
                      onClick={(e) => handleTogglePublish(quiz, e)}
                      className="btn btn-link p-0"
                      title={quiz.published ? "Click to unpublish" : "Click to publish"}
                    >
                      {quiz.published ? (
                        <FaCheckCircle className="text-success fs-5" />
                      ) : (
                        <FaBan className="text-secondary fs-5" />
                      )}
                    </button>
                  )}

                  {/* Three-dot Context Menu (Faculty only) */}
                  {showFacultyControls && (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="link"
                        className="text-dark p-0"
                        id={`dropdown-${quiz._id}`}
                      >
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* Edit */}
                        <Dropdown.Item onClick={() => handleEdit(quiz)}>
                          <FaPencilAlt className="me-2" /> Edit
                        </Dropdown.Item>
                        
                        {/* Delete */}
                        <Dropdown.Item onClick={(e: any) => handleDeleteClick(quiz, e)}>
                          <FaTrash className="me-2" /> Delete
                        </Dropdown.Item>
                        
                        {/* Publish/Unpublish */}
                        <Dropdown.Item onClick={(e: any) => handleTogglePublish(quiz, e)}>
                          {quiz.published ? (
                            <>
                              <FaBan className="me-2" /> Unpublish
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="me-2" /> Publish
                            </>
                          )}
                        </Dropdown.Item>
                        
                        <Dropdown.Divider />
                        
                        {/* Copy (Optional) */}
                        <Dropdown.Item disabled>
                          <FaCopy className="me-2" /> Copy
                        </Dropdown.Item>
                        
                        {/* Sort (Optional) */}
                        <Dropdown.Item disabled>
                          <FaSort className="me-2" /> Sort
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the quiz &quot;{quizToDelete?.title}&quot;?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
