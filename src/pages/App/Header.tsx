import React from 'react';
import { FormControl, Stack, Select, MenuItem } from '@mui/material';
import './App.css';

export const Header = ({
  projects,
  selectedProject,
  setSelectedProject,
  modes,
  mode,
  setMode,
}) => {
  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const toolbarItems = () => {
    if (projects.length > 0) {
      return (
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <div className="wrapper">
            <label>Mode:</label>
            <select
              id="modes"
              className="modes"
              value={mode}
              onChange={handleModeChange}
            >
              {modes.map((mode, index) => (
                <option key={index} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          <div className="wrapper">
            <label>Select Project:</label>
            <select
              id="projects"
              className="projects"
              value={selectedProject}
              onChange={handleProjectChange}
            >
              {projects.map((project) => (
                <option key={project.project_id} value={project.project_id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </Stack>
      );
    }
  };

  return <>{toolbarItems()}</>;
};
