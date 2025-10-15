import Modules from "../Modules/page";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div className="d-flex" id="wd-home">
      <div className="flex-fill me-5">
        <Modules />
      </div>
      <div className="d-none d-lg-block">
        <CourseStatus />
      </div>
    </div>
  );
}
