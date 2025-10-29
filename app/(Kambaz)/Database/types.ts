export interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department: string;
  credits: number;
  coverImage?: string; // Optional - courses may not have cover images
  description: string;
  author?: string; // Optional - some courses may have authors
}

export interface Lesson {
  _id: string;
  name: string;
  description: string;
  module: string;
}

export interface Module {
  _id: string;
  name: string;
  description: string;
  course: string;
  editing?: boolean; // Optional - for UI state management
  lessons?: Lesson[]; // Optional - some modules may not have lessons
}

export interface Assignment {
  _id: string;
  title: string;
  course: string;
  description: string;
  points: number;
  dueDate: string;
  availableDate: string;
}
