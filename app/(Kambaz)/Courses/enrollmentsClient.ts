import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

// Get HTTP_SERVER from environment variable, with fallback
const envServer = process.env.NEXT_PUBLIC_HTTP_SERVER;
const HTTP_SERVER = (envServer && envServer !== 'undefined') 
  ? envServer 
  : 'http://localhost:4000';
const USERS_API = `${HTTP_SERVER}/api/users`;

export const fetchMyEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/enrollments`
  );
  return data;
};

export const enrollInCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/enrollments/${courseId}`
  );
  return data;
};

export const unenrollFromCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${USERS_API}/current/enrollments/${courseId}`
  );
  return data;
};
