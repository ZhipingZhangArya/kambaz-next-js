"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form, Alert } from "react-bootstrap";
import { FaPencilAlt, FaArrowRight } from "react-icons/fa";
import * as client from "../../client";
import * as questionsClient from "../Editor/Questions/client";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime] = useState(new Date());
  const [lastSavedTime, setLastSavedTime] = useState(new Date());
  const [submitted, setSubmitted] = useState(false);
  const [submitTime, setSubmitTime] = useState<Date | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [questionResults, setQuestionResults] = useState<Record<string, { correct: boolean; userAnswer: string[]; correctAnswer: string[] }>>({});

  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    const fetchData = async () => {
      if (!qid || !isFaculty) {
        setLoading(false);
        return;
      }
      
      try {
        const quizData = await client.findQuizById(qid as string);
        setQuiz(quizData);
        
        const questionsData = await questionsClient.findQuestionsForQuiz(qid as string);
        setQuestions(questionsData);
        
        // Initialize user answers
        const initialAnswers: Record<string, string[]> = {};
        questionsData.forEach((q: any) => {
          initialAnswers[q._id] = [];
        });
        setUserAnswers(initialAnswers);
      } catch (err: any) {
        console.error("Error fetching quiz/questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qid, isFaculty]);

  // Auto-save timer
  useEffect(() => {
    if (submitted || !quiz) return;
    
    const interval = setInterval(() => {
      setLastSavedTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [submitted, quiz]);

  const handleAnswerChange = (questionId: string, answer: string, checked: boolean, questionType: string) => {
    setUserAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      
      if (questionType === "True/False" || questionType === "Multiple Choice") {
        if (checked) {
          if (questionType === "True/False") {
            // For True/False, replace the answer
            return { ...prev, [questionId]: [answer] };
          } else {
            // For Multiple Choice, add to array
            return { ...prev, [questionId]: [...currentAnswers, answer] };
          }
        } else {
          // Remove answer
          return { ...prev, [questionId]: currentAnswers.filter((a) => a !== answer) };
        }
      } else {
        // Fill in the Blank - single answer
        return { ...prev, [questionId]: [answer] };
      }
    });
  };

  const handleFillInBlankChange = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value ? [value] : [],
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let earnedPoints = 0;
    const results: Record<string, { correct: boolean; userAnswer: string[]; correctAnswer: string[] }> = {};

    questions.forEach((question: any) => {
      const userAnswer = userAnswers[question._id] || [];
      
      let isCorrect = false;
      let correctAnswers: string[] = [];

      if (question.questionType === "True/False") {
        correctAnswers = question.correctAnswer ? [question.correctAnswer] : [];
        isCorrect = correctAnswers.length > 0 && userAnswer.length > 0 && 
                   correctAnswers[0].toLowerCase().trim() === userAnswer[0]?.toLowerCase().trim();
      } else if (question.questionType === "Multiple Choice") {
        correctAnswers = question.correctAnswers || [];
        // Check if user selected all correct answers and no incorrect ones
        const userSet = new Set(userAnswer.map((a: string) => a.toLowerCase().trim()));
        const correctSet = new Set(correctAnswers.map((a: string) => a.toLowerCase().trim()));
        isCorrect = userSet.size === correctSet.size && 
                   Array.from(userSet).every((a) => correctSet.has(a));
      } else if (question.questionType === "Fill in the Blank") {
        correctAnswers = question.correctAnswers || (question.correctAnswer ? [question.correctAnswer] : []);
        const userAnswerText = userAnswer[0]?.toLowerCase().trim() || "";
        isCorrect = correctAnswers.some((correct: string) => 
          correct.toLowerCase().trim() === userAnswerText
        );
      }

      results[question._id] = {
        correct: isCorrect,
        userAnswer: userAnswer,
        correctAnswer: correctAnswers,
      };

      if (isCorrect) {
        earnedPoints += question.points || 0;
      }
    });

    setQuestionResults(results);
    setScore(earnedPoints);
    setSubmitTime(new Date());
    setSubmitted(true);
  };

  const formatTime = (date: Date) => {
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
        <div className="text-muted">Loading quiz preview...</div>
      </div>
    );
  }

  if (!isFaculty) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">Only faculty can preview quizzes.</div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">Quiz not found or has no questions.</div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = userAnswers[currentQuestion._id] || [];

  return (
    <div id="wd-quiz-preview" className="p-4">
      {/* Warning Banner */}
      <Alert 
        variant="warning" 
        className="d-flex align-items-center mb-3"
        style={{ 
          backgroundColor: "#f8e9e5",
          border: "none",
          color: "#be3a29"
        }}
      >
        <div style={{ fontWeight: "normal", color: "#be3a29" }}>
          This is a preview of the published version of the quiz
        </div>
      </Alert>

      {/* Header with Edit Button */}
      <div className="d-flex justify-content-between align-items-end mb-3">
        <div className="d-flex align-items-end gap-2">
          <h2 className="mb-0">{quiz.title}</h2>
          <span className="text-muted small" style={{ fontSize: "0.875rem" }}>
            Started: {formatTime(startTime)}
          </span>
        </div>
        <Button
          variant="outline-secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}
        >
          <FaPencilAlt className="me-2" />
          Edit Quiz
        </Button>
      </div>

      {/* Quiz Instructions */}
      {quiz.description && (
        <>
          <h4 className="mb-2">Quiz Instructions</h4>
          <div 
            className="mb-2"
            dangerouslySetInnerHTML={{ __html: quiz.description }}
          />
          <hr className="mb-4" />
        </>
      )}

      {!submitted ? (
        <>
          {/* Current Question */}
          <div 
            className="mb-4 p-4 rounded"
            style={{
              border: "1px solid #dee2e6",
              backgroundColor: "#f8f9fa"
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="mb-0">
                Question {currentQuestionIndex + 1}
              </h5>
              <span className="text-muted">
                {currentQuestion.points} {currentQuestion.points === 1 ? "pt" : "pts"}
              </span>
            </div>
            
            <div 
              className="mb-3 question-preview"
              dangerouslySetInnerHTML={{ __html: currentQuestion.question || "(No question text)" }}
            />

            {/* Answer Options */}
            <div className="mb-2">
              {currentQuestion.questionType === "True/False" && (
                <div>
                  {currentQuestion.possibleAnswers?.map((answer: string, index: number) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      label={answer}
                      name={`question-${currentQuestion._id}`}
                      checked={userAnswer.includes(answer)}
                      onChange={(e) => handleAnswerChange(currentQuestion._id, answer, e.target.checked, "True/False")}
                      className="mb-2"
                    />
                  ))}
                </div>
              )}

              {currentQuestion.questionType === "Multiple Choice" && (
                <div>
                  {currentQuestion.possibleAnswers?.map((answer: string, index: number) => (
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={answer}
                      checked={userAnswer.includes(answer)}
                      onChange={(e) => handleAnswerChange(currentQuestion._id, answer, e.target.checked, "Multiple Choice")}
                      className="mb-2"
                    />
                  ))}
                </div>
              )}

              {currentQuestion.questionType === "Fill in the Blank" && (
                <Form.Control
                  type="text"
                  value={userAnswer[0] || ""}
                  onChange={(e) => handleFillInBlankChange(currentQuestion._id, e.target.value)}
                  placeholder="Enter your answer..."
                  className="border-secondary"
                />
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mb-4">
            <Button
              variant="outline-secondary"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button variant="secondary" onClick={handleNext}>
                Next <FaArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button variant="secondary" onClick={calculateScore}>
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Results View */}
          <div className="mb-4">
            <h4 className="mb-3">Quiz Results</h4>
            <div className="mb-4">
              <div className="mb-2">
                <strong>Score for this quiz:</strong> {score} out of {quiz.points}
              </div>
              {submitTime && (
                <>
                  <div className="mb-2">
                    <strong>Submitted:</strong> {formatTime(submitTime)}
                  </div>
                  <div className="mb-2">
                    <strong>This attempt took</strong> {Math.round((submitTime.getTime() - startTime.getTime()) / 60000)} <strong>minutes.</strong>
                  </div>
                </>
              )}
            </div>

            {questions.map((question: any, index: number) => {
              const result = questionResults[question._id];
              const isCorrect = result?.correct || false;
              
              return (
                <div 
                  key={question._id} 
                  className={`mb-4 border rounded p-0 ${!isCorrect ? "border-danger" : ""}`}
                  style={{
                    borderWidth: !isCorrect ? "2px" : "1px"
                  }}
                >
                  {!isCorrect && (
                    <div 
                      className="px-3 py-2 text-white fw-bold"
                      style={{ backgroundColor: "#dc3545" }}
                    >
                      Incorrect
                    </div>
                  )}
                  {isCorrect && (
                    <div 
                      className="px-3 py-2 text-white fw-bold"
                      style={{ backgroundColor: "#28a745" }}
                    >
                      Correct
                    </div>
                  )}
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2 border-bottom pb-2">
                      <h5 className="mb-0">
                        Question {index + 1}
                      </h5>
                      <div className={isCorrect ? "text-success" : "text-danger"}>
                        {isCorrect ? (
                          <span>{question.points} / {question.points} pts</span>
                        ) : (
                          <span>0 / {question.points} pts</span>
                        )}
                      </div>
                    </div>
                  
                  <div 
                    className="mb-3 question-preview"
                    dangerouslySetInnerHTML={{ __html: question.question || "(No question text)" }}
                  />

                  {/* Show answer options with user's selection */}
                  <div className="mb-2">
                    {question.questionType === "True/False" && (
                      <div>
                        {question.possibleAnswers?.map((answer: string, ansIndex: number) => {
                          const isUserAnswer = result?.userAnswer.includes(answer);
                          return (
                            <Form.Check
                              key={ansIndex}
                              type="radio"
                              label={answer}
                              name={`result-${question._id}`}
                              checked={isUserAnswer}
                              disabled
                              className="mb-2"
                            />
                          );
                        })}
                        {!isCorrect && (
                          <div className="mb-2 text-success">
                            <strong>Correct Answer:</strong> {result?.correctAnswer.join(", ") || "N/A"}
                          </div>
                        )}
                      </div>
                    )}

                    {question.questionType === "Multiple Choice" && (
                      <div>
                        {question.possibleAnswers?.map((answer: string, ansIndex: number) => {
                          const isUserAnswer = result?.userAnswer.includes(answer);
                          return (
                            <Form.Check
                              key={ansIndex}
                              type="checkbox"
                              label={answer}
                              checked={isUserAnswer}
                              disabled
                              className="mb-2"
                            />
                          );
                        })}
                        {!isCorrect && (
                          <div className="mb-2 text-success">
                            <strong>Correct Answer:</strong> {result?.correctAnswer.join(", ") || "N/A"}
                          </div>
                        )}
                      </div>
                    )}

                    {question.questionType === "Fill in the Blank" && (
                      <div>
                        <div className="mb-2">
                          <strong>Your Answer:</strong> {result?.userAnswer.join(", ") || "(No answer)"}
                        </div>
                        {!isCorrect && (
                          <div className="mb-2 text-success">
                            <strong>Correct Answer:</strong> {result?.correctAnswer.join(", ") || "N/A"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
            >
              Back to Quiz
            </Button>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="d-flex justify-content-end align-items-center gap-3 mt-4 pt-3 border-top">
        {!submitted && (
          <>
            <div className="text-muted small">
              Quiz saved at {formatTime(lastSavedTime)}
            </div>
            <Button variant="secondary" onClick={calculateScore}>
              Submit Quiz
            </Button>
          </>
        )}
      </div>

      <style jsx global>{`
        .question-preview img {
          max-width: 100% !important;
          max-height: 120px !important;
          height: auto !important;
          object-fit: contain !important;
          display: block;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}

