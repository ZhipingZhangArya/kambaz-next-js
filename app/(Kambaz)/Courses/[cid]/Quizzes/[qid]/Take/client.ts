import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

// Get HTTP_SERVER from environment variable, with fallback
const envServer = process.env.NEXT_PUBLIC_HTTP_SERVER;
const HTTP_SERVER = (envServer && envServer !== 'undefined') 
  ? envServer 
  : 'http://localhost:4000';
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${HTTP_SERVER}/api/attempts`;

export const findLatestAttempt = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/latest`);
  return response.data;
};

export const getAttemptCount = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/count`);
  return response.data;
};

export const createAttempt = async (quizId: string) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};

export const submitAttempt = async (attemptId: string, answers: Record<string, string[]>, timeSpent: number) => {
  const response = await axiosWithCredentials.put(`${ATTEMPTS_API}/${attemptId}/submit`, {
    answers,
    timeSpent,
  });
  return response.data;
};

export const updateAttemptAnswers = async (attemptId: string, answers: Record<string, string[]>) => {
  const response = await axiosWithCredentials.put(`${ATTEMPTS_API}/${attemptId}/answers`, {
    answers,
  });
  return response.data;
};

