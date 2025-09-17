import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/Cover-1.png" width={200} height={150} alt="React JS" />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link href="/Courses/2345" className="wd-dashboard-course-link">
            <Image src="/images/Cover-2.png" width={200} height={150} alt="Node.js" />
            <div>
              <h5>CS2345 Node.js</h5>
              <p className="wd-dashboard-course-title">
                Backend Development with Node.js
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link href="/Courses/3456" className="wd-dashboard-course-link">
            <Image src="/images/Cover-3.png" width={200} height={150} alt="MongoDB" />
            <div>
              <h5>CS3456 MongoDB</h5>
              <p className="wd-dashboard-course-title">
                Database Management Systems
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link href="/Courses/4567" className="wd-dashboard-course-link">
            <Image src="/images/Cover-4.png" width={200} height={150} alt="JavaScript" />
            <div>
              <h5>CS4567 JavaScript</h5>
              <p className="wd-dashboard-course-title">
                Modern JavaScript Development
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link href="/Courses/5678" className="wd-dashboard-course-link">
            <Image src="/images/Cover-7.png" width={200} height={150} alt="CSS" />
            <div>
              <h5>CS5678 CSS</h5>
              <p className="wd-dashboard-course-title">
                Advanced CSS and Styling
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link href="/Courses/6789" className="wd-dashboard-course-link">
            <Image src="/images/Cover-8.png" width={200} height={150} alt="HTML" />
            <div>
              <h5>CS6789 HTML</h5>
              <p className="wd-dashboard-course-title">
                Web Development Fundamentals
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
        
        <div className="wd-dashboard-course">
          <Link href="/Courses/7890" className="wd-dashboard-course-link">
            <Image src="/images/Cover-9.png" width={200} height={150} alt="Python" />
            <div>
              <h5>CS7890 Python</h5>
              <p className="wd-dashboard-course-title">
                Python Programming Language
              </p>
              <button>Go</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
