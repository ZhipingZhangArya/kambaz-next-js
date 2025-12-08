"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import * as client from "../../client";
import * as questionsClient from "../Editor/Questions/client";
import * as attemptsClient from "../Take/client";

export default function QuizResults() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionResults, setQuestionResults] = useState<Record<string, { correct: boolean; userAnswer: string[]; correctAnswer: string[] }>>({});

  const isStudent = currentUser?.role === "STUDENT";

  useEffect(() => {
    const fetchData = async () => {
      if (!qid || !isStudent) {
        setLoading(false);
        return;
      }
      
      try {
        const quizData = await client.findQuizById(qid as string);
        setQuiz(quizData);
        
        const latestAttempt = await attemptsClient.findLatestAttempt(qid as string);
        if (!latestAttempt || !latestAttempt.submittedAt) {
          setError("No submitted attempt found. Please take the quiz first.");
          setLoading(false);
          return;
        }
        setAttempt(latestAttempt);
        
        const questionsData = await questionsClient.findQuestionsForQuiz(qid as string);
        setQuestions(questionsData);
        
        // Calculate results for display
        const results: Record<string, { correct: boolean; userAnswer: string[]; correctAnswer: string[] }> = {};
        
        questionsData.forEach((question: any) => {
          const userAnswer = latestAttempt.answers[question._id] || [];
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
        });
        
        setQuestionResults(results);
      } catch (err: any) {
        console.error("Error fetching quiz/attempt:", err);
        setError(err.response?.data?.error || "Failed to load quiz results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qid, isStudent]);

  const formatTime = (dateString: string) => {
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
        <div className="text-muted">Loading quiz results...</div>
      </div>
    );
  }

  if (error || !quiz || !attempt) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">{error || "Quiz results not found"}</div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz
        </Button>
      </div>
    );
  }

  if (!isStudent) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">Only students can view quiz results.</div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz
        </Button>
      </div>
    );
  }

  return (
    <div id="wd-quiz-results" className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-end mb-3">
        <h2 className="mb-0">{quiz.title}</h2>
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <h4 className="mb-3">Quiz Results</h4>
        <div className="mb-4">
          <div className="mb-2">
            <strong>Score for this quiz:</strong> {attempt.score} out of {quiz.points}
          </div>
          {attempt.submittedAt && (
            <>
              <div className="mb-2">
                <strong>Submitted:</strong> {formatTime(attempt.submittedAt)}
              </div>
              {attempt.timeSpent && (
                <div className="mb-2">
                  <strong>This attempt took</strong> {attempt.timeSpent} <strong>minutes.</strong>
                </div>
              )}
            </>
          )}
        </div>

        {/* Questions with Results */}
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

