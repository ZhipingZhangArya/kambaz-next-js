import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  try {
    const { data } = await axiosWithCredentials.get(
      `${USERS_API}/current/courses`
    );
    return data;
  } catch (error: any) {
    // If 401, user is not authenticated - return empty array
    if (error.response?.status === 401) {
      return [];
    }
    throw error;
  }
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course
  );
  return data;
};

export const deleteCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${COURSES_API}/${courseId}`
  );
  return data;
};

export const updateCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${course._id}`,
    course
  );
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return data;
};

export const createModuleForCourse = async (
  courseId: string,
  module: any
) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return data;
};

const MODULES_API = `${HTTP_SERVER}/api/modules`;

export const deleteModule = async (courseId: string, moduleId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${COURSES_API}/${courseId}/modules/${moduleId}`
  );
  return data;
};

export const updateModule = async (courseId: string, module: any) => {
  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${courseId}/modules/${module._id}`,
    module
  );
  return data;
};

// People Table functions
export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};

export const createUserForCourse = async (courseId: string, user: any) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/users`,
    user
  );
  return data;
};

export const updateUser = async (user: any) => {
  const { data } = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return data;
};

export const deleteUser = async (userId: string) => {
  const { data } = await axiosWithCredentials.delete(`${USERS_API}/${userId}`);
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return data;
};
