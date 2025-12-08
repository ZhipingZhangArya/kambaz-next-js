"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Table } from "react-bootstrap";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import * as client from "../client";
import * as attemptsClient from "./Take/client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);

  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid) {
        setError("Quiz ID not found");
        setLoading(false);
        return;
      }
      
      try {
        const data = await client.findQuizById(qid as string);
        setQuiz(data);
        setError(null);
        
        // Debug: log quiz data to check attemptsAllowed
        console.log("[QuizDetails] Quiz data:", {
          multipleAttempts: data.multipleAttempts,
          attemptsAllowed: data.attemptsAllowed,
          quizId: qid
        });

        // If student, fetch attempt info
        if (isStudent) {
          try {
            const countData = await attemptsClient.getAttemptCount(qid as string);
            setAttemptCount(countData.count || 0);
            
            const latest = await attemptsClient.findLatestAttempt(qid as string);
            setLatestAttempt(latest);
          } catch (err) {
            // No attempts yet, that's fine
            console.log("No attempts found:", err);
          }
        }
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
        if (err.response?.status === 404) {
          setError("Quiz not found");
        } else if (err.response?.status === 403) {
          setError("Quiz is not available");
        } else {
          setError("Unable to load quiz.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [qid]);

  // Format date for display (e.g., "Sep 21 at 1pm")
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not set";
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

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-muted">Loading quiz...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">{error || "Quiz not found"}</div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  return (
    <div id="wd-quiz-details" className="p-4">
      {/* Header with Action Buttons */}
      {isFaculty && (
        <div className="d-flex justify-content-end mb-3">
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
            >
              Preview
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}
            >
              <FaPencilAlt className="me-2" />
              Edit
            </Button>
          </div>
        </div>
      )}

      {/* Content with Dotted Border */}
      <div 
        className="p-4"
        style={{ 
          border: "2px dashed #ccc",
          borderRadius: "4px"
        }}
      >
        {/* Quiz Title */}
        <h1 className="mb-4">{quiz.title}</h1>

        {/* Faculty View */}
        {isFaculty && (
          <>
            {/* Quiz Settings List */}
            <div className="mb-4" style={{ maxWidth: "800px" }}>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Quiz Type:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.quizType || "Graded Quiz"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Points:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.points || 0}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Assignment Group:</strong>
                </div>
                <div className="text-start flex-grow-1">{(quiz.assignmentGroup || "Quizzes").toUpperCase()}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Shuffle Answers:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.shuffleAnswers !== false ? "Yes" : "No"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Time Limit:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.timeLimit ? `${quiz.timeLimit} Minutes` : "20 Minutes"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Multiple Attempts:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.multipleAttempts ? "Yes" : "No"}</div>
              </div>
              {quiz.multipleAttempts && (
                <div className="d-flex mb-2 align-items-start">
                  <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                    <strong>How Many Attempts:</strong>
                  </div>
                  <div className="text-start flex-grow-1">{quiz.attemptsAllowed || 1}</div>
                </div>
              )}
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>View Responses:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.viewResponses || "Always"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Show Correct Answers:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.showCorrectAnswers ? "Immediately" : "Never"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>One Question at a Time:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.oneQuestionAtATime !== false ? "Yes" : "No"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Require Respondus LockDown Browser:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.requireRespondusLockDownBrowser ? "Yes" : "No"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Required to View Quiz Results:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.requiredToViewQuizResults ? "Yes" : "No"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Webcam Required:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.webcamRequired ? "Yes" : "No"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Lock Questions After Answering:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Access Code:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.accessCode || "(blank)"}</div>
              </div>
            </div>

            {/* Availability and Due Dates Table */}
            <div className="mt-4">
              <Table className="mb-0" style={{ borderBottom: "1px solid #333" }}>
                <thead>
                  <tr>
                    <th className="fw-bold" style={{ border: "none", borderBottom: "1px solid #333" }}>Due</th>
                    <th className="fw-bold" style={{ border: "none", borderBottom: "1px solid #333" }}>For</th>
                    <th className="fw-bold" style={{ border: "none", borderBottom: "1px solid #333" }}>Available from</th>
                    <th className="fw-bold" style={{ border: "none", borderBottom: "1px solid #333" }}>Until</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "none" }}>{formatDate(quiz.dueDate)}</td>
                    <td style={{ border: "none" }}>Everyone</td>
                    <td style={{ border: "none" }}>{formatDate(quiz.availableDate)}</td>
                    <td style={{ border: "none" }}>{formatDate(quiz.availableUntil || quiz.dueDate)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </>
        )}

        {/* Student View - Simplified */}
        {isStudent && (
          <>
            <div className="mb-4" style={{ maxWidth: "800px" }}>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Due:</strong>
                </div>
                <div className="text-start flex-grow-1">{formatDate(quiz.dueDate)}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Available from:</strong>
                </div>
                <div className="text-start flex-grow-1">{formatDate(quiz.availableDate)}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Time Limit:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.timeLimit ? `${quiz.timeLimit} Minutes` : "20 Minutes"}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Points:</strong>
                </div>
                <div className="text-start flex-grow-1">{quiz.points || 0}</div>
              </div>
              <div className="d-flex mb-2 align-items-start">
                <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                  <strong>Attempts:</strong>
                </div>
                <div className="text-start flex-grow-1">
                  {(() => {
                    const allowed = quiz.multipleAttempts ? (quiz.attemptsAllowed ?? 1) : 1;
                    return `${attemptCount} / ${allowed} attempt${allowed !== 1 ? "s" : ""}`;
                  })()}
                </div>
              </div>
              {latestAttempt && latestAttempt.submittedAt && (
                <div className="d-flex mb-2 align-items-start">
                  <div className="text-end me-4" style={{ width: "280px", flexShrink: 0 }}>
                    <strong>Last Score:</strong>
                  </div>
                  <div className="text-start flex-grow-1">
                    {latestAttempt.score} / {quiz.points}
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mt-4">
              {latestAttempt && latestAttempt.submittedAt ? (
                <div className="d-flex gap-2 justify-content-center">
                  <Button
                    variant="outline-secondary"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Results`)}
                  >
                    View Last Attempt
                  </Button>
                  {quiz.multipleAttempts && attemptCount < (quiz.attemptsAllowed || 1) && (
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)}
                    >
                      Take the Quiz Again
                    </Button>
                  )}
                  {(!quiz.multipleAttempts || attemptCount >= (quiz.attemptsAllowed || 1)) && (
                    <Button
                      variant="danger"
                      size="lg"
                      disabled
                    >
                      Maximum Attempts Reached
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {attemptCount < (quiz.attemptsAllowed || 1) ? (
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)}
                    >
                      {latestAttempt && !latestAttempt.submittedAt ? "Continue Quiz" : "Take the Quiz"}
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="lg"
                      disabled
                    >
                      Maximum Attempts Reached
                    </Button>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

