import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

// Get HTTP_SERVER from environment variable, with fallback
const envServer = process.env.NEXT_PUBLIC_HTTP_SERVER;
const HTTP_SERVER = (envServer && envServer !== 'undefined') 
  ? envServer 
  : 'http://localhost:4000';
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

// Get all quizzes for a course
export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/quizzes`
  );
  return data;
};

// Get a single quiz by ID
export const findQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return data;
};

// Create a new quiz
export const createQuiz = async (courseId: string, quiz: any) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quiz
  );
  return data;
};

// Update a quiz
export const updateQuiz = async (quiz: any) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz._id}`,
    quiz
  );
  return data;
};

// Delete a quiz
export const deleteQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}`
  );
  return data;
};

// Toggle publish status
export const togglePublishQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quizId}/publish`
  );
  return data;
};

// Publish a quiz (uses togglePublishQuiz - call it if quiz is not published)
export const publishQuiz = async (quizId: string) => {
  return await togglePublishQuiz(quizId);
};

// Unpublish a quiz (uses togglePublishQuiz - call it if quiz is published)
export const unpublishQuiz = async (quizId: string) => {
  return await togglePublishQuiz(quizId);
};

