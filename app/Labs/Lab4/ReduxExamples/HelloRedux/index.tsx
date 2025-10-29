"use client";
import { useSelector } from "react-redux";

export default function HelloRedux() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { message } = useSelector((state: any) => state.helloReducer);
  return (
    <div id="wd-hello-redux">
      <h3>Hello Redux</h3>
      <h4>{message}</h4>
      <hr />
    </div>
  );
}

