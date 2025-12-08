"use client";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import RichTextEditor from "../RichTextEditor";

interface QuestionEditorProps {
  question: any;
  onSave: (question: any) => void;
  onCancel: () => void;
}

export default function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
  const [formData, setFormData] = useState({
    questionType: question.questionType || "Multiple Choice",
    question: question.question || "",
    points: question.points || 1,
    correctAnswer: question.correctAnswer || "",
    possibleAnswers: question.possibleAnswers || (question.questionType === "True/False" ? ["True", "False"] : question.questionType === "Fill in the Blank" ? [] : ["", "", "", ""]),
    correctAnswers: question.correctAnswers || (question.questionType === "Fill in the Blank" && question.correctAnswer ? [question.correctAnswer] : []),
  });

  const handleQuestionTypeChange = (newType: string) => {
    if (newType === "True/False") {
      setFormData((prev) => ({
        ...prev,
        questionType: "True/False",
        possibleAnswers: ["True", "False"],
        correctAnswers: [],
        correctAnswer: prev.correctAnswer || "",
      }));
    } else if (newType === "Fill in the Blank") {
      setFormData((prev) => ({
        ...prev,
        questionType: "Fill in the Blank",
        possibleAnswers: [],
        correctAnswers: prev.correctAnswers.length > 0 ? prev.correctAnswers : (prev.correctAnswer ? [prev.correctAnswer] : [""]),
        correctAnswer: prev.correctAnswer || "",
      }));
    } else if (newType === "Multiple Choice") {
      setFormData((prev) => ({
        ...prev,
        questionType: "Multiple Choice",
        possibleAnswers: prev.possibleAnswers.length > 0 ? prev.possibleAnswers : ["", "", "", ""],
        correctAnswer: "",
      }));
    }
  };

  const handleSave = () => {
    const questionData = {
      ...question,
      ...formData,
    };
    onSave(questionData);
  };

  const handleAddAnswer = () => {
    setFormData({
      ...formData,
      possibleAnswers: [...formData.possibleAnswers, ""],
    });
  };

  const handleRemoveAnswer = (index: number) => {
    const answerToRemove = formData.possibleAnswers[index];
    const newAnswers = formData.possibleAnswers.filter((_: string, i: number) => i !== index);
    setFormData({
      ...formData,
      possibleAnswers: newAnswers,
      correctAnswers: formData.correctAnswers.filter((ans: string) => ans !== answerToRemove),
    });
  };

  const handleCorrectAnswerToggle = (index: number) => {
    const answer = formData.possibleAnswers[index];
    if (!answer || answer.trim() === "") {
      return; // Don't allow marking empty answers as correct
    }
    
    if (formData.questionType === "True/False") {
      // For True/False, only one answer can be correct
      // If clicking the current correct answer, do nothing
      // Otherwise, set this as the only correct answer
      if (formData.correctAnswer === answer) {
        return; // Already correct, do nothing
      }
      setFormData({
        ...formData,
        correctAnswer: answer,
        correctAnswers: [answer],
      });
    } else {
      // Toggle selection for multiple choice
      const currentIndex = formData.correctAnswers.indexOf(answer);
      if (currentIndex >= 0) {
        setFormData({
          ...formData,
          correctAnswers: formData.correctAnswers.filter((ans: string) => ans !== answer),
        });
      } else {
        setFormData({
          ...formData,
          correctAnswers: [...formData.correctAnswers, answer],
        });
      }
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...formData.possibleAnswers];
    const oldAnswer = newAnswers[index];
    newAnswers[index] = value;
    
    // Update correctAnswers if the answer text changed
    const updatedCorrectAnswers = formData.correctAnswers.map((ans: string) => {
      if (ans === oldAnswer) {
        return value; // Update the correct answer text
      }
      return ans;
    }).filter((ans: string) => newAnswers.includes(ans)); // Remove if answer was deleted
    
    setFormData({
      ...formData,
      possibleAnswers: newAnswers,
      correctAnswers: updatedCorrectAnswers,
    });
  };

  return (
    <div>
      {/* Question Type and Points - Side by Side */}
      <div className="row mb-3">
        <div className="col-md-6">
          <Form.Group>
            <Form.Label className="fw-bold">Question Type:</Form.Label>
            <Form.Select
              value={formData.questionType}
              onChange={(e) => handleQuestionTypeChange(e.target.value)}
              className="border-secondary"
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="True/False">True/False</option>
              <option value="Fill in the Blank">Fill in the Blank</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-6">
          <Form.Group>
            <Form.Label className="fw-bold">Points:</Form.Label>
            <Form.Control
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
              className="border-secondary"
              min="0"
            />
          </Form.Group>
        </div>
      </div>

      {/* Guidance Text */}
      <div className="mb-3 text-muted" style={{ fontSize: "0.9rem" }}>
        ** Enter your questions and multiple answers, then set the correct answer(s).
      </div>

      {/* Question Text - Rich Text Editor */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Question:</Form.Label>
        <RichTextEditor
          value={formData.question}
          onChange={(value) => setFormData({ ...formData, question: value })}
          placeholder="Enter question text..."
        />
      </Form.Group>

      {/* Answers based on question type */}
      {formData.questionType === "True/False" && (
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Answers:</Form.Label>
          {formData.possibleAnswers.map((answer: string, index: number) => {
            const isCorrect = formData.correctAnswer === answer;
            return (
              <div key={index} className="d-flex align-items-center mb-2">
                <Button
                  variant={isCorrect ? "success" : "secondary"}
                  onClick={() => handleCorrectAnswerToggle(index)}
                  className="me-2"
                  style={{ minWidth: "150px" }}
                >
                  {isCorrect ? "Correct Answer" : "Possible Answer"}
                </Button>
                <Form.Control
                  type="text"
                  value={answer}
                  readOnly
                  className="border-secondary bg-light"
                  style={{ cursor: "not-allowed" }}
                />
              </div>
            );
          })}
        </Form.Group>
      )}

      {formData.questionType === "Fill in the Blank" && (
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Correct Answers:</Form.Label>
          {formData.correctAnswers.map((answer: string, index: number) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <Form.Control
                type="text"
                value={answer}
                onChange={(e) => {
                  const newCorrectAnswers = [...formData.correctAnswers];
                  newCorrectAnswers[index] = e.target.value;
                  setFormData({
                    ...formData,
                    correctAnswers: newCorrectAnswers,
                    correctAnswer: newCorrectAnswers[0] || "", // Keep first answer in correctAnswer for backward compatibility
                  });
                }}
                className="border-secondary"
                placeholder={`Correct answer ${index + 1}`}
              />
              {formData.correctAnswers.length > 1 && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger ms-2"
                  onClick={() => {
                    const newCorrectAnswers = formData.correctAnswers.filter((_: string, i: number) => i !== index);
                    setFormData({
                      ...formData,
                      correctAnswers: newCorrectAnswers,
                      correctAnswer: newCorrectAnswers[0] || "",
                    });
                  }}
                >
                  <FaTrash />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setFormData({
                ...formData,
                correctAnswers: [...formData.correctAnswers, ""],
              });
            }}
            className="mt-2"
          >
            + Add Another Correct Answer
          </Button>
        </Form.Group>
      )}

      {formData.questionType === "Multiple Choice" && (
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Answers:</Form.Label>
          {formData.possibleAnswers.map((answer: string, index: number) => {
            const isCorrect = formData.correctAnswers.includes(answer);
            return (
              <div key={index} className="d-flex align-items-center mb-2">
                <Button
                  variant={isCorrect ? "success" : "secondary"}
                  onClick={() => handleCorrectAnswerToggle(index)}
                  className="me-2"
                  style={{ minWidth: "150px" }}
                  disabled={!answer || answer.trim() === ""}
                >
                  {isCorrect ? "Correct Answer" : "Possible Answer"}
                </Button>
                <Form.Control
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="border-secondary"
                  placeholder={`Answer ${index + 1}`}
                />
                {formData.possibleAnswers.length > 2 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger ms-2"
                    onClick={() => handleRemoveAnswer(index)}
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            );
          })}
          <Button
            variant="link"
            size="sm"
            onClick={handleAddAnswer}
            className="mt-2"
          >
            + Add Another Answer
          </Button>
        </Form.Group>
      )}

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Update Question
        </Button>
      </div>
    </div>
  );
}

