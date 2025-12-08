"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form, Nav, Tab } from "react-bootstrap";
import { FaBan, FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import CustomDatePicker from "../../../Assignments/[aid]/CustomDatePicker";
import RichTextEditor from "./RichTextEditor";
import * as client from "../../client";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);

  const isFaculty = currentUser?.role === "FACULTY";

  // Initialize quiz state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quizType: "Graded Quiz",
    points: 0,
    assignmentGroup: "Quizzes",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    attemptsAllowed: 1,
    showCorrectAnswers: false,
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "",
    availableDate: "",
    availableUntil: "",
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid || qid === "new") {
        // New quiz - use defaults
        setLoading(false);
        return;
      }
      
      try {
        const data = await client.findQuizById(qid as string);
        setQuiz(data);
        // Populate form with existing quiz data
        setFormData({
          title: data.title || "",
          description: data.description || "",
          quizType: data.quizType || "Graded Quiz",
          points: data.points || 0,
          assignmentGroup: data.assignmentGroup || "Quizzes",
          shuffleAnswers: data.shuffleAnswers !== false,
          timeLimit: data.timeLimit || 20,
          multipleAttempts: data.multipleAttempts || false,
          attemptsAllowed: data.attemptsAllowed ?? (data.multipleAttempts ? 2 : 1),
          showCorrectAnswers: data.showCorrectAnswers || false,
          accessCode: data.accessCode || "",
          oneQuestionAtATime: data.oneQuestionAtATime !== false,
          webcamRequired: data.webcamRequired || false,
          lockQuestionsAfterAnswering: data.lockQuestionsAfterAnswering || false,
          dueDate: data.dueDate || "",
          availableDate: data.availableDate || "",
          availableUntil: data.availableUntil || data.dueDate || "",
        });
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [qid]);

  const handleSave = async (publish: boolean = false) => {
    if (!isFaculty) return;
    
    setIsSaving(true);
    try {
      const quizData: any = {
        course: cid as string,
        title: formData.title || "Unnamed Quiz",
        description: formData.description,
        quizType: formData.quizType,
        points: formData.points,
        assignmentGroup: formData.assignmentGroup,
        shuffleAnswers: formData.shuffleAnswers,
        timeLimit: formData.timeLimit,
        multipleAttempts: formData.multipleAttempts,
        attemptsAllowed: formData.multipleAttempts ? (formData.attemptsAllowed || 2) : 1,
        showCorrectAnswers: formData.showCorrectAnswers,
        accessCode: formData.accessCode,
        oneQuestionAtATime: formData.oneQuestionAtATime,
        webcamRequired: formData.webcamRequired,
        lockQuestionsAfterAnswering: formData.lockQuestionsAfterAnswering,
        dueDate: formData.dueDate,
        availableDate: formData.availableDate,
        availableUntil: formData.availableUntil,
      };

      let savedQuiz;
      if (qid && qid !== "new") {
        // Update existing quiz
        quizData._id = qid as string;
        savedQuiz = await client.updateQuiz(quizData);
        // Toggle publish if needed
        if (publish && !quiz?.published) {
          await client.togglePublishQuiz(qid as string);
        } else if (!publish && quiz?.published) {
          // If saving without publish and it was published, keep it published
          // (do nothing)
        }
      } else {
        // Create new quiz
        savedQuiz = await client.createQuiz(cid as string, quizData);
        if (publish) {
          await client.togglePublishQuiz(savedQuiz._id);
        }
      }

      if (publish) {
        router.push(`/Courses/${cid}/Quizzes`);
      } else {
        router.push(`/Courses/${cid}/Quizzes/${savedQuiz._id || qid}`);
      }
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert("Unable to save quiz. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-muted">Loading quiz editor...</div>
      </div>
    );
  }

  if (!isFaculty) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">Only faculty can edit quizzes.</div>
      </div>
    );
  }

  return (
    <div id="wd-quiz-editor" className="p-4">
      {/* Header with Points, Published Status, and Menu */}
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <div className="text-muted">
          Points {formData.points}
        </div>
        <div className="d-flex align-items-center text-muted">
          {quiz?.published ? (
            <>
              <FaCheckCircle className="text-success me-2" />
              Published
            </>
          ) : (
            <>
              <FaBan className="me-2" />
              Not Published
            </>
          )}
        </div>
        <Button variant="link" className="text-dark p-0">
          <FaEllipsisV />
        </Button>
      </div>

      {/* Tabs */}
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === "details"}
            onClick={() => setActiveTab("details")}
            className={activeTab === "details" ? "bg-light text-dark" : "text-danger"}
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "questions"}
            onClick={() => {
              const quizId = qid === "new" ? undefined : qid;
              if (quizId) {
                router.push(`/Courses/${cid}/Quizzes/${quizId}/Editor/Questions`);
              } else {
                alert("Please save the quiz first before adding questions.");
              }
            }}
            className={activeTab === "questions" ? "bg-light text-dark" : "text-danger"}
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tab Content */}
      <Tab.Container activeKey={activeTab}>
        <Tab.Content>
          {/* Details Tab */}
          <Tab.Pane eventKey="details">
            <Form>
              {/* Title */}
              <Form.Group className="mb-4">
                <Form.Control
                  type="text"
                  placeholder="Unnamed Quiz"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-secondary"
                  style={{ fontSize: "16px", padding: "12px" }}
                />
              </Form.Group>

              {/* Description - Rich Text Editor */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold mb-2">Quiz Instructions:</Form.Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  placeholder="Enter quiz instructions..."
                />
              </Form.Group>

              {/* Quiz Type */}
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="fw-bold mb-0 me-3 text-end" style={{ minWidth: "200px" }}>
                  Quiz Type:
                </Form.Label>
                <Form.Select
                  value={formData.quizType}
                  onChange={(e) => setFormData({ ...formData, quizType: e.target.value })}
                  className="border-secondary"
                  style={{ fontSize: "16px", padding: "12px" }}
                >
                  <option value="Graded Quiz">Graded Quiz</option>
                  <option value="Practice Quiz">Practice Quiz</option>
                  <option value="Graded Survey">Graded Survey</option>
                  <option value="Ungraded Survey">Ungraded Survey</option>
                </Form.Select>
              </Form.Group>

              {/* Points */}
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="fw-bold mb-0 me-3 text-end" style={{ minWidth: "200px" }}>
                  Points:
                </Form.Label>
                <Form.Control
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                  className="border-secondary"
                  style={{ fontSize: "16px", padding: "12px" }}
                />
              </Form.Group>

              {/* Assignment Group */}
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="fw-bold mb-0 me-3 text-end" style={{ minWidth: "200px" }}>
                  Assignment Group:
                </Form.Label>
                <Form.Select
                  value={formData.assignmentGroup}
                  onChange={(e) => setFormData({ ...formData, assignmentGroup: e.target.value })}
                  className="border-secondary"
                  style={{ fontSize: "16px", padding: "12px" }}
                >
                  <option value="Quizzes">Quizzes</option>
                  <option value="Exams">Exams</option>
                  <option value="Assignments">Assignments</option>
                  <option value="Project">Project</option>
                </Form.Select>
              </Form.Group>

              {/* Show Correct Answers */}
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="fw-bold mb-0 me-3 text-end" style={{ minWidth: "200px" }}>
                  Show Correct Answers:
                </Form.Label>
                <Form.Select
                  value={formData.showCorrectAnswers ? "Yes" : "No"}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    showCorrectAnswers: e.target.value === "Yes" 
                  })}
                  className="border-secondary"
                  style={{ fontSize: "16px", padding: "12px" }}
                >
                  <option value="No">Never</option>
                  <option value="Yes">Immediately</option>
                </Form.Select>
              </Form.Group>

              {/* Access Code */}
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Label className="fw-bold mb-0 me-3 text-end" style={{ minWidth: "200px" }}>
                  Access Code:
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                  placeholder="(blank)"
                  className="border-secondary"
                  style={{ fontSize: "16px", padding: "12px" }}
                />
              </Form.Group>

              {/* Options Section */}
              <div className="mb-4">
                <div className="d-flex mb-3">
                  <div style={{ width: "200px", marginRight: "12px" }}></div>
                  <div className="flex-grow-1">
                    <Form.Label className="fw-bold mb-0">Options:</Form.Label>
                  </div>
                </div>
                <div className="d-flex">
                  <div style={{ width: "200px", marginRight: "12px" }}></div>
                  <div className="flex-grow-1">
                    {/* Shuffle Answers */}
                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        id="shuffle-answers"
                        checked={formData.shuffleAnswers}
                        onChange={(e) => setFormData({ ...formData, shuffleAnswers: e.target.checked })}
                        className="me-2"
                      />
                      <Form.Label htmlFor="shuffle-answers" className="mb-0">
                        Shuffle Answers
                      </Form.Label>
                    </Form.Group>

                    {/* Time Limit */}
                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        id="time-limit"
                        checked={formData.timeLimit > 0}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          timeLimit: e.target.checked ? 20 : 0 
                        })}
                        className="me-2"
                      />
                      <Form.Label htmlFor="time-limit" className="mb-0 me-2">
                        Time Limit
                      </Form.Label>
                      {formData.timeLimit > 0 && (
                        <>
                          <Form.Control
                            type="number"
                            value={formData.timeLimit}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              timeLimit: parseInt(e.target.value) || 0 
                            })}
                            className="border-secondary me-2"
                            style={{ width: "100px", fontSize: "16px", padding: "12px" }}
                          />
                          <span>Minutes</span>
                        </>
                      )}
                    </Form.Group>

                    {/* Multiple Attempts */}
                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        id="multiple-attempts"
                        checked={formData.multipleAttempts}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          multipleAttempts: e.target.checked,
                          attemptsAllowed: e.target.checked ? (formData.attemptsAllowed === 1 ? 2 : (formData.attemptsAllowed || 2)) : 1
                        })}
                        className="me-2"
                      />
                      <Form.Label htmlFor="multiple-attempts" className="mb-0">
                        Allow Multiple Attempts
                      </Form.Label>
                    </Form.Group>

                    {/* How Many Attempts - Only show if Multiple Attempts is enabled */}
                    {formData.multipleAttempts && (
                      <Form.Group className="mb-3 d-flex align-items-center">
                        <Form.Label className="fw-bold mb-0 me-3 text-end" style={{ minWidth: "200px" }}>
                          How Many Attempts:
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={formData.attemptsAllowed}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            attemptsAllowed: parseInt(e.target.value) || 1 
                          })}
                          className="border-secondary"
                          style={{ fontSize: "16px", padding: "12px", maxWidth: "200px" }}
                        />
                      </Form.Group>
                    )}

                    {/* One Question at a Time */}
                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        id="one-question"
                        checked={formData.oneQuestionAtATime}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          oneQuestionAtATime: e.target.checked 
                        })}
                        className="me-2"
                      />
                      <Form.Label htmlFor="one-question" className="mb-0">
                        One Question at a Time
                      </Form.Label>
                    </Form.Group>

                    {/* Webcam Required */}
                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        id="webcam-required"
                        checked={formData.webcamRequired}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          webcamRequired: e.target.checked 
                        })}
                        className="me-2"
                      />
                      <Form.Label htmlFor="webcam-required" className="mb-0">
                        Webcam Required
                      </Form.Label>
                    </Form.Group>

                    {/* Lock Questions After Answering */}
                    <Form.Group className="mb-3 d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        id="lock-questions"
                        checked={formData.lockQuestionsAfterAnswering}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          lockQuestionsAfterAnswering: e.target.checked 
                        })}
                        className="me-2"
                      />
                      <Form.Label htmlFor="lock-questions" className="mb-0">
                        Lock Questions After Answering
                      </Form.Label>
                    </Form.Group>
                  </div>
                </div>
              </div>

              {/* Assign Section */}
              <div className="mb-4 d-flex align-items-start">
                <Form.Label className="fw-bold mb-0 me-3 text-end" style={{ minWidth: "200px", paddingTop: "8px" }}>
                  Assign:
                </Form.Label>
                <div className="flex-fill border border-secondary rounded p-3" style={{ backgroundColor: 'white' }}>
                  {/* Assigned to */}
                  <div className="mb-3">
                    <div className="fw-bold text-dark mb-2">Assign to</div>
                    <Form.Control
                      type="text"
                      defaultValue="Everyone"
                      className="border-secondary"
                      style={{ fontSize: '16px', padding: '12px' }}
                    />
                  </div>
                  
                  {/* Due Date */}
                  <div className="mb-3">
                    <div className="fw-bold text-dark mb-2">Due</div>
                    <CustomDatePicker
                      defaultValue={formData.dueDate}
                      onChange={(value) => setFormData({ ...formData, dueDate: value })}
                      className="w-100"
                    />
                  </div>
                  
                  {/* Available from and Until */}
                  <div className="row">
                    <div className="col-6">
                      <div className="fw-bold text-dark mb-2">Available from</div>
                      <CustomDatePicker
                        defaultValue={formData.availableDate}
                        onChange={(value) => setFormData({ ...formData, availableDate: value })}
                        className="w-100"
                      />
                    </div>
                    <div className="col-6">
                      <div className="fw-bold text-dark mb-2">Until</div>
                      <CustomDatePicker
                        defaultValue={formData.availableUntil}
                        onChange={(value) => setFormData({ ...formData, availableUntil: value })}
                        className="w-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </Tab.Pane>

          {/* Questions Tab - Placeholder */}
          <Tab.Pane eventKey="questions">
            <div className="p-4 text-center text-muted">
              Questions editor will be implemented here.
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4 pt-4 border-top">
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => handleSave(false)}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="danger"
          onClick={() => handleSave(true)}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save and Publish"}
        </Button>
      </div>
    </div>
  );
}

