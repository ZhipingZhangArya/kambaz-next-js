import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";

interface ModulesProps {
  params: Promise<{ cid: string }>;
}

export default async function Modules({ params }: ModulesProps) {
  const { cid } = await params;
  
  // Course-specific content based on course ID
  const getCourseContent = (courseId: string) => {
    switch (courseId) {
      case '1234':
        return {
          title: 'Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda',
          objectives: [
            'Introduction to the course',
            'Learn what is Web Development'
          ],
          reading: [
            'Full Stack Developer - Chapter 1 - Introduction',
            'Full Stack Developer - Chapter 2 - Creating User Interfaces With HTML'
          ],
          slides: [
            'Introduction to Web Development'
          ]
        };
      case '2345':
        return {
          title: 'Week 1, Lecture 1 - Node.js Fundamentals',
          objectives: [
            'Understanding Node.js runtime',
            'Setting up development environment'
          ],
          reading: [
            'Node.js Documentation - Getting Started',
            'Express.js Guide - Routing'
          ],
          slides: [
            'Node.js Architecture Overview'
          ]
        };
      case '3456':
        return {
          title: 'Week 1, Lecture 1 - Database Design Principles',
          objectives: [
            'Understanding NoSQL databases',
            'MongoDB data modeling'
          ],
          reading: [
            'MongoDB Manual - Data Modeling',
            'Database Design Best Practices'
          ],
          slides: [
            'MongoDB Schema Design'
          ]
        };
      default:
        return {
          title: `Week 1, Lecture 1 - Course ${courseId} Introduction`,
          objectives: [
            'Introduction to the course',
            'Course objectives and expectations'
          ],
          reading: [
            'Course Textbook - Chapter 1',
            'Additional Reading Materials'
          ],
          slides: [
            'Course Introduction Slides'
          ]
        };
    }
  };

  getCourseContent(cid);

  return (
    <div>
      <ModulesControls /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Week 1 <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> LEARNING OBJECTIVES <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> Introduction to the course <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> Learn what is Web Development <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> LESSON 1 <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> LESSON 2 <LessonControlButtons />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Week 2 <ModuleControlButtons />
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> LEARNING OBJECTIVES <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> LESSON 1 <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1">
              <BsGripVertical className="me-2 fs-3" /> LESSON 2 <LessonControlButtons />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
