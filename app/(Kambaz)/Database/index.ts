// Import JSON data using require for better compatibility with Next.js 15.5.3 + Turbopack
const coursesData = require("./courses.json");
const modulesData = require("./modules.json");
const assignmentsData = require("./assignments.json");
const usersData = require("./users.json");
const enrollmentsData = require("./enrollments.json");

export const courses = coursesData;
export const modules = modulesData;
export const assignments = assignmentsData;
export const users = usersData;
export const enrollments = enrollmentsData;

export * from "./types";
