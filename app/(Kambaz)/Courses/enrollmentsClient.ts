import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;

export const fetchMyEnrollments = async () => {
  try {
    const { data } = await axiosWithCredentials.get(
      `${USERS_API}/current/enrollments`
    );
    return data;
  } catch (error: any) {
    // If 401, user is not authenticated - return empty array
    // This can happen in incognito mode when third-party cookies are blocked
    if (error.response?.status === 401) {
      return [];
    }
    throw error;
  }
};

export const enrollInCourse = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.post(
      `${USERS_API}/current/enrollments/${courseId}`
    );
    return data;
  } catch (error: any) {
    // If 401, user is not authenticated
    // This can happen in incognito mode when third-party cookies are blocked
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please sign in again. Note: Third-party cookies may be blocked in incognito mode.");
    }
    throw error;
  }
};

export const unenrollFromCourse = async (courseId: string) => {
  try {
    const { data } = await axiosWithCredentials.delete(
      `${USERS_API}/current/enrollments/${courseId}`
    );
    return data;
  } catch (error: any) {
    // If 401, user is not authenticated
    // This can happen in incognito mode when third-party cookies are blocked
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please sign in again. Note: Third-party cookies may be blocked in incognito mode.");
    }
    throw error;
  }
};
