import Link from "next/link";

interface CourseNavigationProps {
  cid: string;
}

export default function CourseNavigation({ cid }: CourseNavigationProps) {
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      <Link href={`/Courses/${cid}/Home`} id="wd-course-home-link"
        className="list-group-item active border-0"> Home </Link>
      <Link href={`/Courses/${cid}/Modules`} id="wd-course-modules-link"
        className="list-group-item text-danger border-0"> Modules </Link>
      <Link href={`/Courses/${cid}/Piazza`} id="wd-course-piazza-link"
        className="list-group-item text-danger border-0"> Piazza </Link>
      <Link href={`/Courses/${cid}/Zoom`} id="wd-course-zoom-link"
        className="list-group-item text-danger border-0"> Zoom </Link>
      <Link href={`/Courses/${cid}/Assignments`} id="wd-course-assignments-link"
        className="list-group-item text-danger border-0"> Assignments </Link>
      <Link href={`/Courses/${cid}/Quizzes`} id="wd-course-quizzes-link"
        className="list-group-item text-danger border-0"> Quizzes </Link>
      <Link href={`/Courses/${cid}/People/Table`} id="wd-course-people-link"
        className="list-group-item text-danger border-0" > People </Link>
    </div>
  );
}
