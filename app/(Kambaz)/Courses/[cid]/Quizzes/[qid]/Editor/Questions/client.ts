import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

// Get HTTP_SERVER from environment variable, with fallback
const envServer = process.env.NEXT_PUBLIC_HTTP_SERVER;
const HTTP_SERVER = (envServer && envServer !== 'undefined') 
  ? envServer 
  : 'http://localhost:4000';
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const QUESTIONS_API = `${HTTP_SERVER}/api/questions`;

// Get all questions for a quiz
export const findQuestionsForQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/questions`
  );
  return data;
};

// Get a single question by ID
export const findQuestionById = async (questionId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUESTIONS_API}/${questionId}`);
  return data;
};

// Create a new question
export const createQuestion = async (quizId: string, question: any) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return data;
};

// Update a question
export const updateQuestion = async (question: any) => {
  const { data } = await axiosWithCredentials.put(
    `${QUESTIONS_API}/${question._id}`,
    question
  );
  return data;
};

// Delete a question
export const deleteQuestion = async (questionId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${QUESTIONS_API}/${questionId}`
  );
  return data;
};

