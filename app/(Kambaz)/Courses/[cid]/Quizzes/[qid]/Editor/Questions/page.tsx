"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form, Nav } from "react-bootstrap";
import { FaBan, FaCheckCircle, FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import * as client from "../../../client";
import * as questionsClient from "./client";
import QuestionEditor from "./QuestionEditor";

export default function QuizQuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isFaculty = currentUser?.role === "FACULTY";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizData = await client.findQuizById(qid as string);
        setQuiz(quizData);
        
        const questionsData = await questionsClient.findQuestionsForQuiz(qid as string);
        setQuestions(questionsData);
      } catch (err: any) {
        console.error("Error fetching quiz/questions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (qid && qid !== "new") {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [qid]);

  const handleAddQuestion = async () => {
    if (!qid || qid === "new") {
      alert("Please save the quiz first before adding questions.");
      return;
    }

    try {
      const newQuestion = {
        questionType: "Multiple Choice",
        question: "",
        points: 1,
        correctAnswer: "",
        possibleAnswers: ["", "", "", ""],
        correctAnswers: [],
      };

      const created = await questionsClient.createQuestion(qid as string, newQuestion);
      setQuestions([...questions, created]);
      setEditingQuestionId(created._id);
    } catch (err) {
      console.error("Error creating question:", err);
      alert("Failed to create question. Please try again.");
    }
  };

  const handleSaveQuestion = async (question: any) => {
    try {
      if (question._id) {
        await questionsClient.updateQuestion(question);
        setQuestions(questions.map((q) => (q._id === question._id ? question : q)));
      } else {
        const created = await questionsClient.createQuestion(qid as string, question);
        setQuestions([...questions, created]);
      }
      
      // Refresh quiz to get updated points
      const updatedQuiz = await client.findQuizById(qid as string);
      setQuiz(updatedQuiz);
      
      setEditingQuestionId(null);
    } catch (err) {
      console.error("Error saving question:", err);
      alert("Failed to save question. Please try again.");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await questionsClient.deleteQuestion(questionId);
      setQuestions(questions.filter((q) => q._id !== questionId));
      
      // Refresh quiz to get updated points
      const updatedQuiz = await client.findQuizById(qid as string);
      setQuiz(updatedQuiz);
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Failed to delete question. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Just navigate back - questions are saved individually
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-muted">Loading questions...</div>
      </div>
    );
  }

  if (!isFaculty) {
    return (
      <div className="p-4">
        <div className="alert alert-danger">Only faculty can edit questions.</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">Quiz not found.</div>
      </div>
    );
  }

  return (
    <div id="wd-quiz-questions-editor" className="p-4">
      {/* Header with Points, Published Status, and Menu */}
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <div className="text-muted">
          Points {totalPoints}
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
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)}
            className="text-danger"
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active
            className="bg-light text-dark"
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Questions List */}
      <div className="mb-4">
        {questions.length === 0 ? (
          <div className="text-center text-muted py-5">
            No questions yet. Click "+ New Question" to add one.
          </div>
        ) : (
          <div>
            {questions.map((question, index) => (
              <div key={question._id} className="mb-4 border rounded p-3">
                {editingQuestionId === question._id ? (
                  <QuestionEditor
                    question={question}
                    onSave={handleSaveQuestion}
                    onCancel={() => setEditingQuestionId(null)}
                  />
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="flex-grow-1">
                        <div className="text-muted mb-2">{question.questionType} ({question.points} {question.points === 1 ? "point" : "points"})</div>
                        <div 
                          className="mb-2 question-preview"
                          style={{
                            wordBreak: "break-word"
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: question.question || "(No question text)" 
                          }}
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-muted"
                          onClick={() => setEditingQuestionId(question._id)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                          onClick={() => handleDeleteQuestion(question._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
        <Button
          variant="secondary"
          onClick={handleAddQuestion}
        >
          + New Question
        </Button>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
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

