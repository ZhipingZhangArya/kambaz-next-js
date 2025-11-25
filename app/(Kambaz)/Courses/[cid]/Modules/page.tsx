"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import {
  setModules,
  addModule,
  editModule,
  updateModule,
  deleteModule,
} from "./reducer";
import * as client from "../../client";

export default function Modules() {
  const { cid } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();
  const [moduleName, setModuleName] = useState("");

  const fetchModules = async () => {
    if (!cid) {
      dispatch(setModules([]));
      return;
    }
    try {
      const data = await client.findModulesForCourse(cid as string);
      dispatch(setModules(data));
    } catch (error) {
      console.error("Error fetching modules", error);
      dispatch(setModules([]));
    }
  };

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const onCreateModuleForCourse = async () => {
    if (!cid || !moduleName.trim()) return;
    try {
      const newModule = await client.createModuleForCourse(cid as string, {
        name: moduleName,
      });
      dispatch(setModules([...modules, newModule]));
      setModuleName("");
    } catch (error) {
      console.error("Error creating module", error);
    }
  };

  const onRemoveModule = async (moduleId: string) => {
    if (!cid) return;
    try {
      await client.deleteModule(cid as string, moduleId);
      dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
    } catch (error) {
      console.error("Error deleting module", error);
    }
  };

  const onUpdateModule = async (updatedModule: any) => {
    if (!cid) return;
    try {
      const savedModule = await client.updateModule(cid as string, updatedModule);
      const newModules = modules.map((m: any) =>
        m._id === savedModule._id ? savedModule : m
      );
      dispatch(setModules(newModules));
    } catch (error) {
      console.error("Error updating module", error);
    }
  };

  return (
    <div className="wd-modules">
      <ModulesControls
        setModuleName={setModuleName}
        moduleName={moduleName}
        addModule={onCreateModuleForCourse}
      />
      <br />
      <br />
      <br />
      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: any) => (
          <ListGroupItem
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  value={module.name || ""}
                  onChange={(e) => {
                    dispatch(
                      updateModule({ ...module, name: e.target.value })
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateModule({ ...module, editing: false });
                    }
                  }}
                />
              )}
              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={(moduleId) => onRemoveModule(moduleId)}
                editModule={(moduleId) => dispatch(editModule(moduleId))}
              />
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroupItem
                    key={lesson._id}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}{" "}
                    <LessonControlButtons />
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
