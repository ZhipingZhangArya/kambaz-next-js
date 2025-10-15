// Import JSON data using ES6 imports
import coursesData from "./courses.json";
import modulesData from "./modules.json";
import assignmentsData from "./assignments.json";
import usersData from "./users.json";
import enrollmentsData from "./enrollments.json";

export const courses = coursesData;
export const modules = modulesData;
export const assignments = assignmentsData;
export const users = usersData;
export const enrollments = enrollmentsData;

export * from "./types";
