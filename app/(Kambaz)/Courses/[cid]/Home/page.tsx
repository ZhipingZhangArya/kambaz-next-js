import Modules from "../Modules/page";
import CourseStatus from "./Status";

interface HomeProps {
  params: Promise<{ cid: string }>;
}

export default async function Home({ params }: HomeProps) {
  return (
    <div className="d-flex" id="wd-home">
      <div className="flex-fill me-5">
        <Modules params={params} />
      </div>
      <div className="d-none d-lg-block">
        <CourseStatus />
      </div>
    </div>
  );
}
