"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form, Alert } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import * as client from "../../client";
import * as questionsClient from "../Editor/Questions/client";
import * as attemptsClient from "./client";

export default function QuizTake() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime] = useState(new Date());
  const [lastSavedTime, setLastSavedTime] = useState(new Date());
  const [submitted, setSubmitted] = useState(false);
  const [submitTime, setSubmitTime] = useState<Date | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [questionResults, setQuestionResults] = useState<Record<string, { correct: boolean; userAnswer: string[]; correctAnswer: string[] }>>({});
  const [isSaving, setIsSaving] = useState(false);

  const isStudent = currentUser?.role === "STUDENT";

  useEffect(() => {
    const fetchData = async () => {
      if (!qid || !isStudent) {
        setLoading(false);
        return;
      }
      
      try {
        // Check attempt count
        let attemptCount = 0;
        try {
          const attemptCountData = await attemptsClient.getAttemptCount(qid as string);
          attemptCount = attemptCountData.count || 0;
        } catch (err: any) {
          // If error, assume no attempts yet (route should return 0, but handle gracefully)
          console.log("Error getting attempt count, assuming 0:", err);
          attemptCount = 0;
        }
        
        const quizData = await client.findQuizById(qid as string);
        setQuiz(quizData);
        
        // Check if student can take the quiz
        const attemptsAllowed = quizData.attemptsAllowed || 1;
        if (attemptCount >= attemptsAllowed) {
          setError(`You have reached the maximum number of attempts (${attemptsAllowed}).`);
          setLoading(false);
          return;
        }

        // Check if quiz is available
        const now = new Date();
        if (quizData.availableDate && new Date(quizData.availableDate) > now) {
          setError("This quiz is not yet available.");
          setLoading(false);
          return;
        }
        if (quizData.availableUntil && new Date(quizData.availableUntil) < now) {
          setError("This quiz is no longer available.");
          setLoading(false);
          return;
        }

        // Check if there's an existing unsubmitted attempt
        let existingAttempt;
        try {
          existingAttempt = await attemptsClient.findLatestAttempt(qid as string);
          if (existingAttempt && !existingAttempt.submittedAt) {
            // Resume existing attempt
            setAttempt(existingAttempt);
            setUserAnswers(existingAttempt.answers || {});
          } else {
            // Create new attempt
            const newAttempt = await attemptsClient.createAttempt(qid as string);
            setAttempt(newAttempt);
          }
        } catch (err: any) {
          // No existing attempt, create new one
          const newAttempt = await attemptsClient.createAttempt(qid as string);
          setAttempt(newAttempt);
        }
        
        const questionsData = await questionsClient.findQuestionsForQuiz(qid as string);
        setQuestions(questionsData);
        
        // Initialize user answers if not resuming
        if (!existingAttempt || existingAttempt.submittedAt) {
          const initialAnswers: Record<string, string[]> = {};
          questionsData.forEach((q: any) => {
            initialAnswers[q._id] = [];
          });
          setUserAnswers(initialAnswers);
        }
      } catch (err: any) {
        console.error("Error fetching quiz/questions:", err);
        setError(err.response?.data?.error || "Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qid, isStudent]);

  // Auto-save answers
  useEffect(() => {
    if (submitted || !attempt || !attempt._id) return;
    
    const saveTimer = setTimeout(async () => {
      try {
        await attemptsClient.updateAttemptAnswers(attempt._id, userAnswers);
        setLastSavedTime(new Date());
      } catch (err) {
        console.error("Error auto-saving answers:", err);
      }
    }, 5000); // Save after 5 seconds of inactivity

    return () => clearTimeout(saveTimer);
  }, [userAnswers, attempt, submitted]);

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

  const handleAnswerChange = (questionId: string, answer: string, checked: boolean, questionType: string) => {
    setUserAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      
      if (questionType === "True/False" || questionType === "Multiple Choice") {
        if (checked) {
          if (questionType === "True/False") {
            return { ...prev, [questionId]: [answer] };
          } else {
            return { ...prev, [questionId]: [...currentAnswers, answer] };
          }
        } else {
          return { ...prev, [questionId]: currentAnswers.filter((a) => a !== answer) };
        }
      } else {
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

  const handleSubmit = async () => {
    if (!attempt || !attempt._id) {
      alert("Attempt not found. Please refresh the page.");
      return;
    }

    if (!confirm("Are you sure you want to submit this quiz? You cannot change your answers after submission.")) {
      return;
    }

    setIsSaving(true);
    try {
      const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 60000);
      const submittedAttempt = await attemptsClient.submitAttempt(
        attempt._id,
        userAnswers,
        timeSpent
      );

      // Calculate results for display
      const results: Record<string, { correct: boolean; userAnswer: string[]; correctAnswer: string[] }> = {};
      let earnedPoints = 0;

      questions.forEach((question: any) => {
        const userAnswer = userAnswers[question._id] || [];
        let isCorrect = false;
        let correctAnswers: string[] = [];

        if (question.questionType === "True/False") {
          correctAnswers = question.correctAnswer ? [question.correctAnswer] : [];
          isCorrect =
            correctAnswers.length > 0 &&
            userAnswer.length > 0 &&
            correctAnswers[0].toLowerCase().trim() === userAnswer[0]?.toLowerCase().trim();
        } else if (question.questionType === "Multiple Choice") {
          correctAnswers = question.correctAnswers || [];
          const userSet = new Set(userAnswer.map((a: string) => a.toLowerCase().trim()));
          const correctSet = new Set(correctAnswers.map((a: string) => a.toLowerCase().trim()));
          isCorrect =
            userSet.size === correctSet.size &&
            Array.from(userSet).every((a) => correctSet.has(a));
        } else if (question.questionType === "Fill in the Blank") {
          correctAnswers =
            question.correctAnswers || (question.correctAnswer ? [question.correctAnswer] : []);
          const userAnswerText = userAnswer[0]?.toLowerCase().trim() || "";
          isCorrect = correctAnswers.some(
            (correct: string) => correct.toLowerCase().trim() === userAnswerText
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

      setScore(submittedAttempt.score);
      setQuestionResults(results);
      setSubmitTime(new Date());
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting quiz:", err);
      alert(err.response?.data?.error || "Failed to submit quiz. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz
        </Button>
      </div>
    );
  }

  if (!isStudent) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">Only students can take quizzes.</div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">This quiz has no questions yet.</div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div id="wd-quiz-take" className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-end mb-3">
        <div className="d-flex align-items-end gap-2">
          <h2 className="mb-0">{quiz.title}</h2>
          <span className="text-muted small" style={{ fontSize: "0.875rem" }}>
            Started: {formatTime(startTime)}
          </span>
        </div>
      </div>

      {/* Quiz Instructions */}
      {quiz.description && (
        <>
          <h4 className="mb-2">Quiz Instructions</h4>
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: quiz.description }}
          />
          <hr className="mb-4" />
        </>
      )}

      {!submitted ? (
        <>
          {/* Current Question */}
          <div className="mb-4 p-4 rounded" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
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
            <div className="mb-4">
              {currentQuestion.questionType === "True/False" && (
                <div>
                  {currentQuestion.possibleAnswers?.map((answer: string, index: number) => {
                    const answers = userAnswers[currentQuestion._id] || [];
                    const isSelected = answers.includes(answer);
                    return (
                      <Form.Check
                        key={index}
                        type="radio"
                        label={answer}
                        name={`question-${currentQuestion._id}`}
                        checked={!!isSelected}
                        onChange={(e) =>
                          handleAnswerChange(currentQuestion._id, answer, e.target.checked, currentQuestion.questionType)
                        }
                        className="mb-2"
                      />
                    );
                  })}
                </div>
              )}

              {currentQuestion.questionType === "Multiple Choice" && (
                <div>
                  {currentQuestion.possibleAnswers?.map((answer: string, index: number) => {
                    const answers = userAnswers[currentQuestion._id] || [];
                    const isSelected = answers.includes(answer);
                    return (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        label={answer}
                        checked={!!isSelected}
                        onChange={(e) =>
                          handleAnswerChange(currentQuestion._id, answer, e.target.checked, currentQuestion.questionType)
                        }
                        className="mb-2"
                      />
                    );
                  })}
                </div>
              )}

              {currentQuestion.questionType === "Fill in the Blank" && (
                <Form.Control
                  type="text"
                  value={userAnswers[currentQuestion._id]?.[0] || ""}
                  onChange={(e) => handleFillInBlankChange(currentQuestion._id, e.target.value)}
                  placeholder="Enter your answer"
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
              <Button variant="secondary" onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? "Submitting..." : "Submit Quiz"}
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
      {!submitted && (
        <div className="d-flex justify-content-end align-items-center mt-4 pt-3 border-top">
          <div className="d-flex gap-3 align-items-center">
            <div className="text-muted small">
              Quiz saved at {formatTime(lastSavedTime)}
            </div>
            <Button variant="secondary" onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </div>
      )}

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

