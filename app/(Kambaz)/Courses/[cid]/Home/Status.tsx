import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle, FaHome, FaDesktop, FaBullhorn, FaChartBar, FaBell } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { Button } from "react-bootstrap";

export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: "350px" }}>
      <h2 className="fs-4">Course Status</h2>
      <div className="d-flex">
        <div className="w-50 pe-1">
          <Button variant="secondary" className="w-100 text-nowrap" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
            <MdDoNotDisturbAlt className="me-2" /> Unpublish
          </Button>
        </div>
        <div className="w-50">
          <Button variant="success" className="w-100" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
            <FaCheckCircle className="me-2" /> Publish
          </Button>
        </div>
      </div>
      <br />
      <Button variant="secondary" className="w-100 mt-1 text-start" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <BiImport className="me-2" /> Import Existing Content
      </Button>
      <Button variant="secondary" className="w-100 mt-1 text-start" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <LiaFileImportSolid className="me-2" /> Import from Commons
      </Button>
      <Button variant="secondary" className="w-100 mt-1 text-start" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <FaHome className="me-2" /> Choose Home Page
      </Button>
      <Button variant="secondary" className="w-100 mt-1 text-start" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <FaDesktop className="me-2" /> View Course Stream
      </Button>
      <Button variant="secondary" className="w-100 mt-1 text-start" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <FaBullhorn className="me-2" /> New Announcement
      </Button>
      <Button variant="secondary" className="w-100 mt-1 text-start" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <FaChartBar className="me-2" /> New Analytics
      </Button>
      <Button variant="secondary" className="w-100 mt-1 text-start" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
        <FaBell className="me-2" /> View Course Notifications
      </Button>
    </div>
  );
}
