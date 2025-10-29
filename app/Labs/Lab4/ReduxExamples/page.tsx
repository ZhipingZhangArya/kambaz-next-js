"use client";
import HelloRedux from "./HelloRedux";
import CounterRedux from "./CounterRedux";
import AddRedux from "./AddRedux";
import TodoList from "./todos/TodoList";

export const dynamic = 'force-dynamic';

export default function ReduxExamples() {
  return(
    <div id="wd-redux-examples" className="mt-4">
      <h2>Redux Examples</h2>
      <HelloRedux />
      <CounterRedux />
      <AddRedux />
      <TodoList />
    </div>
  );
}

