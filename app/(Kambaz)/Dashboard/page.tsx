import Link from "next/link";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText } from "react-bootstrap";
import { FiFileText } from "react-icons/fi";

export default function Dashboard() {
  // Course data with proper IDs mapped to titles
  const courses = [
    { id: '1234', title: 'CS1234 React JS', description: 'Full Stack software developer', image: '/images/Cover-1.png' },
    { id: '2345', title: 'CS2345 Node.js', description: 'Backend Development with Node.js', image: '/images/Cover-2.png' },
    { id: '3456', title: 'CS3456 MongoDB', description: 'Database Management Systems', image: '/images/Cover-3.png' },
    { id: '4567', title: 'CS4567 JavaScript', description: 'Modern JavaScript Development', image: '/images/Cover-4.png' },
    { id: '5678', title: 'CS5678 CSS', description: 'Advanced CSS and Styling', image: '/images/Cover-7.png' },
    { id: '6789', title: 'CS6789 HTML', description: 'Web Development Fundamentals', image: '/images/Cover-8.png' },
    { id: '7890', title: 'CS7890 Python', description: 'Python Programming Language', image: '/images/Cover-9.png' },
    { id: '8901', title: 'CS8901 Data Science', description: 'Data Analysis and Machine Learning', image: '/images/Cover-1.png' },
    { id: '9012', title: 'CS9012 AI/ML', description: 'Artificial Intelligence and Machine Learning', image: '/images/Cover-2.png' },
    { id: '0123', title: 'CS0123 Cloud Computing', description: 'Cloud Infrastructure and Services', image: '/images/Cover-3.png' },
    { id: '1234', title: 'CS1234 DevOps', description: 'Development Operations and CI/CD', image: '/images/Cover-4.png' },
    { id: '2345', title: 'CS2345 Cybersecurity', description: 'Information Security and Network Protection', image: '/images/Cover-7.png' }
  ];

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={4} lg={5} className="g-4">
          {courses.map((course, index) => (
            <Col key={index} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link href={`/Courses/${course.id}/Home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark">
                  <CardImg variant="top" src={course.image} width="100%" height={160}/>
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.title}</CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden text-secondary" style={{ height: "20px" }}>
                      {course.description}
                    </CardText>
                    <FiFileText className="text-secondary fs-5" />
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
